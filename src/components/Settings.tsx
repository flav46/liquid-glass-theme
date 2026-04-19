import { useState } from "react";
import Window from "./Window";

interface SettingsProps {
  onClose: () => void;
}

function Settings({ onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState("system");
  const [settings, setSettings] = useState({
    theme: "dark",
    wallpaper: "default",
    sound: true,
    notifications: true,
    autoUpdate: true,
    startupApps: ["notepad", "calculator"],
    showDateTime: localStorage.getItem("showDateTime") !== "false", // default true
    showWeather: localStorage.getItem("showWeather") !== "false", // default true
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "system", name: "System", icon: "⚙️" },
    { id: "personalization", name: "Personalization", icon: "🎨" },
    { id: "apps", name: "Apps", icon: "📱" },
    { id: "privacy", name: "Privacy", icon: "🔒" },
  ];

  return (
    <Window title="Settings" onClose={onClose} width={700} height={500}>
      <div className="settings">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === "system" && (
            <div className="settings-section">
              <h3>System Settings</h3>
              <div className="setting-item">
                <label>Sound</label>
                <input
                  type="checkbox"
                  checked={settings.sound}
                  onChange={(e) => updateSetting("sound", e.target.checked)}
                />
              </div>
              <div className="setting-item">
                <label>Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => updateSetting("notifications", e.target.checked)}
                />
              </div>
              <div className="setting-item">
                <label>Auto Update</label>
                <input
                  type="checkbox"
                  checked={settings.autoUpdate}
                  onChange={(e) => updateSetting("autoUpdate", e.target.checked)}
                />
              </div>
            </div>
          )}

          {activeTab === "personalization" && (
            <div className="settings-section">
              <h3>Personalization</h3>
              <div className="setting-item">
                <label>Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting("theme", e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Wallpaper</label>
                <select
                  value={settings.wallpaper}
                  onChange={(e) => updateSetting("wallpaper", e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="nature">Nature</option>
                  <option value="abstract">Abstract</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Show Date & Time Widget</label>
                <input
                  type="checkbox"
                  checked={settings.showDateTime}
                  onChange={(e) => {
                    updateSetting("showDateTime", e.target.checked);
                    localStorage.setItem("showDateTime", e.target.checked.toString());
                  }}
                />
              </div>
              <div className="setting-item">
                <label>Show Weather Widget</label>
                <input
                  type="checkbox"
                  checked={settings.showWeather}
                  onChange={(e) => {
                    updateSetting("showWeather", e.target.checked);
                    localStorage.setItem("showWeather", e.target.checked.toString());
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "apps" && (
            <div className="settings-section">
              <h3>App Settings</h3>
              <div className="setting-item">
                <label>Startup Apps</label>
                <div className="startup-apps">
                  {["notepad", "calculator", "file-explorer", "paint", "browser"].map(app => (
                    <label key={app} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.startupApps.includes(app)}
                        onChange={(e) => {
                          const newApps = e.target.checked
                            ? [...settings.startupApps, app]
                            : settings.startupApps.filter(a => a !== app);
                          updateSetting("startupApps", newApps);
                        }}
                      />
                      {app.charAt(0).toUpperCase() + app.slice(1).replace("-", " ")}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="settings-section">
              <h3>Privacy Settings</h3>
              <div className="setting-item">
                <label>Location Services</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-item">
                <label>Diagnostic Data</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-item">
                <label>Activity History</label>
                <input type="checkbox" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
}

export default Settings;