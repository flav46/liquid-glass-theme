import { useEffect, useState } from "react";
import Window from "./Window";

interface ThemeState {
  mode: "glass" | "neon" | "mist";
  wallpaper: "aurora" | "sunrise" | "midnight";
  animationLevel: number;
  glow: number;
  glass: number;
  dockMode: "bottom" | "left";
  accent: string;
}

interface SettingsProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  zIndex?: number;
  onFocus?: () => void;
  isActive?: boolean;
  theme: ThemeState;
  onThemeChange: (patch: Partial<ThemeState>) => void;
}

function Settings({
  onClose,
  initialPosition,
  zIndex,
  onFocus,
  isActive,
  theme,
  onThemeChange,
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState("system");
  const [settings, setSettings] = useState({
    sound: true,
    notifications: true,
    autoUpdate: true,
    startupApps: ["notes", "calculator"],
  });
  const [systemInfo, setSystemInfo] = useState<Awaited<ReturnType<NonNullable<typeof window.electronAPI>["system"]["getInfo"]>> | null>(null);
  const [windowState, setWindowState] = useState({
    isMaximized: false,
    isMinimized: false,
    isFullScreen: false,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    let cancelled = false;

    const loadSystemData = async () => {
      const [info, state] = await Promise.all([
        window.electronAPI?.system.getInfo()?.catch(() => ({
          appVersion: "1.0.0",
          platform: navigator.platform,
          release: "模拟系统",
          arch: "x64",
          hostname: "liquid-glass",
          uptimeSeconds: 3600,
          totalMemory: 16 * 1024 ** 3,
          freeMemory: 8 * 1024 ** 3,
          cpuModel: "Apple Silicon",
          cpuCores: 8,
          homeDir: "/home/user",
          userName: "User",
          shell: "/bin/zsh",
          tempDir: "/tmp",
          locale: "en-US",
          timezone: "America/New_York",
          darkMode: false,
          displays: [{ id: 1, label: "内置显示器", scaleFactor: 2, size: { width: 2560, height: 1600 }, workArea: { x: 0, y: 0, width: 2560, height: 1550 }, rotation: 0, internal: true, touchSupport: "none" }],
        })),
        window.electronAPI?.window.getState()?.catch(() => null),
      ]);

      if (!cancelled) {
        setSystemInfo(info ?? null);
        setWindowState(
          state ?? {
            isMaximized: false,
            isMinimized: false,
            isFullScreen: false,
          },
        );
      }
    };

    void loadSystemData();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatMemory = (bytes: number) => `${(bytes / (1024 ** 3)).toFixed(1)} GB`;
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const tabs = [
    { id: "system", name: "System", icon: "⚙️" },
    { id: "personalization", name: "Theme Engine", icon: "🎨" },
    { id: "apps", name: "Apps", icon: "📱" },
    { id: "effects", name: "Effects", icon: "✨" },
  ];

  return (
    <div className="settings-app">
      <aside className="settings-sidebar">{tabs.map(tab => (
        <div className="settings-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
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
                  onChange={(event) => updateSetting("sound", event.target.checked)}
                />
              </div>
              <div className="setting-item">
                <label>Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(event) => updateSetting("notifications", event.target.checked)}
                />
              </div>
              <div className="setting-item">
                <label>Auto Update</label>
                <input
                  type="checkbox"
                  checked={settings.autoUpdate}
                  onChange={(event) => updateSetting("autoUpdate", event.target.checked)}
                />
              </div>
              <div className="info-card">
                <strong>Shell profile</strong>
                <p>Linux app structure with Deepin-style launcher and Mac-inspired liquid surfaces.</p>
              </div>
              {systemInfo && (
                <div className="system-grid">
                  <div className="info-card">
                    <strong>{systemInfo.hostname}</strong>
                    <p>{systemInfo.platform} {systemInfo.release} • {systemInfo.arch}</p>
                    <p>User: {systemInfo.userName}</p>
                    <p>Locale: {systemInfo.locale} • {systemInfo.timezone}</p>
                  </div>
                  <div className="info-card">
                    <strong>{systemInfo.cpuModel}</strong>
                    <p>{systemInfo.cpuCores} logical cores</p>
                    <p>Memory: {formatMemory(systemInfo.freeMemory)} free / {formatMemory(systemInfo.totalMemory)} total</p>
                    <p>Uptime: {formatUptime(systemInfo.uptimeSeconds)}</p>
                  </div>
                  <div className="info-card">
                    <strong>Window State</strong>
                    <p>Maximized: {windowState.isMaximized ? "Yes" : "No"}</p>
                    <p>Minimized: {windowState.isMinimized ? "Yes" : "No"}</p>
                    <p>Fullscreen: {windowState.isFullScreen ? "Yes" : "No"}</p>
                  </div>
                  <div className="info-card">
                    <strong>Display Topology</strong>
                    <p>{systemInfo.displays.length} display(s) detected</p>
                    {systemInfo.displays.slice(0, 2).map((display) => (
                      <p key={display.id}>
                        {display.size.width}x{display.size.height} @ {display.scaleFactor}x
                      </p>
                    ))}
                  </div>
                </div>
              )}
              <div className="settings-actions">
                <button onClick={() => void window.electronAPI?.system.openSettings()}>
                  Open Native OS Settings
                </button>
                <button onClick={() => void window.electronAPI?.shell.openPath(systemInfo?.homeDir ?? "/")}>
                  Open Home Folder
                </button>
              </div>
            </div>
          )}

          {activeTab === "personalization" && (
            <div className="settings-section">
              <h3>Theme Engine</h3>
              <div className="setting-item">
                <label>Theme Mode</label>
                <select value={theme.mode} onChange={(event) => onThemeChange({ mode: event.target.value as ThemeState["mode"] })}>
                  <option value="glass">Glass</option>
                  <option value="neon">Neon</option>
                  <option value="mist">Mist</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Wallpaper</label>
                <select
                  value={theme.wallpaper}
                  onChange={(event) => onThemeChange({ wallpaper: event.target.value as ThemeState["wallpaper"] })}
                >
                  <option value="aurora">Aurora</option>
                  <option value="sunrise">Sunrise</option>
                  <option value="midnight">Midnight</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Accent Color</label>
                <input
                  type="color"
                  value={theme.accent}
                  onChange={(event) => onThemeChange({ accent: event.target.value })}
                />
              </div>
              <div className="setting-item">
                <label>Dock Position</label>
                <select
                  value={theme.dockMode}
                  onChange={(event) => onThemeChange({ dockMode: event.target.value as ThemeState["dockMode"] })}
                >
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "apps" && (
            <div className="settings-section">
              <h3>App Settings</h3>
              <div className="setting-item settings-item--top">
                <label>Startup Apps</label>
                <div className="startup-apps">
                  {["notes", "calculator", "files", "paint", "browser"].map((app) => (
                    <label key={app} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.startupApps.includes(app)}
                        onChange={(event) => {
                          const newApps = event.target.checked
                            ? [...settings.startupApps, app]
                            : settings.startupApps.filter((item) => item !== app);
                          updateSetting("startupApps", newApps);
                        }}
                      />
                      {app.charAt(0).toUpperCase() + app.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "effects" && (
            <div className="settings-section">
              <h3>Animations and Glass</h3>
              <div className="setting-item setting-item--stacked">
                <label>Animation Level</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={theme.animationLevel}
                  onChange={(event) => onThemeChange({ animationLevel: Number(event.target.value) })}
                />
                <span>{theme.animationLevel}%</span>
              </div>
              <div className="setting-item setting-item--stacked">
                <label>Glass Strength</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={theme.glass}
                  onChange={(event) => onThemeChange({ glass: Number(event.target.value) })}
                />
                <span>{theme.glass}%</span>
              </div>
              <div className="setting-item setting-item--stacked">
                <label>Glow Strength</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={theme.glow}
                  onChange={(event) => onThemeChange({ glow: Number(event.target.value) })}
                />
                <span>{theme.glow}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
}

export default Settings;
