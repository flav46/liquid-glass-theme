import React, { useMemo, useState } from "react";
import Dock from "./Dock";
import Spotlight from "./Spotlight";

const desktopIcons = [
  { id: "finder", emoji: "🖥", label: "Macintosh HD", accent: "sky" },
  { id: "projects", emoji: "📁", label: "Projects", accent: "mint" },
  { id: "glass-lab", emoji: "🎨", label: "Glass Lab", accent: "rose" },
  { id: "music", emoji: "🎵", label: "Now Playing", accent: "gold" }
];

const wallpaperThemes = {
  aurora: {
    label: "Aurora",
    shellClass: "theme-aurora"
  },
  blush: {
    label: "Blush",
    shellClass: "theme-blush"
  },
  midnight: {
    label: "Midnight",
    shellClass: "theme-midnight"
  }
};

const soundProfiles = {
  glass: "Glass Chime",
  ambient: "Ambient Soft",
  studio: "Studio Clear"
};

const windowCatalog = {
  finder: {
    title: "Finder",
    kind: "finder",
    classes: "window-card window-finder",
    width: 720,
    body: (
      <>
        <div className="finder-sidebar">
          <span>Favorites</span>
          <span>Recents</span>
          <span>Applications</span>
          <span>Desktop</span>
          <span>Downloads</span>
        </div>
        <div className="finder-content">
          <div className="finder-hero">
            <div>
              <p className="eyebrow">Liquid Folder</p>
              <h2>macOS glass language, pushed further.</h2>
            </div>
            <button type="button">Open Collection</button>
          </div>
          <div className="finder-grid">
            <div className="mini-card">
              <strong>Wallpapers</strong>
              <span>12 ambient scenes</span>
            </div>
            <div className="mini-card">
              <strong>Widgets</strong>
              <span>7 live glass components</span>
            </div>
            <div className="mini-card">
              <strong>Icons</strong>
              <span>Rounded prism set</span>
            </div>
          </div>
        </div>
      </>
    )
  },
  projects: {
    title: "Projects",
    kind: "stack",
    classes: "window-card window-stack",
    width: 520,
    body: (
      <div className="stack-panel">
        <p className="eyebrow">Recent Builds</p>
        <h3>Desktop concepts in progress.</h3>
        <div className="stack-list">
          <div className="mini-card">
            <strong>LiquidOS Shell</strong>
            <span>Dock motion and translucent chrome</span>
          </div>
          <div className="mini-card">
            <strong>Widget Pass</strong>
            <span>Weather, music and control center ideas</span>
          </div>
          <div className="mini-card">
            <strong>Window System</strong>
            <span>Focus states, snap groups and depth</span>
          </div>
        </div>
      </div>
    )
  },
  "glass-lab": {
    title: "Glass Lab",
    kind: "stack",
    classes: "window-card window-stack-secondary",
    width: 520,
    body: (
      <div className="stack-panel">
        <p className="eyebrow">Material Study</p>
        <h3>Icon sheen, blur density, and hover glow.</h3>
        <div className="finder-grid">
          <div className="mini-card">
            <strong>Prism Blue</strong>
            <span>Cool tint for Finder and Safari</span>
          </div>
          <div className="mini-card">
            <strong>Rose Light</strong>
            <span>Warm highlight for alerts and Mail</span>
          </div>
          <div className="mini-card">
            <strong>Mint Air</strong>
            <span>Soft green for tools and utility views</span>
          </div>
        </div>
      </div>
    )
  },
  safari: {
    title: "Safari",
    kind: "browser",
    classes: "window-card window-browser",
    width: 560,
    body: (
      <div className="browser-panel">
        <div className="browser-toolbar">
          <span className="browser-pill">apple.com/design</span>
          <span className="browser-pill">New Tab</span>
        </div>
        <div className="browser-canvas">
          <p className="eyebrow">Featured</p>
          <h3>Liquid glass interface study for desktop.</h3>
          <p className="supporting">
            A softer, brighter macOS-inspired scene with layered blur and animated dock behavior.
          </p>
        </div>
      </div>
    )
  },
  mail: {
    title: "Mail",
    kind: "stack",
    classes: "window-card window-stack-secondary",
    width: 520,
    body: (
      <div className="stack-panel">
        <p className="eyebrow">Inbox</p>
        <h3>3 new design notes waiting.</h3>
        <div className="stack-list">
          <div className="mini-card">
            <strong>Review</strong>
            <span>Dock hover looks ready for QA</span>
          </div>
          <div className="mini-card">
            <strong>Feedback</strong>
            <span>Try brighter icon reflections on desktop</span>
          </div>
        </div>
      </div>
    )
  },
  calendar: {
    title: "Calendar",
    kind: "stack",
    classes: "window-card window-stack",
    width: 520,
    body: (
      <div className="stack-panel">
        <p className="eyebrow">Today</p>
        <h3>Saturday, 23:37</h3>
        <div className="stack-list">
          <div className="mini-card">
            <strong>10:00</strong>
            <span>Ship liquid glass desktop polish</span>
          </div>
          <div className="mini-card">
            <strong>14:30</strong>
            <span>Refine hover motion and focus states</span>
          </div>
        </div>
      </div>
    )
  },
  music: {
    title: "Now Playing",
    kind: "music",
    classes: "window-card window-music",
    width: 290,
    body: (
      <div className="music-panel">
        <div className="album-orb" />
        <p className="eyebrow">Playing Next</p>
        <h3>Glass Harbor</h3>
        <p className="supporting">by Northern Tides</p>
        <div className="progress-rail">
          <span />
        </div>
        <div className="music-controls">
          <button type="button">⏮</button>
          <button type="button" className="play-button">▶</button>
          <button type="button">⏭</button>
        </div>
      </div>
    )
  },
  notes: {
    title: "Notes",
    kind: "stack",
    classes: "window-card window-stack-secondary",
    width: 520,
    body: (
      <div className="stack-panel">
        <p className="eyebrow">Pinned</p>
        <h3>Make every icon feel tappable and alive.</h3>
        <div className="stack-list">
          <div className="mini-card">
            <strong>Dock</strong>
            <span>Magnify on hover, open on click</span>
          </div>
          <div className="mini-card">
            <strong>Desktop</strong>
            <span>Selection should reveal the matching window</span>
          </div>
        </div>
      </div>
    )
  },
  settings: {
    title: "Settings",
    kind: "stack",
    classes: "window-card window-stack",
    width: 560
  }
};

