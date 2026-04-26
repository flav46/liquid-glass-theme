import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Window from "./Window";

interface NetworkInfo {
  interface: string;
  ip: string;
  mac: string;
  status: "up" | "down";
  rx: number;
  tx: number;
}

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
}

function NetworkMonitor({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [networks, setNetworks] = useState<NetworkInfo[]>([
    { interface: "wlan0", ip: "192.168.1.100", mac: "AA:BB:CC:DD:EE:01", status: "up", rx: 125.5, tx: 45.2 },
    { interface: "eth0", ip: "10.0.0.5", mac: "AA:BB:CC:DD:EE:02", status: "up", rx: 89.3, tx: 32.1 },
    { interface: "lo", ip: "127.0.0.1", mac: "00:00:00:00:00:00", status: "up", rx: 0.1, tx: 0.1 },
  ]);

  const [wifiNetworks, setWifiNetworks] = useState([
    { name: "Home-WiFi", signal: 95, secured: true, type: "5G" },
    { name: "Office-Network", signal: 78, secured: true, type: "2.4G" },
    { name: "Guest-WiFi", signal: 65, secured: false, type: "5G" },
  ]);

  const [activeTab, setActiveTab] = useState<"interfaces" | "wifi" | "processes">("interfaces");

  const formatSpeed = (mbps: number) => `${mbps.toFixed(1)} MB/s`;

  return (
    <Window
      title="Network Monitor"
      icon="🌐"
      isActive={isActive ?? true}
      defaultSize={{ width: 620, height: 520 }}
      minSize={{ width: 500, height: 420 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="network-app">
        <div className="network-tabs">
          <button className={activeTab === "interfaces" ? "active" : ""} onClick={() => setActiveTab("interfaces")}>Interfaces</button>
          <button className={activeTab === "wifi" ? "active" : ""} onClick={() => setActiveTab("wifi")}>WiFi</button>
        </div>

        {activeTab === "interfaces" && (
          <div className="network-interfaces">
            {networks.map((net, idx) => (
              <motion.div key={net.interface} className="network-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <div className="network-card-header">
                  <span className="network-name">{net.interface}</span>
                  <span className={`network-status ${net.status}`}>{net.status === "up" ? "🟢" : "🔴"}</span>
                </div>
                <div className="network-details">
                  <div className="network-detail">
                    <span>IP</span>
                    <span>{net.ip}</span>
                  </div>
                  <div className="network-detail">
                    <span>MAC</span>
                    <span>{net.mac}</span>
                  </div>
                </div>
                <div className="network-speed">
                  <div className="speed-item">
                    <span>⬇️ {formatSpeed(net.rx)}</span>
                  </div>
                  <div className="speed-item">
                    <span>⬆️ {formatSpeed(net.tx)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "wifi" && (
          <div className="wifi-networks">
            {wifiNetworks.map((wifi, idx) => (
              <motion.div key={wifi.name} className="wifi-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                <div className="wifi-icon">{wifi.signal > 80 ? "📶" : wifi.signal > 50 ? "😐" : "📡"}</div>
                <div className="wifi-info">
                  <span className="wifi-name">{wifi.name}</span>
                  <span className="wifi-type">{wifi.type} • {wifi.signal}%</span>
                </div>
                <div className="wifi-actions">
                  {wifi.secured ? "🔒" : "🔓"}
                  <button>Connect</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Window>
  );
}

export default NetworkMonitor;