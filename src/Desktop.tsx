import { useEffect, useMemo, useState } from "react";
import Icon from "./components/Icon";
import Dock from "./components/Dock";
import Window from "./components/Window";
import Browser from "./components/Browser";
import Calculator from "./components/Calculator";
import FileExplorer from "./components/FileExplorer";
import Notepad from "./components/Notepad";
import Paint from "./components/Paint";
import Settings from "./components/Settings";

type AppId =
  | "files"
  | "browser"
  | "settings"
  | "notes"
  | "calculator"
  | "paint"
  | "terminal"
  | "store"
  | "monitor"
  | "music";

type DesktopIconId = "home" | "projects" | "trash" | "apps";
type Stage = "installer" | "boot" | "ready";
type ThemeMode = "glass" | "neon" | "mist";
type WallpaperMode = "aurora" | "sunrise" | "midnight";
type DockMode = "bottom" | "left";

interface ThemeState {
  mode: ThemeMode;
  wallpaper: WallpaperMode;
  animationLevel: number;
  glow: number;
  glass: number;
  dockMode: DockMode;
  accent: string;
}

interface ShellApp {
  id: AppId;
  name: string;
  icon: string;
  group: string;
  summary: string;
}

const shellApps: ShellApp[] = [
  { id: "files", name: "Files", icon: "📁", group: "System", summary: "Browse the Linux home folders." },
  { id: "browser", name: "Browser", icon: "🌐", group: "Internet", summary: "Visit sites in a glass browser shell." },
  { id: "settings", name: "Control Center", icon: "⚙️", group: "System", summary: "Tune appearance, widgets, and startup apps." },
  { id: "notes", name: "Notes", icon: "📝", group: "Accessories", summary: "Quick notes with a simple editor." },
  { id: "calculator", name: "Calculator", icon: "🧮", group: "Accessories", summary: "Desktop calculator." },
  { id: "paint", name: "Drawing Board", icon: "🎨", group: "Creative", summary: "Sketch ideas on a canvas." },
  { id: "terminal", name: "Terminal", icon: "⌨️", group: "System", summary: "A faux terminal for shell ambience." },
  { id: "store", name: "App Store", icon: "🛍️", group: "System", summary: "Browse themed system apps." },
  { id: "monitor", name: "System Monitor", icon: "📊", group: "System", summary: "View CPU, memory, and battery cards." },
  { id: "music", name: "Music", icon: "🎵", group: "Media", summary: "A compact media panel." },
];

const desktopIcons = [
  { id: "home" as DesktopIconId, icon: "🏠", name: "Home" },
  { id: "projects" as DesktopIconId, icon: "🗂️", name: "Projects" },
  { id: "trash" as DesktopIconId, icon: "🗑️", name: "Trash" },
  { id: "apps" as DesktopIconId, icon: "🚀", name: "Applications" },
];

const initialWindowOffset: Record<AppId, { x: number; y: number }> = {
  files: { x: 120, y: 118 },
  browser: { x: 170, y: 104 },
  settings: { x: 220, y: 132 },
  notes: { x: 260, y: 148 },
  calculator: { x: 320, y: 168 },
  paint: { x: 190, y: 126 },
  terminal: { x: 240, y: 158 },
  store: { x: 200, y: 140 },
  monitor: { x: 280, y: 124 },
  music: { x: 340, y: 180 },
};

const launcherGroups = ["All", ...Array.from(new Set(shellApps.map((app) => app.group)))];

const defaultTheme: ThemeState = {
  mode: "glass",
  wallpaper: "aurora",
  animationLevel: 70,
  glow: 64,
  glass: 60,
  dockMode: "bottom",
  accent: "#8ad4ff",
};

