const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  uploadFile: (data) => ipcRenderer.invoke('ia:upload', data),
  getItems: (data) => ipcRenderer.invoke('ia:getItems', data),
  getItemDetails: (data) => ipcRenderer.invoke('ia:getItemDetails', data),
  deleteFile: (data) => ipcRenderer.invoke('ia:deleteFile', data),
  deleteItem: (data) => ipcRenderer.invoke('ia:deleteItem', data),
  updateMetadata: (data) => ipcRenderer.invoke('ia:updateMetadata', data),
  checkLimits: (data) => ipcRenderer.invoke('ia:checkLimits', data),
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  openMultipleFilesDialog: () => ipcRenderer.invoke('dialog:openMultipleFiles'),
  onUploadProgress: (callback) => {
    ipcRenderer.on('upload-progress', (event, data) => callback(data));
  }
});
