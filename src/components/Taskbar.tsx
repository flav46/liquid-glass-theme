import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Taskbar.css";

interface OpenWindow {
  id: string;
  appId: string;
}

interface TaskbarProps {
  openWindows: OpenWindow[];
  activeWindow: string | null;
  onWindowClick: (id: string) => void;
  onDockClick: (appId: string) => void;
  APPS: Array<{ id: string; name: string; icon: string }>;
}

const APP_ICONS: Record<string, string> = {
  files: "📁",
  notepad: "📝",
  calculator: "🧮",
  browser: "🌐",
  paint: "🎨",
  settings: "⚙️",
};

function Taskbar({ openWindows, activeWindow, onWindowClick, onDockClick, APPS }: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const getIcon = (appId: string) => APP_ICONS[appId] || "📄";
  const getName = (appId: string) => APPS.find(a => a.id === appId)?.name || appId;

  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <motion.button
          className="start-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDockClick("toggle")}
        >
          <span className="start-icon">🪟</span>
          <span className="start-label">Start</span>
        </motion.button>

        <div className="running-apps">
          {openWindows.map((win) => (
            <motion.button
              key={win.id}
              className={`taskbar-app ${activeWindow === win.id ? "taskbar-app--active" : ""}`}
              onClick={() => onWindowClick(win.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="taskbar-app-icon">{getIcon(win.appId)}</span>
              <span className="taskbar-app-name">{getName(win.appId)}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="taskbar-center">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search apps..." />
        </div>
      </div>

      <div className="taskbar-right">
        <div className="system-tray">
          <div className="tray-item" title="Volume">🔊</div>
          <div className="tray-item" title="WiFi">📶</div>
          <div className="tray-item" title="Battery">🔋</div>
          <div className="tray-item tray-time">{formatTime(currentTime)}</div>
        </div>
      </div>
    </div>
  );
}

export default Taskbar;