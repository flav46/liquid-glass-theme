import { useState, useEffect } from "react";
import Window from "./Window";

interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
}

function SystemMonitor({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState({ used: 0, total: 16 });
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const mockProcesses: ProcessInfo[] = [
      { pid: 1, name: "liquid-desktop", cpu: 2.1, memory: 320 },
      { pid: 2, name: "window-server", cpu: 1.8, memory: 280 },
      { pid: 3, name: "glass-compositor", cpu: 3.2, memory: 450 },
      { pid: 4, name: "gnome-shell", cpu: 1.5, memory: 220 },
      { pid: 5, name: "nautilus", cpu: 0.8, memory: 180 },
      { pid: 6, name: "terminal", cpu: 0.2, memory: 64 },
      { pid: 7, name: "chrome", cpu: 5.2, memory: 890 },
      { pid: 8, name: "settings-daemon", cpu: 0.5, memory: 120 },
    ];
    setProcesses(mockProcesses);

    const interval = setInterval(() => {
      setCpuUsage(Math.random() * 30 + 10);
      setMemoryUsage({ used: Math.random() * 8 + 4, total: 16 });
      setUptime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatMemory = (mb: number) => `${mb.toFixed(1)} GB`;
  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <Window
      title="System Monitor"
      icon="📊"
      isActive={isActive ?? true}
      defaultSize={{ width: 650, height: 500 }}
      minSize={{ width: 500, height: 400 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="system-monitor">
        <div className="system-stats">
          <div className="stat-card">
            <div className="stat-label">CPU</div>
            <div className="stat-value">{cpuUsage.toFixed(1)}%</div>
            <div className="stat-bar">
              <div className="stat-bar-fill" style={{ width: `${cpuUsage}%` }} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Memory</div>
            <div className="stat-value">{formatMemory(memoryUsage.used)} / {formatMemory(memoryUsage.total)}</div>
            <div className="stat-bar">
              <div className="stat-bar-fill" style={{ width: `${(memoryUsage.used / memoryUsage.total) * 100}%` }} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Uptime</div>
            <div className="stat-value">{formatUptime(uptime)}</div>
          </div>
        </div>

        <div className="processes-header">Processes</div>
        <div className="processes-list">
          <div className="process-header">
            <span>PID</span>
            <span>Name</span>
            <span>CPU</span>
            <span>Memory</span>
          </div>
          {processes.map(p => (
            <div key={p.pid} className="process-row">
              <span>{p.pid}</span>
              <span>{p.name}</span>
              <span>{p.cpu}%</span>
              <span>{p.memory} MB</span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

export default SystemMonitor;