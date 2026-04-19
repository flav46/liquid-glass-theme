import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./Desktop.css";

const desktopApps = [
  { icon: "🖥️", name: "This PC", type: "folder" },
  { icon: "📁", name: "Documents", type: "folder" },
  { icon: "📁", name: "Downloads", type: "folder" },
  { icon: "🗑️", name: "Recycle Bin", type: "bin" },
  { icon: "🎵", name: "Music", type: "folder" },
  { icon: "📸", name: "Pictures", type: "folder" },
  { icon: "🎬", name: "Videos", type: "folder" },
  { icon: "🌐", name: "Chrome", type: "app" },
  { icon: "⚙️", name: "Settings", type: "app" },
  { icon: "🎮", name: "Steam", type: "app" },
  { icon: "📝", name: "Notepad", type: "app" },
  { icon: "🎨", name: "Photoshop", type: "app" },
];

function Desktop() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDateTime, setShowDateTime] = useState(localStorage.getItem("showDateTime") !== "false");
  const [showWeather, setShowWeather] = useState(localStorage.getItem("showWeather") !== "false");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setShowDateTime(localStorage.getItem("showDateTime") !== "false");
      setShowWeather(localStorage.getItem("showWeather") !== "false");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="desktop-container">
      <div className="desktop-grid">
        {desktopApps.map((app, index) => (
          <motion.div
            key={index}
            className={`desktop-icon ${app.type}`}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05, type: "spring", stiffness: 200 }}
          >
            <div className="icon">{app.icon}</div>
            <div className="name">{app.name}</div>
          </motion.div>
        ))}
      </div>

      {/* Widgets */}
      <div className="desktop-widgets">
        {showDateTime && (
          <motion.div
            className="widget date-time-widget"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="time">{formatTime(currentTime)}</div>
            <div className="date">{formatDate(currentTime)}</div>
          </motion.div>
        )}

        {showWeather && (
          <motion.div
            className="widget weather-widget"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <div className="weather-icon">☀️</div>
            <div className="weather-info">
              <div className="temperature">72°F</div>
              <div className="condition">Sunny</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Desktop;
