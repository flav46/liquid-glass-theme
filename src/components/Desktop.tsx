import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Window from "./Window";
import FileExplorer from "./FileExplorer";
import Notepad from "./Notepad";
import Calculator from "./Calculator";
import Browser from "./Browser";
import Paint from "./Paint";
import Settings from "./Settings";
import MusicPlayer from "./MusicPlayer";
import Terminal from "./Terminal";
import Calendar from "./Calendar";
import SystemMonitor from "./SystemMonitor";
import UbuntuApps from "./UbuntuApps";
import Weather from "./Weather";
import DeepinFileManager from "./DeepinFileManager";
import MacOSApps from "./MacOSApps";
import KernelDetails from "./KernelDetails";
import DiskUsage from "./DiskUsage";
import NetworkMonitor from "./NetworkMonitor";
import ControlCenter from "./ControlCenter";
import TaskManager from "./TaskManager";
import Logs from "./Logs";
import PackageManager from "./PackageManager";
import Dock from "./Dock";
import Taskbar from "./Taskbar";
import AppDrawer from "./AppDrawer";
import "./Desktop.css";

export interface App {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  resizable?: boolean;
}

export const APPS: App[] = [
  { id: "deepin-files", name: "Deepin Files", icon: "📂", component: DeepinFileManager, defaultSize: { width: 900, height: 580 }, minSize: { width: 600, height: 400 }, resizable: true },
  { id: "macos-apps", name: "macOS Apps", icon: "🖥️", component: MacOSApps, defaultSize: { width: 800, height: 560 }, minSize: { width: 600, height: 450 }, resizable: true },
  { id: "kernel", name: "Kernel Details", icon: "☢️", component: KernelDetails, defaultSize: { width: 580, height: 480 }, minSize: { width: 450, height: 380 }, resizable: true },
  { id: "disk-usage", name: "Disk Usage", icon: "💾", component: DiskUsage, defaultSize: { width: 580, height: 520 }, minSize: { width: 480, height: 420 }, resizable: true },
  { id: "network", name: "Network Monitor", icon: "🌐", component: NetworkMonitor, defaultSize: { width: 620, height: 520 }, minSize: { width: 500, height: 420 }, resizable: true },
  { id: "control-center", name: "Control Center", icon: "🎛️", component: ControlCenter, defaultSize: { width: 360, height: 540 }, minSize: { width: 320, height: 480 }, resizable: false },
  { id: "files", name: "Files", icon: "📁", component: FileExplorer, defaultSize: { width: 800, height: 500 }, minSize: { width: 400, height: 300 }, resizable: true },
  { id: "text-editor", name: "Text Editor", icon: "📝", component: Notepad, defaultSize: { width: 600, height: 400 }, minSize: { width: 300, height: 200 }, resizable: true },
  { id: "calculator", name: "Calculator", icon: "🧮", component: Calculator, defaultSize: { width: 320, height: 480 }, resizable: false },
  { id: "browser", name: "Web Browser", icon: "🌐", component: Browser, defaultSize: { width: 900, height: 600 }, minSize: { width: 500, height: 400 }, resizable: true },
  { id: "paint", name: "Paint", icon: "🎨", component: Paint, defaultSize: { width: 800, height: 600 }, minSize: { width: 400, height: 300 }, resizable: true },
  { id: "settings", name: "Settings", icon: "⚙️", component: Settings, defaultSize: { width: 700, height: 500 }, minSize: { width: 500, height: 400 }, resizable: true },
  { id: "music", name: "Music", icon: "🎵", component: MusicPlayer, defaultSize: { width: 420, height: 560 }, minSize: { width: 350, height: 450 }, resizable: true },
  { id: "terminal", name: "Terminal", icon: "⬛", component: Terminal, defaultSize: { width: 640, height: 420 }, minSize: { width: 400, height: 300 }, resizable: true },
  { id: "calendar", name: "Calendar", icon: "📅", component: Calendar, defaultSize: { width: 420, height: 480 }, minSize: { width: 350, height: 400 }, resizable: true },
  { id: "system-monitor", name: "System Monitor", icon: "📊", component: SystemMonitor, defaultSize: { width: 650, height: 500 }, minSize: { width: 500, height: 400 }, resizable: true },
  { id: "ubuntu-apps", name: "Ubuntu Apps", icon: "🟠", component: UbuntuApps, defaultSize: { width: 720, height: 560 }, minSize: { width: 600, height: 450 }, resizable: true },
  { id: "weather", name: "Weather", icon: "🌤️", component: Weather, defaultSize: { width: 380, height: 480 }, minSize: { width: 320, height: 400 }, resizable: true },
  { id: "camera", name: "Camera", icon: "📷", component: Browser, defaultSize: { width: 640, height: 480 }, resizable: true },
  { id: "mail", name: "Mail", icon: "📧", component: Browser, defaultSize: { width: 700, height: 500 }, resizable: true },
  { id: "notes", name: "Notes", icon: "📒", component: Notepad, defaultSize: { width: 400, height: 500 }, resizable: true },
  { id: "task-manager", name: "Task Manager", icon: "📋", component: TaskManager, defaultSize: { width: 550, height: 480 }, minSize: { width: 450, height: 400 }, resizable: true },
  { id: "logs", name: "System Logs", icon: "📜", component: Logs, defaultSize: { width: 600, height: 450 }, minSize: { width: 500, height: 350 }, resizable: true },
  { id: "package-manager", name: "Package Manager", icon: "📦", component: PackageManager, defaultSize: { width: 650, height: 520 }, minSize: { width: 550, height: 420 }, resizable: true },
];
  { id: "settings", name: "Settings", icon: "⚙️", component: Settings, defaultSize: { width: 700, height: 500 }, minSize: { width: 500, height: 400 }, resizable: true },
];

