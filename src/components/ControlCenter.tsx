import { useState } from "react";
import { motion } from "framer-motion";
import Window from "./Window";

function ControlCenter({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [airplane, setAirplane] = useState(false);
  const [nightLight, setNightLight] = useState(false);
  const [brightness, setBrightness] = useState(75);
  const [volume, setVolume] = useState(60);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const sliders = [
    { icon: "☀️", label: "Brightness", value: brightness, set: setBrightness },
    { icon: "🔊", label: "Volume", value: volume, set: setVolume },
  ];

  const toggles = [
    { icon: "📶", label: "WiFi", state: wifi, set: setWifi },
    { icon: "📘", label: "Bluetooth", state: bluetooth, set: setBluetooth },
    { icon: "✈️", label: "Airplane", state: airplane, set: setAirplane },
    { icon: "🌙", label: "Night Light", state: nightLight, set: setNightLight },
    { icon: "🔕", label: "Do Not Disturb", state: doNotDisturb, set: setDoNotDisturb },
  ];

  return (
    <Window
      title="Control Center"
      icon="🎛️"
      isActive={isActive ?? true}
      defaultSize={{ width: 360, height: 540 }}
      minSize={{ width: 320, height: 480 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="control-center">
        <div className="cc-sliders">
          {sliders.map((slider, idx) => (
            <div key={idx} className="cc-slider">
              <span className="cc-slider-icon">{slider.icon}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={slider.value}
                onChange={(e) => slider.set(Number(e.target.value))}
              />
              <span className="cc-slider-value">{slider.value}%</span>
            </div>
          ))}
        </div>

        <div className="cc-toggles">
          {toggles.map((toggle, idx) => (
            <motion.button
              key={idx}
              className={`cc-toggle ${toggle.state ? "active" : ""}`}
              onClick={() => toggle.set(!toggle.state)}
              whileTap={{ scale: 0.95 }}
            >
              <span className="cc-toggle-icon">{toggle.icon}</span>
              <span className="cc-toggle-label">{toggle.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="cc-quick-actions">
          <motion.button className="cc-action" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            🔒 Lock
          </motion.button>
          <motion.button className="cc-action" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            ⚡ Power Saver
          </motion.button>
          <motion.button className="cc-action" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            🔄 Restart
          </motion.button>
        </div>
      </div>
    </Window>
  );
}

export default ControlCenter;