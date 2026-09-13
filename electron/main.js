const { app, BrowserWindow, ipcMain, dialog, Menu, shell, safeStorage, crashReporter } = require('electron');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const https = require('https');
const os = require('os');

// Captures native crashes (GPU/renderer process killed, out-of-memory, etc.)
// that never reach JS-level handlers at all - keeps dumps on disk only,
// nothing is ever uploaded anywhere.
crashReporter.start({ uploadToServer: false, compress: true });

let mainWindow;

const APP_VERSION = '2.0.0';
const USER_AGENT = `RetroVault-Archive-Manager/${APP_VERSION} (Desktop Application)`;

// Kept short for quick calls (search, metadata, etc). File PUTs override this
// per-request with timeout: 0 - a 60s ceiling would abort any upload of a
// large file on a normal connection mid-stream, and cancelling a request
// whose body is an open file stream is exactly the kind of thing that can
// surface as an unhandled error and take the whole process down with it.
const axiosInstance = axios.create({
  timeout: 60000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  maxRedirects: 5,
  headers: { 'User-Agent': USER_AGENT },
  httpsAgent: new https.Agent({
    rejectUnauthorized: true
  })
});

axiosInstance.interceptors.request.use((config) => {
  if (config.headers.Authorization) {
    config._authHeader = config.headers.Authorization;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (config._authHeader && error.response?.status === 301) {
      config.headers.Authorization = config._authHeader;
      return axiosInstance(config);
    }
    return Promise.reject(error);
  }
);

async function retryOperation(operation, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      // A "SlowDown" (task queue saturated) won't clear in the few seconds an
      // internal retry loop can afford - hammering it again only adds load to
      // an already-congested queue. Fail fast here and let the caller apply a
      // much longer, batch-level cooldown instead.
      const isTaskQueueSlowDown = typeof error.response?.data === 'string' &&
        error.response.data.includes('<Code>SlowDown</Code>');
      const isRetryable = !isTaskQueueSlowDown && (
        error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' ||
        error.response?.status === 503 || error.response?.status === 429
      );

      if (isLastAttempt || !isRetryable) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// archive.org's S3-like API answers throttling/errors with an XML body
// (e.g. <Error><Code>SlowDown</Code><Message>...</Message></Error>).
// Turn that into a clean { code, message } pair instead of dumping raw XML in the UI.
function parseS3Error(data, fallbackMessage) {
  if (typeof data === 'string' && data.includes('<Error>')) {
    const code = /<Code>([^<]+)<\/Code>/.exec(data)?.[1] || null;
    const message = /<Message>([^<]+)<\/Message>/.exec(data)?.[1];
    if (code) return { code, message: message || fallbackMessage };
  }
  if (typeof data === 'string' && data.trim()) {
    return { code: null, message: data };
  }
  return { code: null, message: fallbackMessage };
}

// --- Crash safety net -------------------------------------------------
// If anything throws outside a try/catch (e.g. an unhandled 'error' event
// on a request/file stream when a slow upload is aborted), Node's default
// behaviour is to kill the whole process with no trace. Log it instead so a
// silent "the app just closed" can actually be diagnosed from
// %APPDATA%/ia-item-manager/crash.log (userData path - keyed to package.json's
// "name", which stays fixed across rebrands so existing saved credentials
// and this log history keep working across app renames).
const crashLogPath = path.join(app.getPath('userData'), 'crash.log');

function logCrash(label, err) {
  try {
    const line = `[${new Date().toISOString()}] ${label}: ${err?.stack || err}\n`;
    fs.appendFileSync(crashLogPath, line);
  } catch {
    /* best effort - if we can't even write the log, there's nothing more to do */
  }
}

process.on('uncaughtException', (err) => logCrash('uncaughtException', err));
process.on('unhandledRejection', (reason) => logCrash('unhandledRejection', reason));

// Lightweight, always-on activity trail. Even when nothing above ever fires,
// this shows the last thing that actually happened right before the app
// disappeared (which file, what state, memory at the time) instead of
// nothing at all - often more useful than a crash report.
const activityLogPath = path.join(app.getPath('userData'), 'activity.log');
const MAX_ACTIVITY_LOG_BYTES = 512 * 1024;

function logActivity(line) {
  try {
    if (fs.existsSync(activityLogPath) && fs.statSync(activityLogPath).size > MAX_ACTIVITY_LOG_BYTES) {
      fs.renameSync(activityLogPath, activityLogPath + '.old');
    }
    const mem = process.memoryUsage();
    const memInfo = `rss=${Math.round(mem.rss / 1048576)}MB heap=${Math.round(mem.heapUsed / 1048576)}MB ext=${Math.round(mem.external / 1048576)}MB sysFree=${Math.round(os.freemem() / 1048576)}MB`;
    fs.appendFileSync(activityLogPath, `[${new Date().toISOString()}] ${line} (${memInfo})\n`);
  } catch {
    /* best effort */
  }
}

logActivity(`app starting (v${APP_VERSION})`);

function sendToRenderer(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    try {
      mainWindow.webContents.send(channel, payload);
    } catch (err) {
      logCrash(`sendToRenderer(${channel})`, err);
    }
  }
}

// axios's Node onUploadProgress fires on essentially every TCP write, which
// for a large file over a fast connection is thousands of times a second.
// Each one is a cross-process IPC message with its own serialization/Mojo
// overhead; a burst like that is exactly what showed up as a renderer-side
// V8 out-of-memory crash (exception 0xE0000008) while uploading a 1.7GB
// file. Throttling *inside the renderer* wasn't enough - it only skipped
// the React re-render, not the IPC traffic itself. Gate it at the source.
const lastProgressSent = {};
function sendProgressThrottled(fileName, payload) {
  const now = Date.now();
  const isDone = payload.progress >= 100;
  if (!isDone && now - (lastProgressSent[fileName] || 0) < 150) return;
  lastProgressSent[fileName] = now;
  if (isDone) delete lastProgressSent[fileName];
  sendToRenderer('upload-progress', payload);
}

// A plain fs.createReadStream() left to itself will emit an unhandled
// 'error' (and crash the process) if the underlying HTTP request aborts
// mid-transfer (e.g. a timeout) or the file becomes unreadable mid-upload.
// Give it a listener so that ends up as a normal rejected promise instead.
function openUploadStream(filePath) {
  const stream = fs.createReadStream(filePath);
  stream.on('error', (err) => logCrash('upload stream', err));
  return stream;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 940,
    minHeight: 680,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#0b0d12',
    titleBarStyle: 'default',
    frame: true,
    icon: path.join(__dirname, '../public/icon.png')
  });

  Menu.setApplicationMenu(null);

  // External links open in the user's browser, never inside the app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

