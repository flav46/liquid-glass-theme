import { motion } from "framer-motion";
import "./Taskbar.css";

const runningApps = [
  { icon: "🌐", name: "Chrome", active: true },
  { icon: "📝", name: "Notepad", active: false },
  { icon: "🎵", name: "Music Player", active: false },
];

const systemTray = [
  { icon: "🔊", name: "Volume" },
  { icon: "📶", name: "WiFi" },
  { icon: "🔋", name: "Battery" },
  { icon: "🕒", name: "12:34 PM" },
];

function Taskbar() {
  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <motion.div
          className="start-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="start-icon">🪟</div>
          <span>Start</span>
        </motion.div>

        <div className="running-apps">
          {runningApps.map((app, index) => (
            <motion.div
              key={index}
              className={`taskbar-app ${app.active ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="app-icon">{app.icon}</div>
              {app.active && <div className="active-indicator"></div>}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="taskbar-center">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Type here to search" />
        </div>
      </div>

      <div className="taskbar-right">
        <div className="system-tray">
          {systemTray.map((item, index) => (
            <motion.div
              key={index}
              className="tray-item"
              whileHover={{ scale: 1.1 }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>
        <div className="show-desktop">
          <motion.div
            className="desktop-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            □
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Taskbar;
