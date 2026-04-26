import { useEffect, useState } from "react";
import Window from "./Window";

interface FileExplorerProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  zIndex?: number;
  onFocus?: () => void;
  isActive?: boolean;
}

interface FileItem {
  name: string;
  type: "file" | "folder";
  path: string;
  size?: number | null;
  modified?: string;
}

function FileExplorer({ onClose, initialPosition, zIndex, onFocus, isActive }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState("/home/flavin");
  const [homePath, setHomePath] = useState("/home/flavin");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    window.electronAPI?.system
      .getInfo()
      .then((info) => {
        if (!cancelled && info.homeDir) {
          setHomePath(info.homeDir);
          setCurrentPath(info.homeDir);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDirectory = async () => {
      setLoading(true);
      setError("");

      try {
        const entries = await window.electronAPI?.fs.listDirectory(currentPath);
        if (!cancelled) {
          setFiles(entries ?? []);
        }
      } catch (err) {
        const mockFiles = [
          { name: "Documents", path: currentPath + "/Documents", type: "folder" as const, size: null, modified: new Date().toISOString() },
          { name: "Downloads", path: currentPath + "/Downloads", type: "folder" as const, size: null, modified: new Date().toISOString() },
          { name: "Pictures", path: currentPath + "/Pictures", type: "folder" as const, size: null, modified: new Date().toISOString() },
          { name: "notes.txt", path: currentPath + "/notes.txt", type: "file" as const, size: 2048, modified: new Date().toISOString() },
        ];
        if (!cancelled) {
          setFiles(mockFiles);
        }
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadDirectory();

    return () => {
      cancelled = true;
    };
  }, [currentPath]);

  const navigateToFolder = (folderName: string) => {
    if (folderName === "..") {
      const parts = currentPath.split("/");
      parts.pop();
      setCurrentPath(parts.join("/") || "/");
    } else {
      setCurrentPath(`${currentPath}/${folderName}`.replace("//", "/"));
    }
  };

  const getBreadcrumb = () => {
    return currentPath.split("/").filter(Boolean).map((part, index, array) => (
      <span key={index}>
        {index > 0 && " / "}
        <button
          className="breadcrumb-item"
          onClick={() => {
            const newPath = `/${array.slice(0, index + 1).join("/")}`;
            setCurrentPath(newPath);
          }}
        >
          {part}
        </button>
      </span>
    ));
  };

  const openItem = async (item: FileItem) => {
    if (item.type === "folder") {
      setCurrentPath(item.path);
      return;
    }

    await window.electronAPI?.shell.openPath(item.path);
  };

  const formatSize = (size?: number | null) => {
    if (!size) {
      return "";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <Window
      title="Files"
      onClose={onClose}
      width={860}
      height={560}
      initialPosition={initialPosition}
      zIndex={zIndex}
      onFocus={onFocus}
      isActive={isActive}
    >
      <div className="file-explorer">
        <div className="explorer-toolbar">
          <button onClick={() => navigateToFolder("..")} disabled={currentPath === "/" || currentPath === "/home"}>
            ← Back
          </button>
          <button onClick={() => setCurrentPath(homePath)}>
            🏠 Home
          </button>
          <button onClick={() => void window.electronAPI?.shell.openPath(currentPath)}>
            ↗ Open Native
          </button>
          <div className="address-bar">
            <span>/</span>
            {getBreadcrumb()}
          </div>
        </div>

        <div className="file-list-header">
          <div className="file-name">Name</div>
          <div className="file-size">Size</div>
          <div className="file-modified">Modified</div>
        </div>

        <div className="file-list">
          {loading && <div className="empty-state">Loading directory…</div>}
          {!loading && error && <div className="empty-state">{error}</div>}
          {!loading && !error && files.length === 0 && <div className="empty-state">This folder is empty.</div>}
          {!loading && !error && files.map((file, index) => (
            <div
              key={`${file.path}-${index}`}
              className={`file-item ${selectedItem === file.name ? "selected" : ""} ${file.type}`}
              onClick={() => setSelectedItem(file.name)}
              onDoubleClick={() => void openItem(file)}
            >
              <div className="file-icon">
                {file.type === "folder" ? "📁" : "📄"}
              </div>
              <div className="file-name">{file.name}</div>
              <div className="file-size">{formatSize(file.size)}</div>
              <div className="file-modified">
                {file.modified ? new Date(file.modified).toLocaleString() : ""}
              </div>
            </div>
          ))}
        </div>

        <div className="status-bar">
          {files.length} items • {selectedItem ? `Selected: ${selectedItem}` : "No selection"}
        </div>
      </div>
    </Window>
  );
}

export default FileExplorer;
