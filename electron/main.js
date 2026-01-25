const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const https = require('https');

let mainWindow;

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

ipcMain.handle('ia:checkLimits', async (event, { accessKey, identifier }) => {
  try {
    const response = await axios.get('https://s3.us.archive.org/', {
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

ipcMain.handle('ia:upload', async (event, { identifier, filePath, accessKey, secretKey, metadata, isExistingItem }) => {
  try {
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    const headers = {
      'Authorization': `LOW ${accessKey}:${secretKey}`,
      'User-Agent': 'ArchiveVault/1.0 (Desktop Application)',
      'x-archive-interactive-priority': '1',
      'x-archive-auto-make-bucket': '1'
    };
    
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
      if (metadata.sizeHint) headers['x-archive-size-hint'] = metadata.sizeHint;
    }

    const response = await axios({
      method: 'put',
      url: `https://s3.us.archive.org/${identifier}/${encodeURIComponent(fileName)}`,
      data: fileBuffer,
      headers: headers,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      maxRedirects: 5,
      httpsAgent: new https.Agent({ 
        rejectUnauthorized: true
      }),
      beforeRedirect: (options, { headers }) => {
        options.headers = { ...options.headers, 'Authorization': headers.Authorization };
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          mainWindow.webContents.send('upload-progress', { fileName, progress: percentCompleted });
        }
      }
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
    
    // Si pas de query personnalisée, essayer d'obtenir les items de l'utilisateur
    if (!searchQuery) {
      try {
        // Obtenir les informations de l'utilisateur via l'API
        const userResponse = await axios.get('https://archive.org/services/xauthn/', {
          headers: {
            'Authorization': `LOW ${accessKey}:${secretKey}`
          }
        });
        
        if (userResponse.data && userResponse.data.values && userResponse.data.values.screenname) {
          const screenname = userResponse.data.values.screenname;
          searchQuery = `uploader:"${screenname}"`;
        } else {
          // Fallback: rechercher tous les items (non filtré)
          searchQuery = 'mediatype:data OR mediatype:movies OR mediatype:audio OR mediatype:texts';
        }
      } catch (userError) {
        // Fallback: rechercher avec l'access key (au cas où ça marcherait)
        searchQuery = `uploader:${accessKey}`;
      }
    }
    
    const response = await axios.get('https://archive.org/advancedsearch.php', {
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
    const response = await axios.get(`https://archive.org/metadata/${identifier}`);
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

    // Option pour garder l'ancienne version dans history/
    if (keepOldVersion) {
      headers['x-archive-keep-old-version'] = '1';
    }

    const response = await axios.delete(
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
    // Créer les opérations JSON Patch selon la doc officielle IA
    // https://archive.org/developers/md-write.html
    // Utiliser 'add' au lieu de 'replace' car certains champs peuvent ne pas exister
    const patches = [];
    
    if (metadata.title) patches.push({ op: 'add', path: '/title', value: metadata.title });
    if (metadata.description) patches.push({ op: 'add', path: '/description', value: metadata.description });
    if (metadata.subject) patches.push({ op: 'add', path: '/subject', value: metadata.subject });
    if (metadata.creator) patches.push({ op: 'add', path: '/creator', value: metadata.creator });
    if (metadata.mediatype) patches.push({ op: 'add', path: '/mediatype', value: metadata.mediatype });

    // Format URL-encoded selon la doc : -target, -patch, access, secret
    const formData = new URLSearchParams({
      '-target': 'metadata',
      '-patch': JSON.stringify(patches),
      'access': accessKey,
      'secret': secretKey
    });

    const response = await axios.post(
      `https://archive.org/metadata/${identifier}`,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Vérifier si la mise à jour a réussi
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
    // Obtenir la liste de tous les fichiers de l'item
    const metadataResponse = await axios.get(`https://archive.org/metadata/${identifier}`);
    
    if (!metadataResponse.data || !metadataResponse.data.files) {
      return { success: false, error: 'Unable to retrieve item files' };
    }

    const files = metadataResponse.data.files;
    const headers = {
      'authorization': `LOW ${accessKey}:${secretKey}`,
      'x-amz-auto-make-bucket': '1',
      'x-archive-meta01-collection': 'opensource',
      'x-archive-keep-old-version': '0'
    };

    // Filtrer les fichiers système IA qui ne peuvent pas être supprimés
    const deletableFiles = files.filter(file => {
      if (!file.name) return false;
      // Ignorer les fichiers de métadonnées IA (format Metadata ou fichiers système)
      if (file.format === 'Metadata') return false;
      if (file.name.endsWith('_files.xml')) return false;
      if (file.name.endsWith('_meta.xml')) return false;
      if (file.name.endsWith('_meta.sqlite')) return false;
      if (file.name.endsWith('.torrent')) return false;
      return true;
    });

    // Supprimer tous les fichiers supprimables un par un
    const errors = [];
    for (const file of deletableFiles) {
      try {
        await axios.delete(
          `https://s3.us.archive.org/${identifier}/${file.name}`,
          { headers }
        );
      } catch (fileError) {
        errors.push(`${file.name}: ${fileError.message}`);
      }
    }

    if (errors.length > 0) {
      return { 
        success: false, 
        error: `Some files could not be deleted: ${errors.join(', ')}`,
        partial: true
      };
    }

    return { success: true, data: { deleted: files.length } };
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
