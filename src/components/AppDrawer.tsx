import { motion } from "framer-motion";
import { useState } from "react";
import "./AppDrawer.css";

function AppDrawer({ isOpen, onClose, APPS, onAppClick }: AppDrawerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApps = APPS.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <motion.div
      className="app-drawer-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="app-drawer"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="app-drawer-header">
          <h2 className="app-drawer-title">Apps</h2>
          <button className="app-drawer-close" onClick={onClose}>✕</button>
        </div>

        <div className="app-drawer-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="app-drawer-grid">
          {filteredApps.map((app) => (
            <motion.button
              key={app.id}
              className="app-drawer-item"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { onAppClick(app.id); onClose(); }}
            >
              <span className="app-drawer-icon">{app.icon}</span>
              <span className="app-drawer-name">{app.name}</span>
            </motion.button>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="app-drawer-empty">
            <p>No apps found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default AppDrawer;