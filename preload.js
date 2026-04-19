// Preload script for secure communication between main and renderer processes
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: Add methods here if you need to communicate with the main process
  // minimize: () => ipcRenderer.invoke('minimize-window'),
  // maximize: () => ipcRenderer.invoke('maximize-window'),
  // close: () => ipcRenderer.invoke('close-window'),

  // Platform info
  platform: process.platform,

  // Version info
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
});
