const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  window: {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    toggleMaximize: () => ipcRenderer.invoke("window:toggle-maximize"),
    close: () => ipcRenderer.invoke("window:close"),
    getState: () => ipcRenderer.invoke("window:get-state"),
    setAlwaysOnTop: (flag) => ipcRenderer.invoke("window:set-always-on-top", flag),
    setFullScreen: (flag) => ipcRenderer.invoke("window:set-fullscreen", flag),
  },
  system: {
    getInfo: () => ipcRenderer.invoke("system:get-info"),
    openSettings: () => ipcRenderer.invoke("system:open-settings"),
    getBattery: () => ipcRenderer.invoke("system:get-battery"),
    getVolume: () => ipcRenderer.invoke("system:get-volume"),
    setVolume: (level) => ipcRenderer.invoke("system:set-volume", level),
    getNetworkStatus: () => ipcRenderer.invoke("system:get-network-status"),
  },
  fs: {
    listDirectory: (targetPath) => ipcRenderer.invoke("fs:list-directory", targetPath),
    readFile: (filePath) => ipcRenderer.invoke("fs:read-file", filePath),
    writeFile: (filePath, content) => ipcRenderer.invoke("fs:write-file", filePath, content),
    getStats: (filePath) => ipcRenderer.invoke("fs:get-stats", filePath),
    createDirectory: (dirPath) => ipcRenderer.invoke("fs:create-directory", dirPath),
    deleteItem: (itemPath) => ipcRenderer.invoke("fs:delete-item", itemPath),
    moveItem: (src, dest) => ipcRenderer.invoke("fs:move-item", src, dest),
    copyItem: (src, dest) => ipcRenderer.invoke("fs:copy-item", src, dest),
  },
  shell: {
    openPath: (targetPath) => ipcRenderer.invoke("shell:open-path", targetPath),
    showItemInFolder: (itemPath) => ipcRenderer.invoke("shell:show-item-in-folder", itemPath),
    openExternal: (url) => ipcRenderer.invoke("shell:open-external", url),
    getDownloadsPath: () => ipcRenderer.invoke("shell:get-downloads-path"),
    getAppSupportPath: () => ipcRenderer.invoke("shell:get-app-support-path"),
  },
  app: {
    getVersion: () => ipcRenderer.invoke("app:get-version"),
    getName: () => ipcRenderer.invoke("app:get-name"),
    getPath: (name) => ipcRenderer.invoke("app:get-path", name),
    quit: () => ipcRenderer.invoke("app:quit"),
    relaunch: () => ipcRenderer.invoke("app:relaunch"),
  },
  storage: {
    get: (key) => ipcRenderer.invoke("storage:get", key),
    set: (key, value) => ipcRenderer.invoke("storage:set", key, value),
    remove: (key) => ipcRenderer.invoke("storage:remove", key),
    clear: () => ipcRenderer.invoke("storage:clear"),
  },
  clipboard: {
    read: () => ipcRenderer.invoke("clipboard:read"),
    write: (text) => ipcRenderer.invoke("clipboard:write", text),
    readImage: () => ipcRenderer.invoke("clipboard:read-image"),
    writeImage: (buffer) => ipcRenderer.invoke("clipboard:write-image", buffer),
  },
  notifications: {
    show: (title, options) => ipcRenderer.invoke("notifications:show", title, options),
    isSupported: () => ipcRenderer.invoke("notifications:is-supported"),
  },
  process: {
    list: () => ipcRenderer.invoke("process:list"),
    kill: (pid) => ipcRenderer.invoke("process:kill", pid),
  },
});
