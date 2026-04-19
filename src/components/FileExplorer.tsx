import { useState } from "react";
import Window from "./Window";

interface FileExplorerProps {
  onClose: () => void;
}

interface FileItem {
  name: string;
  type: "file" | "folder";
  size?: string;
  modified?: string;
}

function FileExplorer({ onClose }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState("C:\\Users\\User");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const mockFiles: FileItem[] = [
    { name: "Documents", type: "folder", modified: "2024-01-15" },
    { name: "Downloads", type: "folder", modified: "2024-01-14" },
    { name: "Pictures", type: "folder", modified: "2024-01-13" },
    { name: "Music", type: "folder", modified: "2024-01-12" },
    { name: "Videos", type: "folder", modified: "2024-01-11" },
    { name: "Desktop", type: "folder", modified: "2024-01-10" },
    { name: "readme.txt", type: "file", size: "2.1 KB", modified: "2024-01-15" },
    { name: "config.json", type: "file", size: "1.5 KB", modified: "2024-01-14" },
    { name: "app.exe", type: "file", size: "45.2 MB", modified: "2024-01-13" },
    { name: "data.db", type: "file", size: "128 MB", modified: "2024-01-12" },
  ];

  const navigateToFolder = (folderName: string) => {
    if (folderName === "..") {
      const parts = currentPath.split("\\");
      parts.pop();
      setCurrentPath(parts.join("\\"));
    } else {
      setCurrentPath(`${currentPath}\\${folderName}`);
    }
  };

  const getBreadcrumb = () => {
    return currentPath.split("\\").map((part, index, array) => (
      <span key={index}>
        {index > 0 && " > "}
        <button
          className="breadcrumb-item"
          onClick={() => {
            const newPath = array.slice(0, index + 1).join("\\");
            setCurrentPath(newPath);
          }}
        >
          {part}
        </button>
      </span>
    ));
  };

  return (
    <Window title="File Explorer" onClose={onClose} width={800} height={600}>
      <div className="file-explorer">
        {/* Toolbar */}
        <div className="explorer-toolbar">
          <button onClick={() => navigateToFolder("..")} disabled={currentPath === "C:"}>
            ← Back
          </button>
          <button onClick={() => setCurrentPath("C:\\Users\\User")}>
            🏠 Home
          </button>
          <div className="address-bar">
            {getBreadcrumb()}
          </div>
        </div>

        {/* File List Header */}
        <div className="file-list-header">
          <div className="file-name">Name</div>
          <div className="file-size">Size</div>
          <div className="file-modified">Date Modified</div>
        </div>

        {/* File List */}
        <div className="file-list">
          {mockFiles.map((file, index) => (
            <div
              key={index}
              className={`file-item ${selectedItem === file.name ? 'selected' : ''} ${file.type}`}
              onClick={() => setSelectedItem(file.name)}
              onDoubleClick={() => file.type === 'folder' && navigateToFolder(file.name)}
            >
              <div className="file-icon">
                {file.type === 'folder' ? '📁' : '📄'}
              </div>
              <div className="file-name">{file.name}</div>
              <div className="file-size">{file.size || ''}</div>
              <div className="file-modified">{file.modified}</div>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          {mockFiles.length} items • {selectedItem ? `Selected: ${selectedItem}` : 'No selection'}
        </div>
      </div>
    </Window>
  );
}

export default FileExplorer;