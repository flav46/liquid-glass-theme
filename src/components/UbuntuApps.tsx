import { useState } from "react";
import { motion } from "framer-motion";
import Window from "./Window";

interface AppInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const ubuntuApps: AppInfo[] = [
  { id: "files", name: "Files", icon: "📁", description: "Browse files and folders" },
  { id: "text-editor", name: "Text Editor", icon: "📝", description: "Edit text files" },
  { id: "terminal", name: "Terminal", icon: "⬛", description: "Use command line" },
  { id: "calculator", name: "Calculator", icon: "🧮", description: "Perform calculations" },
  { id: "system-monitor", name: "System Monitor", icon: "📊", description: "View system processes" },
  { id: "settings", name: "Settings", icon: "⚙️", description: "Configure system" },
  { id: "calendar", name: "Calendar", icon: "📅", description: "View dates and events" },
  { id: "weather", name: "Weather", icon: "🌤️", description: "Check weather" },
  { id: "clock", name: "Clock", icon: "🕐", description: "World clock" },
  { id: "camera", name: "Camera", icon: "📷", description: "Take photos" },
  { id: "screenshot", name: "Screenshot", icon: "📸", description: "Capture screen" },
  { id: "disk-usage", name: "Disk Usage", icon: "💾", description: "Check disk space" },
  { id: "software", name: "Software", icon: "📦", description: "Install apps" },
  { id: "updates", name: "Software Updater", icon: "🔄", description: "Update system" },
  { id: "firewall", name: "Firewall", icon: "🛡️", description: "Configure firewall" },
  { id: "users", name: "Users", icon: "👤", description: "Manage users" },
  { id: "networking", name: "Networking", icon: "🌐", description: "Network settings" },
  { id: "bluetooth", name: "Bluetooth", icon: "📘", description: "Bluetooth devices" },
  { id: "sound", name: "Sound", icon: "🔊", description: "Sound settings" },
  { id: "power", name: "Power", icon: "🔋", description: "Power management" },
  { id: "display", name: "Displays", icon: "🖥️", description: "Display settings" },
  { id: "keyboard", name: "Keyboard", icon: "⌨️", description: "Keyboard settings" },
  { id: "mouse", name: "Mouse", icon: "🖱️", description: "Mouse settings" },
  { id: "printers", name: "Printers", icon: "🖨️", description: "Manage printers" },
  { id: "scanner", name: "Scanner", icon: "📠", description: "Scan documents" },
  { id: "color", name: "Color", icon: "🎨", description: "Color management" },
  { id: "accessibility", name: "Accessibility", icon: "♿", description: "Accessibility options" },
  { id: "login-screen", name: "Login Screen", icon: "🔐", description: "Login settings" },
  { id: "about", name: "About", icon: "ℹ️", description: "System info" },
];

function UbuntuApps({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = [
    { id: "all", name: "All" },
    { id: "utilities", name: "Utilities" },
    { id: "system", name: "System" },
    { id: "accessories", name: "Accessories" },
  ];

  const filteredApps = ubuntuApps.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Window
      title="Ubuntu Apps"
      icon="🟠"
      isActive={isActive ?? true}
      defaultSize={{ width: 720, height: 560 }}
      minSize={{ width: 600, height: 450 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="ubuntu-apps">
        <div className="ubuntu-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ubuntu-categories">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`ubuntu-cat ${category === cat.id ? "active" : ""}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="ubuntu-grid">
          {filteredApps.map(app => (
            <motion.button
              key={app.id}
              className="ubuntu-app-item"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="ubuntu-app-icon">{app.icon}</div>
              <div className="ubuntu-app-name">{app.name}</div>
              <div className="ubuntu-app-desc">{app.description}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </Window>
  );
}

export default UbuntuApps;