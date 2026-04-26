import { useState } from "react";
import { motion } from "framer-motion";
import Window from "./Window";

interface MacApp {
  id: string;
  name: string;
  icon: string;
}

const macApps: MacApp[] = [
  { id: "finder", name: "Finder", icon: "😀" },
  { id: "safari", name: "Safari", icon: "🧭" },
  { id: "messages", name: "Messages", icon: "💬" },
  { id: "mail", name: "Mail", icon: "📧" },
  { id: "maps", name: "Maps", icon: "🗺️" },
  { id: "photos", name: "Photos", icon: "🌄" },
  { id: "facetime", name: "FaceTime", icon: "📹" },
  { id: "calendar", name: "Calendar", icon: "📅" },
  { id: "notes", name: "Notes", icon: "📝" },
  { id: "reminders", name: "Reminders", icon: "☑️" },
  { id: "music", name: "Music", icon: "🎵" },
  { id: "podcasts", name: "Podcasts", icon: "🎙️" },
  { id: "tv", name: "TV", icon: "📺" },
  { id: "appstore", name: "App Store", icon: "🅰️" },
  { id: "settings", name: "System Settings", icon: "⚙️" },
  { id: "terminal", name: "Terminal", icon: "⬛" },
];

const categories = [
  { id: "favorites", name: "Favorites" },
  { id: "creative", name: "Creative" },
  { id: "productivity", name: "Productivity" },
  { id: "utilities", name: "Utilities" },
];

function MacOSApps({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState("favorites");

  return (
    <Window
      title="macOS Apps"
      icon="🖥️"
      isActive={isActive ?? true}
      defaultSize={{ width: 800, height: 560 }}
      minSize={{ width: 600, height: 450 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="macos-apps">
        <div className="macos-sidebar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`macos-cat ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="macos-content">
          <div className="macos-grid">
            {macApps.map((app) => (
              <motion.button
                key={app.id}
                className="macos-app"
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="macos-app-icon">{app.icon}</div>
                <div className="macos-app-name">{app.name}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

export default MacOSApps;