function Desktop() {
  const [stage, setStage] = useState<Stage>("installer");
  const [installProgress, setInstallProgress] = useState(16);
  const [openApps, setOpenApps] = useState<AppId[]>(["files"]);
  const [activeApp, setActiveApp] = useState<AppId>("files");
  const [showLauncher, setShowLauncher] = useState(false);
  const [showControlStrip, setShowControlStrip] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(new Date());
  const [workspaceLabel, setWorkspaceLabel] = useState("Ubuntu x Deepin");
  const [appWindowState, setAppWindowState] = useState({
    isMaximized: false,
    isMinimized: false,
    isFullScreen: false,
  });
  const [theme, setTheme] = useState<ThemeState>(() => {
    try {
      const saved = localStorage.getItem("liquid-shell-theme");
      return saved ? { ...defaultTheme, ...JSON.parse(saved) } : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("liquid-shell-theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    window.electronAPI?.window.getState().then((state) => {
      if (state) {
        setAppWindowState(state);
      }
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (stage !== "installer") {
      return;
    }

    const step = window.setInterval(() => {
      setInstallProgress((value) => {
        if (value >= 100) {
          window.clearInterval(step);
          setStage("boot");
          return 100;
        }
        return Math.min(100, value + 7);
      });
    }, 170);

    return () => window.clearInterval(step);
  }, [stage]);

  useEffect(() => {
    if (stage !== "boot") {
      return;
    }

    const timer = window.setTimeout(() => {
      setStage("ready");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [stage]);

  const openApp = (appId: AppId) => {
    setOpenApps((current) => (current.includes(appId) ? current : [...current, appId]));
    setActiveApp(appId);
    setShowLauncher(false);
  };

  const closeApp = (appId: AppId) => {
    setOpenApps((current) => {
      const next = current.filter((id) => id !== appId);
      if (activeApp === appId && next.length > 0) {
        setActiveApp(next[next.length - 1]);
      }
      return next;
    });
  };

  const focusApp = (appId: AppId) => {
    setActiveApp(appId);
  };

  const updateTheme = (patch: Partial<ThemeState>) => {
    setTheme((current) => ({ ...current, ...patch }));
  };

  const handleDesktopIcon = (iconId: DesktopIconId) => {
    if (iconId === "apps") {
      setShowLauncher((value) => !value);
      return;
    }

    if (iconId === "trash") {
      openApp("files");
      setWorkspaceLabel("Trash review");
      return;
    }

    openApp("files");
    setWorkspaceLabel(iconId === "projects" ? "Projects workspace" : "Home workspace");
  };

  const filteredApps = useMemo(() => {
    return shellApps.filter((app) => {
      const matchesGroup = selectedGroup === "All" || app.group === selectedGroup;
      const needle = search.trim().toLowerCase();
      const matchesSearch =
        needle.length === 0 ||
        app.name.toLowerCase().includes(needle) ||
        app.summary.toLowerCase().includes(needle);

      return matchesGroup && matchesSearch;
    });
  }, [search, selectedGroup]);

  const topApps = openApps.length > 0 ? openApps : ["files", "browser", "settings", "notes"];

  const handleToggleMaximize = async () => {
    const state = await window.electronAPI?.window.toggleMaximize();
    if (state) {
      setAppWindowState((current) => ({ ...current, ...state }));
    }
  };

  const shellStyle = {
    ["--accent" as string]: theme.accent,
    ["--glow-strength" as string]: `${theme.glow}%`,
    ["--glass-strength" as string]: `${theme.glass}%`,
    ["--motion-level" as string]: `${theme.animationLevel}%`,
  };

  return (
    <main
      className={`shell theme-${theme.mode} wallpaper-${theme.wallpaper} dock-${theme.dockMode}`}
      style={shellStyle}
    >
      <div className="wallpaper wallpaper-base" />
      <div className="wallpaper wallpaper-top" />
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="grain" />
      <div className="neon-ribbon neon-ribbon-a" />
      <div className="neon-ribbon neon-ribbon-b" />

      {stage === "installer" && (
        <section className="boot-screen installer-screen">
          <div className="boot-card glass-panel">
            <div className="boot-logo">LG</div>
            <p className="eyebrow">Installer Feel</p>
            <h1>Preparing Liquid Glass OS</h1>
            <p>Configuring shell services, icon cache, theme engine, dock compositor, and system apps.</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${installProgress}%` }} />
            </div>
            <div className="install-steps">
              <span>Wallpaper layer</span>
              <span>Glass compositor</span>
              <span>System settings</span>
            </div>
          </div>
        </section>
      )}

      {stage === "boot" && (
        <section className="boot-screen boot-screen--logo">
          <div className="boot-orb" />
          <div className="boot-brand">
            <div className="boot-brand__logo">LG</div>
            <h1>Liquid Glass OS</h1>
            <p>Booting desktop services</p>
            <div className="boot-pulse">
              <span />
              <span />
              <span />
            </div>
          </div>
        </section>
      )}

      <div className={`shell-stage ${stage === "ready" ? "shell-stage--ready" : ""}`}>
        <header className="menu-bar">
          <div className="menu-bar__left">
            <button className="menu-chip distro-chip" onClick={() => setShowLauncher((value) => !value)}>
              <span>◉</span>
              <span>{workspaceLabel}</span>
            </button>
            <button className="menu-chip" onClick={() => setWorkspaceLabel("Ubuntu x Deepin")}>
              Activities
            </button>
            <button className="menu-chip" onClick={() => openApp("files")}>
              Files
            </button>
          </div>

          <div className="menu-bar__center">
            <span>{now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}</span>
            <strong>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong>
          </div>

          <div className="menu-bar__right">
            <button className="menu-chip" onClick={() => openApp("music")}>🎵</button>
            <button className="menu-chip" onClick={() => openApp("monitor")}>📊</button>
            <button className="menu-chip" onClick={() => setShowControlStrip((value) => !value)}>
              Wi-Fi  Battery
            </button>
            <div className="window-actions">
              <button className="window-action" onClick={() => void window.electronAPI?.window.minimize()} aria-label="Minimize app">
                _
              </button>
              <button className="window-action" onClick={() => void handleToggleMaximize()} aria-label="Toggle maximize">
                {appWindowState.isMaximized ? "❐" : "□"}
              </button>
              <button className="window-action window-action--close" onClick={() => void window.electronAPI?.window.close()} aria-label="Close app">
                ×
              </button>
            </div>
          </div>
        </header>

        <section className="desktop-surface">
          <aside className="desktop-icons">
            {desktopIcons.map((icon) => (
              <Icon
                key={icon.id}
                icon={icon.icon}
                name={icon.name}
                onOpen={() => handleDesktopIcon(icon.id)}
              />
            ))}
          </aside>

          <section className="hero-panel glass-panel">
            <p className="eyebrow">Liquid Glass Linux Shell</p>
            <h1>Ubuntu structure, Deepin flow, macOS polish.</h1>
            <p>
              Wallpaper depth, glass intensity, dock layout, and motion are now theme-driven so the shell
              can shift between calm glass and brighter neon moods without changing the desktop model.
            </p>
            <div className="hero-actions">
              <button onClick={() => setShowLauncher(true)}>Open Launcher</button>
              <button onClick={() => openApp("settings")}>System Settings</button>
            </div>
          </section>

          <section className="spotlight-card glass-panel">
            <p className="eyebrow">Desktop</p>
            <strong>{theme.mode} theme</strong>
            <span>{theme.wallpaper} wallpaper</span>
          </section>

          {showLauncher && (
            <section className="launcher glass-panel">
              <div className="launcher__header">
                <div>
                  <p className="eyebrow">Applications</p>
                  <h2>System apps</h2>
                </div>
                <button className="launcher__close" onClick={() => setShowLauncher(false)}>
                  Close
                </button>
              </div>

              <div className="launcher__controls">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search applications"
                />
                <div className="launcher__groups">
                  {launcherGroups.map((group) => (
                    <button
                      key={group}
                      className={group === selectedGroup ? "is-active" : ""}
                      onClick={() => setSelectedGroup(group)}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              <div className="launcher__grid">
                {filteredApps.map((app) => (
                  <button key={app.id} className="launcher-app" onClick={() => openApp(app.id)}>
                    <span className="launcher-app__icon">{app.icon}</span>
                    <span className="launcher-app__name">{app.name}</span>
                    <span className="launcher-app__summary">{app.summary}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {showControlStrip && (
            <aside className="control-strip glass-panel">
              <div className="control-strip__row">
                <span>Appearance</span>
                <strong>{theme.mode}</strong>
              </div>
              <div className="control-strip__row">
                <span>Desktop mode</span>
                <strong>{theme.dockMode} dock</strong>
              </div>
              <div className="control-strip__row">
                <span>Animations</span>
                <strong>{theme.animationLevel}%</strong>
              </div>
              <div className="control-strip__row">
                <span>Filesystem</span>
                <strong>/home/flavin</strong>
              </div>
              <div className="control-strip__actions">
                <button onClick={() => openApp("settings")}>Settings</button>
                <button onClick={() => openApp("monitor")}>Monitor</button>
              </div>
            </aside>
          )}

          {openApps.map((appId, index) => (
            <div key={appId} className="window-host">
              {renderAppWindow({
                appId,
                theme,
                isActive: activeApp === appId,
                onActivate: () => focusApp(appId),
                onClose: () => closeApp(appId),
                onUpdateTheme: updateTheme,
                offset: initialWindowOffset[appId] ?? { x: 180 + index * 24, y: 120 + index * 18 },
                zIndex: activeApp === appId ? 30 : 20 + index,
              })}
            </div>
          ))}
        </section>

        <div className="taskbar glass-panel">
          <div className="taskbar__left">
            <button className="taskbar__pill" onClick={() => setShowLauncher((value) => !value)}>
              Launcher
            </button>
            <span className="taskbar__workspace">{workspaceLabel}</span>
          </div>
          <div className="taskbar__center">
            {openApps.map((appId) => {
              const app = shellApps.find((item) => item.id === appId);
              if (!app) {
                return null;
              }

              return (
                <button
                  key={app.id}
                  className={`taskbar__app ${activeApp === app.id ? "taskbar__app--active" : ""}`}
                  onClick={() => openApp(app.id)}
                >
                  <span>{app.icon}</span>
                  <span>{app.name}</span>
                </button>
              );
            })}
          </div>
          <div className="taskbar__right">
            <span>{theme.wallpaper}</span>
            <strong>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong>
          </div>
        </div>

        <Dock
          apps={shellApps.filter((app) => topApps.includes(app.id))}
          activeApp={activeApp}
          openApps={openApps}
          onOpenApp={openApp}
          onToggleLauncher={() => setShowLauncher((value) => !value)}
        />
      </div>
    </main>
  );
}

interface AppWindowProps {
  appId: AppId;
  theme: ThemeState;
  isActive: boolean;
  offset: { x: number; y: number };
  zIndex: number;
  onActivate: () => void;
  onClose: () => void;
  onUpdateTheme: (patch: Partial<ThemeState>) => void;
}

function renderAppWindow({ appId, theme, isActive, offset, zIndex, onActivate, onClose, onUpdateTheme }: AppWindowProps) {
  const shared = {
    onClose,
    initialPosition: offset,
    zIndex,
    onFocus: onActivate,
    isActive,
  };

  switch (appId) {
    case "files":
      return <FileExplorer {...shared} />;
    case "browser":
      return <Browser {...shared} />;
    case "settings":
      return <Settings {...shared} theme={theme} onThemeChange={onUpdateTheme} />;
    case "notes":
      return <Notepad {...shared} />;
    case "calculator":
      return <Calculator {...shared} />;
    case "paint":
      return <Paint {...shared} />;
    case "terminal":
      return (
        <Window title="Terminal" width={700} height={440} {...shared}>
          <div className="terminal-app">
            <p>flavin@liquid-glass:~$ neofetch</p>
            <pre>
{`OS: Ubuntu x Deepin remix
Shell: bash
Theme: ${theme.mode}
Wallpaper: ${theme.wallpaper}
Desktop: Custom Electron shell
Home: /home/flavin`}
            </pre>
            <p>flavin@liquid-glass:~$ systemctl status shell-ui</p>
            <p>active (running)  dock compositor  theme engine  wallpaper renderer</p>
          </div>
        </Window>
      );
    case "store":
      return (
        <Window title="App Store" width={760} height={460} {...shared}>
          <div className="card-grid">
            {shellApps.map((app) => (
              <article key={app.id} className="mini-card">
                <div className="mini-card__title">
                  <span>{app.icon}</span>
                  <strong>{app.name}</strong>
                </div>
                <p>{app.summary}</p>
              </article>
            ))}
          </div>
        </Window>
      );
    case "monitor":
      return (
        <Window title="System Monitor" width={720} height={430} {...shared}>
          <div className="metrics-grid">
            <article className="metric-card">
              <span>CPU</span>
              <strong>28%</strong>
              <p>Window compositor and glass blur are stable.</p>
            </article>
            <article className="metric-card">
              <span>Motion</span>
              <strong>{theme.animationLevel}%</strong>
              <p>Fluid transitions and neon ribbon drift.</p>
            </article>
            <article className="metric-card">
              <span>Glow</span>
              <strong>{theme.glow}%</strong>
              <p>Accent emission on wallpaper and dock.</p>
            </article>
          </div>
        </Window>
      );
    case "music":
      return (
        <Window title="Music" width={520} height={360} {...shared}>
          <div className="music-app">
            <div className="album-art">♪</div>
            <div>
              <p className="eyebrow">Now Playing</p>
              <h3>Liquid Mornings</h3>
              <p>Deepin Dreams Ensemble</p>
            </div>
            <div className="music-controls">
              <button>⏮</button>
              <button>⏯</button>
              <button>⏭</button>
            </div>
          </div>
        </Window>
      );
    default:
      return null;
  }
}

export default Desktop;