const DESKTOP_ICONS = [
  { icon: "📂", name: "This PC", appId: "deepin-files" },
  { icon: "🖥️", name: "macOS Apps", appId: "macos-apps" },
  { icon: "☢️", name: "Kernel", appId: "kernel" },
  { icon: "💾", name: "Disk Usage", appId: "disk-usage" },
  { icon: "🌐", name: "Network", appId: "network" },
  { icon: "🎛️", name: "Control Center", appId: "control-center" },
  { icon: "📋", name: "Task Manager", appId: "task-manager" },
  { icon: "📜", name: "System Logs", appId: "logs" },
  { icon: "📦", name: "Apps Store", appId: "package-manager" },
  { icon: "📁", name: "Documents", appId: "deepin-files" },
  { icon: "📥", name: "Downloads", appId: "deepin-files" },
  { icon: "🎵", name: "Music", appId: "music" },
  { icon: "📊", name: "System Monitor", appId: "system-monitor" },
  { icon: "📅", name: "Calendar", appId: "calendar" },
  { icon: "⬛", name: "Terminal", appId: "terminal" },
  { icon: "🟠", name: "Ubuntu Apps", appId: "ubuntu-apps" },
  { icon: "⚙️", name: "Settings", appId: "settings" },
];

function Desktop() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openWindows, setOpenWindows] = useState<Array<{ id: string; appId: string; props?: Record<string, unknown> }>>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDateTime] = useState(localStorage.getItem("showDateTime") !== "false");
  const [showWeather] = useState(localStorage.getItem("showWeather") !== "false");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = useCallback((appId: string, props?: Record<string, unknown>) => {
    const existing = openWindows.find(w => w.appId === appId);
    if (existing) {
      setActiveWindow(existing.id);
      return existing.id;
    }
    const newWindow = { id: `${appId}-${Date.now()}`, appId, props };
    setOpenWindows(prev => [...prev, newWindow]);
    setActiveWindow(newWindow.id);
    setShowDrawer(false);
    return newWindow.id;
  }, [openWindows]);

  const closeWindow = useCallback((windowId: string) => {
    setOpenWindows(prev => {
      const next = prev.filter(w => w.id !== windowId);
      if (activeWindow === windowId && next.length > 0) {
        setActiveWindow(next[next.length - 1].id);
      } else if (next.length === 0) {
        setActiveWindow(null);
      }
      return next;
    });
  }, [activeWindow]);

  const focusWindow = useCallback((windowId: string) => {
    const win = openWindows.find(w => w.id === windowId);
    if (win && activeWindow !== windowId) {
      setOpenWindows(prev => [...prev.filter(w => w.id !== windowId), win]);
      setActiveWindow(windowId);
    }
  }, [openWindows, activeWindow]);

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const handleIconClick = (icon: typeof DESKTOP_ICONS[0]) => {
    openApp(icon.appId);
  };

  return (
    <div className="desktop">
      <div className="desktop-icons" onClick={() => setShowDrawer(false)}>
        {DESKTOP_ICONS.map((icon, idx) => (
          <motion.div
            key={idx}
            className="desktop-icon-btn"
            onClick={(e) => { e.stopPropagation(); handleIconClick(icon); }}
            onDoubleClick={() => handleIconClick(icon)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="desktop-icon-emoji">{icon.icon}</div>
            <div className="desktop-icon-name">{icon.name}</div>
          </motion.div>
        ))}
      </div>

      <div className="desktop-widgets">
        {showDateTime && (
          <motion.div
            className="widget date-time-widget"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="time">{formatTime(currentTime)}</div>
            <div className="date">{formatDate(currentTime)}</div>
          </motion.div>
        )}
        {showWeather && (
          <motion.div
            className="widget weather-widget"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="weather-icon">☀️</div>
            <div className="temp">72°F</div>
          </motion.div>
        )}
      </div>

      <Taskbar
        openWindows={openWindows}
        activeWindow={activeWindow}
        onWindowClick={focusWindow}
        onDockClick={openApp}
        APPS={APPS}
      />

      <Dock APPS={APPS} onAppClick={openApp} />

      <AppDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} APPS={APPS} onAppClick={(id) => openApp(id)} />

      {openWindows.map((win) => {
        const app = APPS.find(a => a.id === win.appId);
        if (!app) return null;
        return (
          <Window
            key={win.id}
            title={app.name}
            icon={app.icon}
            isActive={activeWindow === win.id}
            defaultSize={app.defaultSize}
            minSize={app.minSize}
            resizable={app.resizable ?? true}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          >
            <app.component {...win.props} />
          </Window>
        );
      })}
    </div>
  );
}

export default Desktop;