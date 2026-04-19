import { motion } from "framer-motion";
import { useState } from "react";
import "./AppDrawer.css";

// Import app components
import Notepad from "./Notepad";
import Calculator from "./Calculator";
import FileExplorer from "./FileExplorer";
import Settings from "./Settings";
import Paint from "./Paint";
import Browser from "./Browser";

const apps = [
  // System Apps
  { id: "this-pc", icon: "🖥️", name: "This PC", category: "system", type: "folder", component: null },
  { id: "documents", icon: "📁", name: "Documents", category: "system", type: "folder", component: null },
  { id: "downloads", icon: "📁", name: "Downloads", category: "system", type: "folder", component: null },
  { id: "recycle-bin", icon: "🗑️", name: "Recycle Bin", category: "system", type: "bin", component: null },
  { id: "settings", icon: "⚙️", name: "Settings", category: "system", type: "app", component: "Settings" },
  { id: "search", icon: "🔍", name: "Search", category: "system", type: "app", component: null },

  // Productivity
  { id: "notepad", icon: "📝", name: "Notepad", category: "productivity", type: "app", component: "Notepad" },
  { id: "excel", icon: "📊", name: "Excel", category: "productivity", type: "app", component: null },
  { id: "powerpoint", icon: "📈", name: "PowerPoint", category: "productivity", type: "app", component: null },
  { id: "outlook", icon: "📧", name: "Outlook", category: "productivity", type: "app", component: null },
  { id: "calendar", icon: "📅", name: "Calendar", category: "productivity", type: "app", component: null },
  { id: "file-explorer", icon: "🗂️", name: "File Explorer", category: "productivity", type: "app", component: "FileExplorer" },

  // Creative
  { id: "paint", icon: "🎨", name: "Paint", category: "creative", type: "app", component: "Paint" },
  { id: "photos", icon: "📸", name: "Photos", category: "creative", type: "app", component: null },
  { id: "media-player", icon: "🎵", name: "Media Player", category: "creative", type: "app", component: null },
  { id: "movies-tv", icon: "🎬", name: "Movies & TV", category: "creative", type: "app", component: null },
  { id: "xbox", icon: "🎮", name: "Xbox", category: "creative", type: "app", component: null },
  { id: "games", icon: "🎯", name: "Games", category: "creative", type: "app", component: null },

  // Internet & Communication
  { id: "edge", icon: "🌐", name: "Edge", category: "internet", type: "app", component: "Browser" },
  { id: "teams", icon: "💬", name: "Teams", category: "internet", type: "app", component: null },
  { id: "your-phone", icon: "📱", name: "Your Phone", category: "internet", type: "app", component: null },
  { id: "mail", icon: "📧", name: "Mail", category: "internet", type: "app", component: null },
  { id: "news", icon: "📰", name: "News", category: "internet", type: "app", component: null },
  { id: "store", icon: "🛒", name: "Store", category: "internet", type: "app", component: null },

  // Utilities
  { id: "calculator", icon: "🧮", name: "Calculator", category: "utilities", type: "app", component: "Calculator" },
  { id: "security", icon: "🛡️", name: "Security", category: "utilities", type: "app", component: null },
  { id: "device-manager", icon: "🔧", name: "Device Manager", category: "utilities", type: "app", component: null },
  { id: "disk-management", icon: "💾", name: "Disk Management", category: "utilities", type: "app", component: null },
  { id: "power-options", icon: "🔋", name: "Power Options", category: "utilities", type: "app", component: null },
  { id: "network", icon: "🌐", name: "Network", category: "utilities", type: "app", component: null },
  { id: "printers", icon: "🖨️", name: "Printers", category: "utilities", type: "app", component: null },
];

const categories = [
  { id: "all", name: "All Apps", icon: "📱" },
  { id: "system", name: "System", icon: "⚙️" },
  { id: "productivity", name: "Productivity", icon: "💼" },
  { id: "creative", name: "Creative", icon: "🎨" },
  { id: "internet", name: "Internet", icon: "🌐" },
  { id: "utilities", name: "Utilities", icon: "🔧" },
];

function AppDrawer() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openWindows, setOpenWindows] = useState<string[]>([]);

  const filteredApps = apps.filter(app => {
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAppClick = (app: any) => {
    if (app.component) {
      if (!openWindows.includes(app.id)) {
        setOpenWindows(prev => [...prev, app.id]);
      }
    } else {
      // For apps without components, show a placeholder message
      alert(`${app.name} is not yet implemented, but you can imagine it working! 🚀`);
    }
  };

  const closeWindow = (appId: string) => {
    setOpenWindows(prev => prev.filter(id => id !== appId));
  };

  const renderWindow = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if (!app || !app.component) return null;

    const commonProps = { onClose: () => closeWindow(appId) };

    switch (app.component) {
      case "Notepad":
        return <Notepad key={appId} {...commonProps} />;
      case "Calculator":
        return <Calculator key={appId} {...commonProps} />;
      case "FileExplorer":
        return <FileExplorer key={appId} {...commonProps} />;
      case "Settings":
        return <Settings key={appId} {...commonProps} />;
      case "Paint":
        return <Paint key={appId} {...commonProps} />;
      case "Browser":
        return <Browser key={appId} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-drawer">
      {/* Header */}
      <div className="drawer-header">
        <h1>Apps</h1>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="categories">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="apps-container">
        <motion.div
          className="apps-grid"
          layout
        >
          {filteredApps.map((app, index) => (
            <motion.div
              key={`${app.category}-${index}`}
              className={`app-item ${app.type}`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              layout
              onClick={() => handleAppClick(app)}
            >
              <div className="app-icon">{app.icon}</div>
              <div className="app-name">{app.name}</div>
            </motion.div>
          ))}
        </motion.div>

        {filteredApps.length === 0 && (
          <div className="no-results">
            <span>🔍</span>
            <p>No apps found</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="drawer-footer">
        <div className="stats">
          {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Open Windows */}
      {openWindows.map(appId => renderWindow(appId))}
    </div>
  );
}

export default AppDrawer;
