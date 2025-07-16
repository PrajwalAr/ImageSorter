const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),
  openDirectoryDialog: (options) => ipcRenderer.invoke('open-directory-dialog', options),
  copyImages: (options) => ipcRenderer.invoke('copy-images', options),
  onCopyProgress: (callback) => ipcRenderer.on('copy-progress', callback)
})