// The renderer (Chromium tab) can die on its own - e.g. OOM-killed - which is
// a different failure mode from a main-process exception and would otherwise
// just look like "the app closed itself" with zero explanation.
app.on('render-process-gone', (event, webContents, details) => {
  logCrash('render-process-gone', JSON.stringify(details));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/* ------------------------------------------------------------------ */
/*  App / system                                                       */
/* ------------------------------------------------------------------ */

ipcMain.handle('app:getVersion', () => APP_VERSION);

const GITHUB_REPO = 'snowww62/ia-item-manager';

function compareVersions(a, b) {
  const pa = String(a).replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b).replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}

ipcMain.handle('app:checkForUpdate', async () => {
  try {
    const res = await axiosInstance.get(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );
    const latestVersion = (res.data?.tag_name || '').replace(/^v/i, '');
    const assets = res.data?.assets || [];
    const portable = assets.find((a) => /portable/i.test(a.name));
    const setup = assets.find((a) => /setup/i.test(a.name));

    return {
      success: true,
      currentVersion: APP_VERSION,
      latestVersion,
      hasUpdate: Boolean(latestVersion) && compareVersions(latestVersion, APP_VERSION) > 0,
      releaseUrl: res.data?.html_url || `https://github.com/${GITHUB_REPO}/releases/latest`,
      portableUrl: portable?.browser_download_url,
      setupUrl: setup?.browser_download_url,
      notes: res.data?.body || ''
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('shell:openExternal', async (event, url) => {
  if (typeof url === 'string' && /^https?:\/\//.test(url)) {
    await shell.openExternal(url);
    return { success: true };
  }
  return { success: false, error: 'Invalid URL' };
});

ipcMain.handle('app:openCrashLogFolder', async () => {
  try {
    // activity.log always exists once at least one upload has run and is
    // usually the more useful file (shows the last thing that happened);
    // crash.log only exists if a JS-level exception was actually caught.
    const preferred = fs.existsSync(crashLogPath) ? crashLogPath : activityLogPath;
    if (fs.existsSync(preferred)) {
      shell.showItemInFolder(preferred);
    } else {
      await shell.openPath(path.dirname(crashLogPath));
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('app:hasCrashLog', () => fs.existsSync(crashLogPath) || fs.existsSync(activityLogPath));

// System (not V8 heap) free memory - large uploads on a machine already low
// on RAM is a real way to crash Electron (confirmed: two crash dumps with
// V8's own OOM exception code landed the moment a 1.7GB upload was running
// on a machine with under 5GB free). Let the renderer warn before it happens
// instead of finding out via a crash.
ipcMain.handle('system:getMemoryInfo', () => ({
  freeBytes: os.freemem(),
  totalBytes: os.totalmem()
}));

/* ------------------------------------------------------------------ */
/*  Credentials (encrypted at rest via OS keychain)                    */
/* ------------------------------------------------------------------ */

ipcMain.handle('credentials:save', async (event, { accessKey, secretKey }) => {
  try {
    if (!safeStorage.isEncryptionAvailable()) {
      return { success: false, error: 'Encryption not available' };
    }

    const encryptedAccess = safeStorage.encryptString(accessKey);
    const encryptedSecret = safeStorage.encryptString(secretKey);

    return {
      success: true,
      encrypted: {
        encryptedAccessKey: encryptedAccess.toString('base64'),
        encryptedSecretKey: encryptedSecret.toString('base64')
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('credentials:load', async (event, { encryptedAccessKey, encryptedSecretKey }) => {
  try {
    if (!safeStorage.isEncryptionAvailable()) {
      return { success: false, error: 'Encryption not available' };
    }

    const accessKey = safeStorage.decryptString(Buffer.from(encryptedAccessKey, 'base64'));
    const secretKey = safeStorage.decryptString(Buffer.from(encryptedSecretKey, 'base64'));

    return { success: true, credentials: { accessKey, secretKey } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('credentials:isEncryptionAvailable', async () => {
  return safeStorage.isEncryptionAvailable();
});

/* ------------------------------------------------------------------ */
/*  Internet Archive - account                                         */
/* ------------------------------------------------------------------ */

ipcMain.handle('ia:testConnection', async (event, { accessKey, secretKey }) => {
  try {
    const res = await axiosInstance.get('https://archive.org/services/xauthn/', {
      params: { op: 'whoami' },
      headers: { 'Authorization': `LOW ${accessKey}:${secretKey}` }
    });

    const values = res.data?.values || {};
    if (res.data?.success === false) {
      return { success: false, error: res.data?.error || 'Authentication failed' };
    }

    return {
      success: true,
      screenname: values.screenname || null,
      email: values.email || null,
      itemname: values.itemname || null
    };
  } catch (error) {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      return { success: false, error: 'Invalid credentials' };
    }
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ia:checkLimits', async (event, { accessKey, identifier }) => {
  try {
    const response = await axiosInstance.get('https://s3.us.archive.org/', {
      params: {
        check_limit: 1,
        accesskey: accessKey,
        bucket: identifier
      }
    });

    return {
      success: true,
      overLimit: response.data.over_limit === 1,
      detail: response.data.detail
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ia:getTasks', async (event, { identifier, accessKey, secretKey }) => {
  try {
    const response = await axiosInstance.get('https://archive.org/services/tasks', {
      params: { identifier, summary: 1, history: 0 },
      headers: { 'Authorization': `LOW ${accessKey}:${secretKey}` }
    });

    const summary = response.data?.value?.summary || response.data?.summary || {};
    return {
      success: true,
      summary: {
        queued: summary.queued || 0,
        running: summary.running || 0,
        error: summary.error || 0,
        paused: summary.paused || 0
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ia:queueDerive', async (event, { identifier, accessKey, secretKey }) => {
  try {
    const response = await axiosInstance.post(
      'https://archive.org/services/tasks',
      JSON.stringify({ identifier, cmd: 'derive.php' }),
      {
        headers: {
          'Authorization': `LOW ${accessKey}:${secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.success !== false) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.data?.error || 'Unknown error' };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || error.message };
  }
});

/* ------------------------------------------------------------------ */
/*  Internet Archive - items                                           */
/* ------------------------------------------------------------------ */

ipcMain.handle('ia:getItems', async (event, params) => {
  const {
    accessKey, secretKey, query,
    sort = '-publicdate', page = 1, rows = 48, mediatype
  } = params || {};

  try {
    let searchQuery = query;

    if (!searchQuery) {
      try {
        const userResponse = await axiosInstance.get('https://archive.org/services/xauthn/', {
          params: { op: 'whoami' },
          headers: { 'Authorization': `LOW ${accessKey}:${secretKey}` }
        });

        const screenname = userResponse.data?.values?.screenname;
        if (screenname) {
          searchQuery = `uploader:"${screenname}"`;
        } else {
          searchQuery = 'mediatype:data OR mediatype:movies OR mediatype:audio OR mediatype:texts';
        }
      } catch (userError) {
        searchQuery = `uploader:${accessKey}`;
      }
    }

    let finalQuery = searchQuery;
    if (mediatype && mediatype !== 'all') {
      finalQuery = `(${searchQuery}) AND mediatype:${mediatype}`;
    }

    const response = await axiosInstance.get('https://archive.org/advancedsearch.php', {
      params: {
        q: finalQuery,
        output: 'json',
        rows,
        page,
        sort,
        'fl[]': ['identifier', 'title', 'mediatype', 'publicdate', 'addeddate', 'downloads', 'item_size', 'week', 'collection']
      }
    });

    return {
      success: true,
      data: response.data,
      numFound: response.data?.response?.numFound || 0,
      page
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ia:getItemDetails', async (event, { identifier }) => {
  try {
    const response = await axiosInstance.get(`https://archive.org/metadata/${identifier}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ia:checkIdentifier', async (event, { identifier, userEmail }) => {
  try {
    const response = await axiosInstance.get(`https://archive.org/metadata/${identifier}`);

    if (response.data && response.data.metadata) {
      const uploader = response.data.metadata.uploader;
      const isOwner = userEmail && uploader && uploader.toLowerCase() === userEmail.toLowerCase();

      return {
        success: true,
        exists: true,
        isOwner: isOwner,
        uploader: uploader,
        title: response.data.metadata.title || identifier
      };
    }

    return { success: true, exists: false };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: true, exists: false };
    }
    return { success: false, error: error.message };
  }
});

/* ------------------------------------------------------------------ */
/*  Internet Archive - upload                                          */
/* ------------------------------------------------------------------ */

ipcMain.handle('ia:upload', async (event, { identifier, filePath, targetFolder, accessKey, secretKey, metadata, isExistingItem, sizeHint, queueDerive }) => {
  const fileName = path.basename(filePath);
  try {
    const fileSize = fs.statSync(filePath).size;
    logActivity(`upload start: ${fileName} (${Math.round(fileSize / 1048576)}MB) -> ${identifier}`);

    let targetPath = fileName;
    if (targetFolder && targetFolder.trim()) {
      const cleanFolder = targetFolder.trim().replace(/\\/g, '/').replace(/^\/+/, '');
      const folderWithSlash = cleanFolder.endsWith('/') ? cleanFolder : cleanFolder + '/';
      targetPath = folderWithSlash + fileName;
    }

    const headers = {
      'Authorization': `LOW ${accessKey}:${secretKey}`,
      'Content-Length': fileSize,
      'x-archive-interactive-priority': '1',
      'x-archive-auto-make-bucket': '1'
    };

    if (sizeHint) {
      headers['x-archive-size-hint'] = sizeHint.toString();
    }

    if (queueDerive === false) {
      headers['x-archive-queue-derive'] = '0';
    }

    if (!isExistingItem) {
      headers['x-archive-meta01-collection'] = metadata?.collection || 'opensource_media';
      headers['x-archive-meta-mediatype'] = metadata?.mediatype || 'data';
    }

    if (metadata) {
      if (metadata.title) headers['x-archive-meta-title'] = metadata.title;
      if (metadata.description) headers['x-archive-meta-description'] = metadata.description;
      if (metadata.subject) headers['x-archive-meta-subject'] = metadata.subject;
      if (metadata.creator) headers['x-archive-meta-creator'] = metadata.creator;
      if (metadata.language) headers['x-archive-meta-language'] = metadata.language;
      if (metadata.date) headers['x-archive-meta-date'] = metadata.date;
      if (metadata.licenseurl) headers['x-archive-meta-licenseurl'] = metadata.licenseurl;
    }

    const encodedPath = targetPath.split('/').map(segment => encodeURIComponent(segment)).join('/');

    const response = await retryOperation(async () => {
      // A fresh stream per attempt: a Node Readable can only be consumed once,
      // and retryOperation may call this more than once on transient errors.
      // timeout: 0 (no limit) - the instance default (60s) would abort large
      // files mid-transfer on a normal connection.
      return await axiosInstance({
        method: 'put',
        url: `https://s3.us.archive.org/${identifier}/${encodedPath}`,
        data: openUploadStream(filePath),
        headers: headers,
        timeout: 0,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            sendProgressThrottled(fileName, {
              fileName,
              progress: percentCompleted,
              loaded: progressEvent.loaded,
              total: progressEvent.total
            });
          }
        }
      });
    });

    logActivity(`upload done: ${fileName}`);
    return { success: true, data: response.data };
  } catch (error) {
    const { code, message } = parseS3Error(error.response?.data, error.message);
    logActivity(`upload FAILED: ${fileName}: ${code || ''} ${message}`);
    return { success: false, error: message, errorCode: code };
  }
});

ipcMain.handle('ia:createItem', async (event, { identifier, filePath, accessKey, secretKey, metadata }) => {
  try {
    const fileName = path.basename(filePath);
    const fileSize = fs.statSync(filePath).size;

    const headers = {
      'Authorization': `LOW ${accessKey}:${secretKey}`,
      'Content-Length': fileSize,
      'x-archive-interactive-priority': '1',
      'x-amz-auto-make-bucket': '1',
      'x-archive-meta01-collection': metadata?.collection || 'opensource_media',
      'x-archive-meta-mediatype': metadata?.mediatype || 'data'
    };

    if (metadata?.title) headers['x-archive-meta-title'] = metadata.title;
    if (metadata?.description) headers['x-archive-meta-description'] = metadata.description;
    if (metadata?.subject) headers['x-archive-meta-subject'] = metadata.subject;
    if (metadata?.creator) headers['x-archive-meta-creator'] = metadata.creator;
    if (metadata?.date) headers['x-archive-meta-date'] = metadata.date;
    if (metadata?.licenseurl) headers['x-archive-meta-licenseurl'] = metadata.licenseurl;

    const response = await retryOperation(async () => {
      return await axiosInstance({
        method: 'put',
        url: `https://s3.us.archive.org/${identifier}/${encodeURIComponent(fileName)}`,
        data: openUploadStream(filePath),
        headers,
        timeout: 0,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            sendProgressThrottled(fileName, { fileName, progress: percentCompleted });
          }
        }
      });
    });

    return { success: true, data: response.data };
  } catch (error) {
    const { code, message } = parseS3Error(error.response?.data, error.message);
    return { success: false, error: message, errorCode: code };
  }
});

/* ------------------------------------------------------------------ */
/*  Internet Archive - mutate                                          */
/* ------------------------------------------------------------------ */

ipcMain.handle('ia:deleteFile', async (event, { identifier, fileName, accessKey, secretKey, keepOldVersion }) => {
  try {
    const headers = {
      'Authorization': `LOW ${accessKey}:${secretKey}`,
      'x-archive-cascade-delete': '1'
    };

    if (keepOldVersion) {
      headers['x-archive-keep-old-version'] = '1';
    }

    const encodedName = fileName.split('/').map(s => encodeURIComponent(s)).join('/');
    const response = await axiosInstance.delete(
      `https://s3.us.archive.org/${identifier}/${encodedName}`,
      { headers }
    );

    return { success: true, data: response.data };
  } catch (error) {
    const { code, message } = parseS3Error(error.response?.data, error.message);
    return { success: false, error: message, errorCode: code };
  }
});

ipcMain.handle('ia:updateMetadata', async (event, { identifier, accessKey, secretKey, metadata }) => {
  try {
    const existingMetadata = await axiosInstance.get(`https://archive.org/metadata/${identifier}`);
    const currentMeta = existingMetadata.data?.metadata || {};

    const fields = ['title', 'description', 'subject', 'creator', 'mediatype', 'date', 'licenseurl', 'language'];
    const patches = [];

    for (const field of fields) {
      if (metadata[field] !== undefined) {
        patches.push({
          op: currentMeta[field] ? 'replace' : 'add',
          path: `/${field}`,
          value: metadata[field]
        });
      }
    }

    if (patches.length === 0) {
      return { success: false, error: 'No changes to apply' };
    }

    const formData = new URLSearchParams({
      '-target': 'metadata',
      '-patch': JSON.stringify(patches),
      'access': accessKey,
      'secret': secretKey
    });

    const response = await axiosInstance.post(
      `https://archive.org/metadata/${identifier}`,
      formData.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.data && response.data.success) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.data?.error || 'Unknown error' };
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    return { success: false, error: errorMsg };
  }
});

ipcMain.handle('ia:deleteItem', async (event, { identifier, accessKey, secretKey }) => {
  try {
    const metadataResponse = await axiosInstance.get(`https://archive.org/metadata/${identifier}`);

    if (!metadataResponse.data || !metadataResponse.data.files) {
      return { success: false, error: 'Unable to retrieve item files' };
    }

    const files = metadataResponse.data.files;
    const headers = {
      'Authorization': `LOW ${accessKey}:${secretKey}`,
      'x-amz-auto-make-bucket': '1',
      'x-archive-meta01-collection': 'opensource',
      'x-archive-keep-old-version': '0'
    };

    const deletableFiles = files.filter(file => {
      if (!file.name) return false;
      if (file.format === 'Metadata') return false;
      if (file.name.endsWith('_files.xml')) return false;
      if (file.name.endsWith('_meta.xml')) return false;
      if (file.name.endsWith('_meta.sqlite')) return false;
      if (file.name.endsWith('.torrent')) return false;
      return true;
    });

    const errors = [];
    const deletedFiles = [];

    for (const file of deletableFiles) {
      try {
        const encodedName = file.name.split('/').map(s => encodeURIComponent(s)).join('/');
        await axiosInstance.delete(
          `https://s3.us.archive.org/${identifier}/${encodedName}`,
          { headers }
        );
        deletedFiles.push(file.name);
      } catch (fileError) {
        errors.push(`${file.name}: ${fileError.message}`);
      }
    }

    if (errors.length > 0) {
      return {
        success: deletedFiles.length > 0,
        error: errors.length === deletableFiles.length
          ? `Failed to delete all files: ${errors.join(', ')}`
          : `Some files could not be deleted: ${errors.join(', ')}`,
        partial: true,
        deleted: deletedFiles.length,
        failed: errors.length
      };
    }

    return { success: true, data: { deleted: deletedFiles.length } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

/* ------------------------------------------------------------------ */
/*  File dialogs                                                       */
/* ------------------------------------------------------------------ */

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'All Files', extensions: ['*'] }]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const stats = fs.statSync(filePath);
    return { path: filePath, name: path.basename(filePath), size: stats.size };
  }
  return null;
});

ipcMain.handle('dialog:openMultipleFiles', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'All Files', extensions: ['*'] }]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths.map(filePath => {
      const stats = fs.statSync(filePath);
      return { path: filePath, name: path.basename(filePath), size: stats.size };
    });
  }
  return [];
});

// Resolve dropped file paths (from HTML5 drag & drop) into upload descriptors
ipcMain.handle('files:stat', async (event, filePaths) => {
  const out = [];
  for (const filePath of filePaths || []) {
    try {
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        out.push({ path: filePath, name: path.basename(filePath), size: stats.size });
      }
    } catch {
      /* ignore unreadable entries */
    }
  }
  return out;
});