const menuItems = ["Finder", "File", "Edit", "View", "Go", "Window", "Help"];
const defaultOpenWindows = ["finder", "music"];

function createCenteredLayout(windowId, count) {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 900;
  const windowWidth = Math.min(windowCatalog[windowId]?.width ?? 520, viewportWidth - 80);
  const desktopTop = viewportWidth > 720 ? 86 : 112;
  const desktopBottom = 130;
  const usableHeight = viewportHeight - desktopTop - desktopBottom;
  const offset = Math.min(count * 28, 84);

  return {
    width: windowWidth,
    left: Math.max((viewportWidth - windowWidth) / 2 + offset - 28, 24),
    top: Math.max(desktopTop + usableHeight / 2 - 170 + offset, desktopTop + 16)
  };
}

export default function WindowLayer() {
  const [openWindowIds, setOpenWindowIds] = useState(defaultOpenWindows);
  const [windowLayouts, setWindowLayouts] = useState({
    finder: createCenteredLayout("finder", 0),
    music: createCenteredLayout("music", 1)
  });
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [wallpaperTheme, setWallpaperTheme] = useState("aurora");
  const [soundProfile, setSoundProfile] = useState("glass");
  const [contextMenu, setContextMenu] = useState({
    open: false,
    x: 0,
    y: 0
  });

  const openWindow = (windowId) => {
    if (!windowCatalog[windowId]) return;

    setOpenWindowIds((current) => {
      const next = current.includes(windowId)
        ? [...current.filter((id) => id !== windowId), windowId]
        : [...current, windowId];

      setWindowLayouts((layouts) => (
        layouts[windowId]
          ? layouts
          : { ...layouts, [windowId]: createCenteredLayout(windowId, current.length) }
      ));

      return next;
    });

    setSelectedIconId(windowId);
    setContextMenu({ open: false, x: 0, y: 0 });
  };

  const closeWindow = (windowId) => {
    setOpenWindowIds((current) => current.filter((id) => id !== windowId));
    setSelectedIconId((current) => (current === windowId ? null : current));
  };

  const bringToFront = (windowId) => {
    setOpenWindowIds((current) => [
      ...current.filter((id) => id !== windowId),
      windowId
    ]);
  };

  const openDesktopMenu = (event) => {
    event.preventDefault();
    setSelectedIconId(null);
    setContextMenu({
      open: true,
      x: event.clientX,
      y: event.clientY
    });
  };

  const closeDesktopMenu = () => {
    setContextMenu({ open: false, x: 0, y: 0 });
  };

  const settingsBody = (
    <div className="stack-panel">
      <p className="eyebrow">Appearance</p>
      <h3>Liquid Glass Theme</h3>
      <div className="finder-grid">
        <div className="mini-card">
          <strong>Wallpaper</strong>
          <span>{wallpaperThemes[wallpaperTheme].label}</span>
        </div>
        <div className="mini-card">
          <strong>Sound</strong>
          <span>{soundProfiles[soundProfile]}</span>
        </div>
        <div className="mini-card">
          <strong>Desktop</strong>
          <span>Context menu enabled</span>
        </div>
      </div>
    </div>
  );

  const visibleWindows = useMemo(
    () =>
      openWindowIds
        .map((id) => ({
          id,
          ...windowCatalog[id],
          body: id === "settings" ? settingsBody : windowCatalog[id].body
        }))
        .filter((item) => item.title),
    [openWindowIds, settingsBody]
  );

  const contextActions = [
    {
      label: "Open Finder",
      description: "Browse files and folders",
      action: () => openWindow("finder")
    },
    {
      label: "Open Settings",
      description: "Theme, sound, and desktop options",
      action: () => openWindow("settings")
    },
    {
      label: "Wallpaper: Aurora",
      description: "Bright blue glass backdrop",
      action: () => setWallpaperTheme("aurora")
    },
    {
      label: "Wallpaper: Blush",
      description: "Soft rose desktop mood",
      action: () => setWallpaperTheme("blush")
    },
    {
      label: "Wallpaper: Midnight",
      description: "Darker focused workspace",
      action: () => setWallpaperTheme("midnight")
    },
    {
      label: "Sound: Glass Chime",
      description: "Light notification style",
      action: () => setSoundProfile("glass")
    },
    {
      label: "Sound: Ambient Soft",
      description: "Warmer softer alerts",
      action: () => setSoundProfile("ambient")
    },
    {
      label: "Sound: Studio Clear",
      description: "Sharper desktop sound profile",
      action: () => setSoundProfile("studio")
    }
  ];

  return (
    <main
      className={`desktop-shell ${wallpaperThemes[wallpaperTheme].shellClass}`}
      onClick={closeDesktopMenu}
      onContextMenu={openDesktopMenu}
    >
      <div className="wallpaper-haze wallpaper-haze-a" />
      <div className="wallpaper-haze wallpaper-haze-b" />
      <div className="wallpaper-grid" />

      <header className="top-bar glass-panel">
        <div className="menu-cluster">
          <span className="apple-mark">◉</span>
          {menuItems.map((item) => (
            <span key={item} className={item === "Finder" ? "menu-strong" : ""}>
              {item}
            </span>
          ))}
        </div>
        <div className="status-cluster">
          <span>{wallpaperThemes[wallpaperTheme].label}</span>
          <span>{soundProfiles[soundProfile]}</span>
          <span>86%</span>
          <span>Sat 23:37</span>
        </div>
      </header>

      <section className="desktop-icons">
        {desktopIcons.map((icon) => (
          <button
            key={icon.label}
            type="button"
            className={`desktop-icon accent-${icon.accent}${openWindowIds.includes(icon.id) ? " is-open" : ""}${selectedIconId === icon.id ? " is-selected" : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIconId(icon.id);
              closeDesktopMenu();
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
              openWindow(icon.id);
            }}
          >
            <span className="icon-glyph">{icon.emoji}</span>
            <span className="icon-label">{icon.label}</span>
          </button>
        ))}
      </section>

      <section className="window-stage" aria-label="Desktop windows">
        {visibleWindows.map((window, index) => (
          <article
            key={window.id}
            className={`${window.classes}${index === visibleWindows.length - 1 ? " is-front" : ""}`}
            style={{
              zIndex: index + 10,
              left: windowLayouts[window.id]?.left,
              top: windowLayouts[window.id]?.top,
              width: windowLayouts[window.id]?.width
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
              bringToFront(window.id);
              closeDesktopMenu();
            }}
          >
            <div className="window-chrome">
              <div className="traffic-lights" aria-hidden="true">
                <button
                  type="button"
                  className="light red light-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeWindow(window.id);
                  }}
                  aria-label={`Close ${window.title}`}
                />
                <span className="light yellow" />
                <span className="light green" />
              </div>
              <span className="window-title">{window.title}</span>
            </div>
            <div className={`window-body window-body-${window.kind}`}>{window.body}</div>
          </article>
        ))}
      </section>

      {contextMenu.open ? (
        <div
          className="desktop-menu glass-panel"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          {contextActions.map((item) => (
            <button
              key={item.label}
              type="button"
              className="desktop-menu-item"
              onClick={() => {
                item.action();
                closeDesktopMenu();
              }}
            >
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </button>
          ))}
        </div>
      ) : null}

      <Spotlight />
      <Dock
        openWindow={openWindow}
        openWindowIds={openWindowIds}
      />
    </main>
  );
}
