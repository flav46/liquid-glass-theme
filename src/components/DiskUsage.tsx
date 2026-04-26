import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Window from "./Window";

interface DiskInfo {
  name: string;
  mount: string;
  size: number;
  used: number;
  free: number;
  type: string;
}

function DiskUsage({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [disks, setDisks] = useState<DiskInfo[]>([
    { name: "Deepin 20", mount: "/", size: 512000, used: 234000, free: 278000, type: "ext4" },
    { name: "Data", mount: "/media/data", size: 1024000, used: 678000, free: 346000, type: "ntfs" },
    { name: "Backup", mount: "/media/backup", size: 2048000, used: 1456000, free: 592000, type: "ext4" },
  ]);

  const formatSize = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  const getPercent = (used: number, total: number) => Math.round((used / total) * 100);

  return (
    <Window
      title="Disk Usage Analyzer"
      icon="💾"
      isActive={isActive ?? true}
      defaultSize={{ width: 580, height: 520 }}
      minSize={{ width: 480, height: 420 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="disk-usage">
        <div className="disk-total">
          <span className="disk-total-label">Total Space</span>
          <span className="disk-total-value">{formatSize(disks.reduce((a, d) => a + d.size, 0))}</span>
        </div>

        <div className="disk-chart">
          <svg viewBox="0 0 100 100" className="disk-ring">
            {disks.map((disk, idx) => {
              const offset = disks.slice(0, idx).reduce((a, d) => a + (d.used / d.size) * 100, 0);
              const percent = (disk.used / disk.size) * 100;
              const colors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"];
              return (
                <motion.circle
                  key={disk.name}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={colors[idx % colors.length]}
                  strokeWidth="8"
                  strokeDasharray={`${percent * 2.51} 251`}
                  strokeDashoffset={-offset * 2.51}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 251" }}
                  animate={{ strokeDasharray: `${percent * 2.51} 251` }}
                  transition={{ duration: 1, delay: idx * 0.2 }}
                />
              );
            })}
          </svg>
        </div>

        <div className="disk-list">
          {disks.map((disk, idx) => (
            <motion.div
              key={disk.name}
              className="disk-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="disk-item-header">
                <span className="disk-name">{disk.name}</span>
                <span className="disk-percent">{getPercent(disk.used, disk.size)}%</span>
              </div>
              <div className="disk-bar">
                <motion.div
                  className="disk-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${getPercent(disk.used, disk.size)}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                />
              </div>
              <div className="disk-item-info">
                <span>{formatSize(disk.used)} used</span>
                <span>{formatSize(disk.free)} free</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Window>
  );
}

export default DiskUsage;