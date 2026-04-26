const { app, BrowserWindow, Menu, ipcMain, nativeTheme, nativeImage, screen, shell, clipboard, notification, powerMonitor } = require("electron");
const { promises: fs } = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { exec } = require("child_process");

const isDev = !app.isPackaged;
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 720,
    frame: false,
    transparent: true,
    show: false,
    backgroundColor: "#00000000",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const startUrl = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "../dist/index.html")}`;

  mainWindow.loadURL(startUrl);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  createMenu();
}

function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New Window",
          accelerator: "CmdOrCtrl+N",
          click: () => createWindow(),
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
  ];

  if (process.platform === "darwin") {
    template.unshift({
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function getPrimaryWindow(event) {
  return BrowserWindow.fromWebContents(event.sender) || mainWindow;
}

function summarizeDisplay(display) {
  return {
    id: display.id,
    label: display.label,
    scaleFactor: display.scaleFactor,
    size: display.size,
    workArea: display.workArea,
    rotation: display.rotation,
    internal: display.internal,
    touchSupport: display.touchSupport,
  };
}

async function listDirectory(targetPath) {
  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  const decorated = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(targetPath, entry.name);
      const stat = await fs.stat(entryPath);

      return {
        name: entry.name,
        path: entryPath,
        type: entry.isDirectory() ? "folder" : "file",
        size: entry.isDirectory() ? null : stat.size,
        modified: stat.mtime.toISOString(),
      };
    }),
  );

  return decorated.sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === "folder" ? -1 : 1;
    }
    return left.name.localeCompare(right.name);
  });
}

function trySpawn(command, args = []) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore",
    });

    child.on("error", () => resolve(false));
    child.unref();
    resolve(true);
  });
}

async function openSystemSettings() {
  if (process.platform === "darwin") {
    return trySpawn("open", ["x-apple.systempreferences:"]);
  }

  if (process.platform === "win32") {
    return trySpawn("cmd", ["/c", "start", "ms-settings:"]);
  }

  const candidates = [
    ["deepin-control-center", []],
    ["gnome-control-center", []],
    ["systemsettings", []],
    ["kcmshell6", ["kcm_lookandfeel"]],
    ["xfce4-settings-manager", []],
    ["mate-control-center", []],
  ];

  for (const [command, args] of candidates) {
    const ok = await trySpawn(command, args);
    if (ok) {
      return true;
    }
  }

  return false;
}

ipcMain.handle("window:minimize", (event) => {
  getPrimaryWindow(event)?.minimize();
});

ipcMain.handle("window:toggle-maximize", (event) => {
  const win = getPrimaryWindow(event);
  if (!win) {
    return { isMaximized: false };
  }

  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }

  return { isMaximized: win.isMaximized() };
});

ipcMain.handle("window:close", (event) => {
  getPrimaryWindow(event)?.close();
});

ipcMain.handle("window:get-state", (event) => {
  const win = getPrimaryWindow(event);
  return {
    isMaximized: win?.isMaximized() ?? false,
    isMinimized: win?.isMinimized() ?? false,
    isFullScreen: win?.isFullScreen() ?? false,
  };
});

ipcMain.handle("system:get-info", () => {
  const cpus = os.cpus();

  return {
    appVersion: app.getVersion(),
    platform: process.platform,
    release: os.release(),
    arch: os.arch(),
    hostname: os.hostname(),
    uptimeSeconds: os.uptime(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpuModel: cpus[0]?.model ?? "Unknown CPU",
    cpuCores: cpus.length,
    homeDir: os.homedir(),
    userName: os.userInfo().username,
    shell: os.userInfo().shell || process.env.SHELL || "",
    tempDir: os.tmpdir(),
    locale: app.getLocale(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    darkMode: nativeTheme.shouldUseDarkColors,
    displays: screen.getAllDisplays().map(summarizeDisplay),
  };
});

ipcMain.handle("system:open-settings", async () => {
  return { ok: await openSystemSettings() };
});

ipcMain.handle("fs:list-directory", async (_event, targetPath) => {
  return listDirectory(targetPath);
});

ipcMain.handle("fs:read-file", async (_event, filePath) => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return { content };
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle("fs:write-file", async (_event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, "utf-8");
    return { ok: true };
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle("fs:get-stats", async (_event, filePath) => {
  try {
    const stat = await fs.stat(filePath);
    return {
      size: stat.size,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile(),
      created: stat.birthtime.toISOString(),
      modified: stat.mtime.toISOString(),
      accessed: stat.atime.toISOString(),
    };
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle("fs:create-directory", async (_event, dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return { ok: true };
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle("fs:delete-item", async (_event, itemPath) => {
  try {
    const stat = await fs.stat(itemPath);
    if (stat.isDirectory()) {
      await fs.rm(itemPath, { recursive: true });
    } else {
      await fs.unlink(itemPath);
    }
    return { ok: true };
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle("fs:move-item", async (_event, src, dest) => {
  try {
    await fs.rename(src, dest);
    return { ok: true };
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle("fs:copy-item", async (_event, src, dest) => {
  try {
    const stat = await fs.stat(src);
    if (stat.isDirectory()) {
      await copyDirectory(src, dest);
    } else {
      await fs.copyFile(src, dest);
    }
    return { ok: true };
  } catch (e) {
    return { error: e.message };
  }
});

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

ipcMain.handle("system:get-battery", () => {
  return powerMonitor.getSystemPowerSaveInfo();
});

ipcMain.handle("system:get-volume", async () => {
  if (process.platform === "darwin") {
    return new Promise((resolve) => {
      exec("osascript -e 'output volume of (get volume settings)'", (err, stdout) => {
        if (err) resolve({ error: err.message });
        else resolve({ level: parseInt(stdout.trim()) });
      });
    });
  }
  if (process.platform === "win32") {
    return new Promise((resolve) => {
      exec('powershell -command "[audio]::Volume"', (err, stdout) => {
        if (err) resolve({ error: err.message });
        else resolve({ level: Math.round(parseFloat(stdout.trim()) * 100) });
      });
    });
  }
  return { level: 100 };
});

ipcMain.handle("system:set-volume", async (_event, level) => {
  if (process.platform === "darwin") {
    return new Promise((resolve) => {
      exec(`osascript -e 'set volume output volume ${Math.min(100, Math.max(0, level))}'`, (err) => {
        resolve({ ok: !err });
      });
    });
  }
  return { ok: false, error: "Not supported" };
});

ipcMain.handle("system:get-network-status", async () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (!iface.internal && iface.family === "IPv4") {
        return { name, address: iface.address, mac: iface.mac };
      }
    }
  }
  return null;
});

ipcMain.handle("shell:open-path", async (_event, targetPath) => {
  return shell.openPath(targetPath);
});

ipcMain.handle("shell:show-item-in-folder", async (_event, itemPath) => {
  shell.showItemInFolder(itemPath);
  return { ok: true };
});

ipcMain.handle("shell:open-external", async (_event, url) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return { error: "Invalid URL protocol" };
  }
  await shell.openExternal(url);
  return { ok: true };
});

ipcMain.handle("shell:get-downloads-path", () => {
  return app.getPath("downloads");
});

ipcMain.handle("shell:get-app-support-path", () => {
  return app.getPath("appData");
});

ipcMain.handle("app:get-version", () => {
  return app.getVersion();
});

ipcMain.handle("app:get-name", () => {
  return app.getName();
});

ipcMain.handle("app:get-path", (_event, name) => {
  return app.getPath(name);
});

ipcMain.handle("app:quit", () => {
  app.quit();
});

ipcMain.handle("app:relaunch", () => {
  app.relaunch();
  app.quit();
});

const storage = {};
ipcMain.handle("storage:get", (_event, key) => {
  return storage[key] ?? null;
});

ipcMain.handle("storage:set", (_event, key, value) => {
  storage[key] = value;
  return { ok: true };
});

ipcMain.handle("storage:remove", (_event, key) => {
  delete storage[key];
  return { ok: true };
});

ipcMain.handle("storage:clear", () => {
  Object.keys(storage).forEach(k => delete storage[k]);
  return { ok: true };
});

ipcMain.handle("clipboard:read", () => {
  return clipboard.readText();
});

ipcMain.handle("clipboard:write", (_event, text) => {
  clipboard.writeText(text);
  return { ok: true };
});

ipcMain.handle("clipboard:read-image", () => {
  const img = clipboard.readImage();
  if (img.isEmpty()) return null;
  return img.toPNG().toString("base64");
});

ipcMain.handle("clipboard:write-image", (_event, base64Data) => {
  const img = nativeImage.createFromBuffer(Buffer.from(base64Data, "base64"));
  clipboard.writeImage(img);
  return { ok: true };
});

ipcMain.handle("notifications:show", (_event, title, options) => {
  if (!notification.isSupported()) {
    return { supported: false };
  }
  const n = new notification({
    title,
    body: options?.body ?? "",
    silent: options?.silent ?? false,
    icon: options?.icon,
  });
  n.show();
  return { supported: true };
});

ipcMain.handle("notifications:is-supported", () => {
  return notification.isSupported();
});

ipcMain.handle("process:list", async () => {
  return new Promise((resolve) => {
    const cmd = process.platform === "win32" 
      ? "wmic process get ProcessId,Name,WorkingSetSize" 
      : "ps -eo pid,comm,rss";
    exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout) => {
      if (err) {
        resolve([]);
        return;
      }
      const lines = stdout.trim().split("\n").slice(1);
      const processes = lines.map(line => {
        const parts = line.trim().split(/\s+/);
        if (process.platform === "win32") {
          return {
            pid: parseInt(parts[0]) || 0,
            name: parts[1] || "unknown",
            memory: parseInt(parts[2]) || 0,
          };
        }
        return {
          pid: parseInt(parts[0]) || 0,
          name: parts[1] || "unknown",
          memory: parseInt(parts[2]) || 0,
        };
      }).filter(p => p.pid);
      resolve(processes);
    });
  });
});

ipcMain.handle("process:kill", async (_event, pid) => {
  return new Promise((resolve) => {
    try {
      process.kill(pid, "SIGTERM");
      resolve({ ok: true });
    } catch {
      resolve({ ok: false, error: "Process not found or denied" });
    }
  });
});

ipcMain.handle("window:set-always-on-top", (event, flag) => {
  const win = getPrimaryWindow(event);
  if (win) {
    win.setAlwaysOnTop(flag);
  }
  return { ok: true };
});

ipcMain.handle("window:set-fullscreen", (event, flag) => {
  const win = getPrimaryWindow(event);
  if (win) {
    win.setFullScreen(flag);
  }
  return { ok: win?.isFullScreen() ?? flag };
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
