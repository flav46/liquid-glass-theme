import { useState } from "react";
import { motion } from "framer-motion";
import Window from "./Window";

interface Package {
  name: string;
  version: string;
  size: string;
  installed: boolean;
}

const packages: Package[] = [
  { name: "firefox", version: "122.0", size: "85 MB", installed: true },
  { name: "gimp", version: "2.10.34", size: "320 MB", installed: true },
  { name: "vlc", version: "3.0.18", size: "45 MB", installed: true },
  { name: "vscode", version: "1.85.0", size: "120 MB", installed: false },
  { name: "nodejs", version: "20.10.0", size: "30 MB", installed: true },
  { name: "python", version: "3.11.5", size: "25 MB", installed: true },
  { name: "git", version: "2.43.0", size: "15 MB", installed: true },
  { name: "docker", version: "24.0.7", size: "180 MB", installed: false },
  { name: "kubernetes", version: "1.28.0", size: "50 MB", installed: false },
  { name: "rust", version: "1.75.0", size: "250 MB", installed: false },
];

function PackageManager({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [pkgs, setPkgs] = useState(packages);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "installed" | "available">("all");

  const filtered = pkgs.filter(p => {
    const matchesSearch = p.name.includes(search.toLowerCase());
    if (category === "installed") return matchesSearch && p.installed;
    if (category === "available") return matchesSearch && !p.installed;
    return matchesSearch;
  });

  const toggleInstall = (name: string) => {
    setPkgs(pkgs.map(p => p.name === name ? { ...p, installed: !p.installed } : p));
  };

  return (
    <Window
      title="Package Manager"
      icon="📦"
      isActive={isActive ?? true}
      defaultSize={{ width: 650, height: 520 }}
      minSize={{ width: 550, height: 420 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="package-manager">
        <div className="pm-header">
          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="pm-cats">
            <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>All</button>
            <button className={category === "installed" ? "active" : ""} onClick={() => setCategory("installed")}>Installed</button>
            <button className={category === "available" ? "active" : ""} onClick={() => setCategory("available")}>Available</button>
          </div>
        </div>
        <div className="pm-list">
          {filtered.map((pkg) => (
            <motion.div key={pkg.name} className="pm-item" whileHover={{ x: 4 }}>
              <div className="pm-info">
                <span className="pm-name">{pkg.name}</span>
                <span className="pm-version">v{pkg.version}</span>
              </div>
              <span className="pm-size">{pkg.size}</span>
              <button className={`pm-btn ${pkg.installed ? "remove" : "install"}`} onClick={() => toggleInstall(pkg.name)}>
                {pkg.installed ? "Remove" : "Install"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </Window>
  );
}

export default PackageManager;