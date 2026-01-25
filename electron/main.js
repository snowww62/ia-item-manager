const { app, BrowserWindow, ipcMain, dialog, Menu, safeStorage } = require('electron');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const https = require('https');

let mainWindow;

const axiosInstance = axios.create({
  timeout: 60000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  maxRedirects: 5,
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
      const isRetryable = error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || 
                          error.response?.status === 503 || error.response?.status === 429;
      
      if (isLastAttempt || !isRetryable) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#0f172a',
    titleBarStyle: 'default',
    frame: true,
    icon: path.join(__dirname, '../public/icon.png')
  });

  // Supprimer le menu natif Electron (File/Edit/View/Windows/Help)
  Menu.setApplicationMenu(null);

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

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
        accessKey: encryptedAccess.toString('base64'),
        secretKey: encryptedSecret.toString('base64')
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

ipcMain.handle('ia:upload', async (event, { identifier, filePath, accessKey, secretKey, metadata, isExistingItem, sizeHint }) => {
  try {
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    const headers = {
      'Authorization': `LOW ${accessKey}:${secretKey}`,
      'User-Agent': 'ArchiveVault/1.0 (Desktop Application)',
      'x-archive-interactive-priority': '1',
      'x-archive-auto-make-bucket': '1'
    };
    
    if (sizeHint) {
      headers['x-archive-size-hint'] = sizeHint.toString();
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
      
      if (metadata.queueDerive !== undefined) headers['x-archive-queue-derive'] = metadata.queueDerive;
    }

    const response = await retryOperation(async () => {
      return await axiosInstance({
        method: 'put',
        url: `https://s3.us.archive.org/${identifier}/${encodeURIComponent(fileName)}`,
        data: fileBuffer,
        headers: headers,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            mainWindow.webContents.send('upload-progress', { fileName, progress: percentCompleted });
          }
        }
      });
    });

    return { success: true, data: response.data };
  } catch (error) {
    const errorMsg = error.response?.data || error.message;
    return { success: false, error: errorMsg };
  }
});

ipcMain.handle('ia:getItems', async (event, { accessKey, secretKey, query }) => {
  try {
    let searchQuery = query;
    
    if (!searchQuery) {
      try {
        const userResponse = await axiosInstance.get('https://archive.org/services/xauthn/', {
          headers: {
            'Authorization': `LOW ${accessKey}:${secretKey}`
          }
        });
        
        if (userResponse.data && userResponse.data.values && userResponse.data.values.screenname) {
          const screenname = userResponse.data.values.screenname;
          searchQuery = `uploader:"${screenname}"`;
        } else {
          searchQuery = 'mediatype:data OR mediatype:movies OR mediatype:audio OR mediatype:texts';
        }
      } catch (userError) {
        searchQuery = `uploader:${accessKey}`;
      }
    }
    
    const response = await axiosInstance.get('https://archive.org/advancedsearch.php', {
      params: {
        q: searchQuery,
        output: 'json',
        rows: 100,
        page: 1,
        sort: '-publicdate'
      }
    });

    return { success: true, data: response.data };
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

ipcMain.handle('ia:deleteFile', async (event, { identifier, fileName, accessKey, secretKey, keepOldVersion }) => {
  try {
    const headers = {
      'Authorization': `LOW ${accessKey}:${secretKey}`,
      'x-archive-cascade-delete': '1'
    };

    if (keepOldVersion) {
      headers['x-archive-keep-old-version'] = '1';
    }

    const response = await axiosInstance.delete(
      `https://s3.us.archive.org/${identifier}/${fileName}`,
      { headers }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ia:updateMetadata', async (event, { identifier, accessKey, secretKey, metadata }) => {
  try {
    const existingMetadata = await axiosInstance.get(`https://archive.org/metadata/${identifier}`);
    const currentMeta = existingMetadata.data?.metadata || {};
    
    const patches = [];
    
    if (metadata.title !== undefined) {
      patches.push({ 
        op: currentMeta.title ? 'replace' : 'add', 
        path: '/title', 
        value: metadata.title 
      });
    }
    if (metadata.description !== undefined) {
      patches.push({ 
        op: currentMeta.description ? 'replace' : 'add', 
        path: '/description', 
        value: metadata.description 
      });
    }
    if (metadata.subject !== undefined) {
      patches.push({ 
        op: currentMeta.subject ? 'replace' : 'add', 
        path: '/subject', 
        value: metadata.subject 
      });
    }
    if (metadata.creator !== undefined) {
      patches.push({ 
        op: currentMeta.creator ? 'replace' : 'add', 
        path: '/creator', 
        value: metadata.creator 
      });
    }
    if (metadata.mediatype !== undefined) {
      patches.push({ 
        op: currentMeta.mediatype ? 'replace' : 'add', 
        path: '/mediatype', 
        value: metadata.mediatype 
      });
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
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data && response.data.success) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.data?.error || 'Unknown error' };
    }
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
        await axiosInstance.delete(
          `https://s3.us.archive.org/${identifier}/${file.name}`,
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

ipcMain.handle('dialog:openFile', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const stats = fs.statSync(filePath);
    return {
      path: filePath,
      name: path.basename(filePath),
      size: stats.size
    };
  }
  return null;
});

ipcMain.handle('dialog:openMultipleFiles', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths.map(filePath => {
      const stats = fs.statSync(filePath);
      return {
        path: filePath,
        name: path.basename(filePath),
        size: stats.size
      };
    });
  }
  return [];
});
