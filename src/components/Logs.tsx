import { useState } from "react";
import Window from "./Window";

function Logs({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [logs] = useState([
    { time: "02:36:15", type: "info", msg: "System started" },
    { time: "02:36:16", type: "info", msg: "Loading kernel modules..." },
    { time: "02:36:18", type: "success", msg: "Desktop environment initialized" },
    { time: "02:36:20", type: "info", msg: "Network interface eth0 up" },
    { time: "02:36:21", type: "success", msg: "Connected to network" },
    { time: "02:36:25", type: "info", msg: "User session started" },
    { time: "02:36:30", type: "info", msg: "Application launcher ready" },
    { time: "02:36:35", type: "warning", msg: "GPU driver not fully optimized" },
    { time: "02:37:00", type: "info", msg: "File system check complete" },
    { time: "02:37:15", type: "success", msg: "All services running" },
  ]);

  return (
    <Window
      title="System Logs"
      icon="📜"
      isActive={isActive ?? true}
      defaultSize={{ width: 600, height: 450 }}
      minSize={{ width: 500, height: 350 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="system-logs">
        {logs.map((log, idx) => (
          <div key={idx} className={`log-entry log-${log.type}`}>
            <span className="log-time">{log.time}</span>
            <span className="log-type">{log.type}</span>
            <span className="log-msg">{log.msg}</span>
          </div>
        ))}
      </div>
    </Window>
  );
}

export default Logs;