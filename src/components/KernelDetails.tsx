import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Window from "./Window";

interface KernelInfo {
  version: string;
  name: string;
  architecture: string;
  build: string;
  date: string;
}

function KernelDetails({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [kernel, setKernel] = useState<KernelInfo>({
    version: "6.1.0-deepin1",
    name: "Deepin Kernel",
    architecture: "x86_64",
    build: "#1 SMP",
    date: "2026-04-15",
  });
  
  const [modules, setModules] = useState<string[]>([
    "nvidia", "nvidia_modeset", "nvidia_uvm", "nvidia_drm",
    "amdgpu", "radeon", "amdkfd",
    "i915", " nouveau", "vmwgfx",
    "bridge", " tuner", "v4l2",
    "btusb", "bluetooth", "uvcvideo",
    "tg3", "e1000e", "ixgbe",
    "ext4", "btrfs", "xfs",
    "overlay", "aufs", "squashfs",
  ]);

  const [uptime, setUptime] = useState(86400);

  useEffect(() => {
    const interval = setInterval(() => setUptime(u => u + 1), 1);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s: number) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <Window
      title="Kernel Details"
      icon="⚙️"
      isActive={isActive ?? true}
      defaultSize={{ width: 580, height: 480 }}
      minSize={{ width: 450, height: 380 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="kernel-app">
        <div className="kernel-header">
          <motion.div 
            className="kernel-logo"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            ☢️
          </motion.div>
          <div className="kernel-title">{kernel.name}</div>
        </div>

        <div className="kernel-info">
          <div className="kernel-row">
            <span>Version</span>
            <span className="kernel-value">{kernel.version}</span>
          </div>
          <div className="kernel-row">
            <span>Architecture</span>
            <span className="kernel-value">{kernel.architecture}</span>
          </div>
          <div className="kernel-row">
            <span>Build</span>
            <span className="kernel-value">{kernel.build}</span>
          </div>
          <div className="kernel-row">
            <span>Compiled</span>
            <span className="kernel-value">{kernel.date}</span>
          </div>
          <div className="kernel-row">
            <span>Uptime</span>
            <span className="kernel-value highlight">{formatUptime(uptime)}</span>
          </div>
        </div>

        <div className="kernel-modules-header">
          Loaded Kernel Modules ({modules.length})
        </div>
        <div className="kernel-modules">
          {modules.map((mod, idx) => (
            <motion.span
              key={idx}
              className="kernel-module"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
            >
              {mod}
            </motion.span>
          ))}
        </div>
      </div>
    </Window>
  );
}

export default KernelDetails;