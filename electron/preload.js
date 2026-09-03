const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // App / system
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),

  // Internet Archive
  uploadFile: (data) => ipcRenderer.invoke('ia:upload', data),
  createItem: (data) => ipcRenderer.invoke('ia:createItem', data),
  getItems: (data) => ipcRenderer.invoke('ia:getItems', data),
  getItemDetails: (data) => ipcRenderer.invoke('ia:getItemDetails', data),
  checkIdentifier: (data) => ipcRenderer.invoke('ia:checkIdentifier', data),
  deleteFile: (data) => ipcRenderer.invoke('ia:deleteFile', data),
  deleteItem: (data) => ipcRenderer.invoke('ia:deleteItem', data),
  updateMetadata: (data) => ipcRenderer.invoke('ia:updateMetadata', data),
  checkLimits: (data) => ipcRenderer.invoke('ia:checkLimits', data),
  testConnection: (data) => ipcRenderer.invoke('ia:testConnection', data),
  getTasks: (data) => ipcRenderer.invoke('ia:getTasks', data),
  queueDerive: (data) => ipcRenderer.invoke('ia:queueDerive', data),

  // Credentials (OS-encrypted at rest)
  saveCredentials: (data) => ipcRenderer.invoke('credentials:save', data),
  loadCredentials: (data) => ipcRenderer.invoke('credentials:load', data),
  isEncryptionAvailable: () => ipcRenderer.invoke('credentials:isEncryptionAvailable'),

  // Files
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  openMultipleFilesDialog: () => ipcRenderer.invoke('dialog:openMultipleFiles'),
  statFiles: (paths) => ipcRenderer.invoke('files:stat', paths),
  // Turn a dropped File object into an absolute path (Electron >= 32)
  getPathForFile: (file) => {
    try {
      return webUtils.getPathForFile(file);
    } catch {
      return file?.path || null;
    }
  },

  // Upload progress stream
  onUploadProgress: (callback) => {
    ipcRenderer.on('upload-progress', (event, data) => callback(data));
  },
  removeUploadProgressListener: () => {
    ipcRenderer.removeAllListeners('upload-progress');
  }
});
