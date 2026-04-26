import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Window from "./Window";

interface DFileItem {
  name: string;
  path: string;
  type: "file" | "folder" | "disk";
  size?: number;
  modified?: string;
  icon: string;
}

const mockDisks = [
  { name: "Deepin 20", path: "/", type: "disk" as const, icon: "💿", size: 512000 },
  { name: "Data", path: "/media/data", type: "disk" as const, icon: "💾", size: 1024000 },
];

const mockFiles: DFileItem[] = [
  { name: "Documents", path: "/home/user/Documents", type: "folder", icon: "📁", modified: "2026-04-20" },
  { name: "Downloads", path: "/home/user/Downloads", type: "folder", icon: "📥", modified: "2026-04-25" },
  { name: "Music", path: "/home/user/Music", type: "folder", icon: "🎵", modified: "2026-04-18" },
  { name: "Pictures", path: "/home/user/Pictures", type: "folder", icon: "🖼️", modified: "2026-04-22" },
  { name: "Videos", path: "/home/user/Videos", type: "folder", icon: "🎬", modified: "2026-04-15" },
  { name: "Desktop", path: "/home/user/Desktop", type: "folder", icon: "🖥️", modified: "2026-04-24" },
  { name: "readme.txt", path: "/home/user/readme.txt", type: "file", icon: "📄", size: 2048, modified: "2026-04-10" },
  { name: "notes.md", path: "/home/user/notes.md", type: "file", icon: "📝", size: 4096, modified: "2026-04-23" },
];

function DeepinFileManager({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [currentPath, setCurrentPath] = useState("/home/user");
  const [viewMode, setViewMode] = useState<"icon" | "list">("icon");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [files, setFiles] = useState<DFileItem[]>(mockFiles);

  const navigate = (path: string) => {
    setCurrentPath(path);
    setSelectedItem(null);
  };

  const goBack = () => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    setCurrentPath("/" + parts.join("/"));
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "--";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Window
      title="Deepin File Manager"
      icon="📂"
      isActive={isActive ?? true}
      defaultSize={{ width: 900, height: 580 }}
      minSize={{ width: 600, height: 400 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="deepin-fm">
        <div className="deepin-toolbar">
          <div className="deepin-nav">
            <button onClick={goBack} title="Back">◀</button>
            <button title="Forward">▶</button>
            <button title="Up">⬆️</button>
          </div>
          <div className="deepin-path">
            <span>{currentPath}</span>
          </div>
          <div className="deepin-search">
            <span>🔍</span>
            <input type="text" placeholder="Search..." />
          </div>
        </div>

        <div className="deepin-sidebar">
          <div className="deepin-devices">
            <div className="deepin-sidebar-title">Devices</div>
            {mockDisks.map((disk, idx) => (
              <motion.div
                key={idx}
                className="deepin-device"
                whileHover={{ x: 4 }}
              >
                <span>{disk.icon}</span>
                <span>{disk.name}</span>
              </motion.div>
            ))}
          </div>
          <div className="deepin-places">
            <div className="deepin-sidebar-title">Places</div>
            {["Desktop", "Documents", "Downloads", "Music", "Pictures", "Videos"].map((place, idx) => (
              <motion.div
                key={idx}
                className="deepin-place"
                whileHover={{ x: 4 }}
              >
                <span>📁</span>
                <span>{place}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="deepin-content">
          <div className="deepin-view-toggle">
            <button onClick={() => setViewMode("icon")} className={viewMode === "icon" ? "active" : ""}>▦</button>
            <button onClick={() => setViewMode("list")} className={viewMode === "list" ? "active" : ""}>☰</button>
          </div>

          {viewMode === "icon" ? (
            <div className="deepin-grid">
              {files.map((file) => (
                <motion.div
                  key={file.name}
                  className={`deepin-item ${selectedItem === file.name ? "selected" : ""}`}
                  onClick={() => setSelectedItem(file.name)}
                  onDoubleClick={() => file.type === "folder" && navigate(file.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="deepin-item-icon">{file.icon}</div>
                  <div className="deepin-item-name">{file.name}</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="deepin-list">
              <div className="deepin-list-header">
                <span>Name</span>
                <span>Size</span>
                <span>Modified</span>
              </div>
              {files.map((file) => (
                <div
                  key={file.name}
                  className={`deepin-list-item ${selectedItem === file.name ? "selected" : ""}`}
                  onClick={() => setSelectedItem(file.name)}
                  onDoubleClick={() => file.type === "folder" && navigate(file.path)}
                >
                  <span>{file.icon} {file.name}</span>
                  <span>{formatSize(file.size)}</span>
                  <span>{file.modified}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="deepin-status">
          {files.filter(f => f.type === "folder").length} folders, {files.filter(f => f.type === "file").length} files
        </div>
      </div>
    </Window>
  );
}

export default DeepinFileManager;