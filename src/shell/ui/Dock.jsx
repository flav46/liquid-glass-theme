import React, { useState } from "react";

const dockApps = [
  { id: "finder", emoji: "😊", label: "Finder", accent: "sky" },
  { id: "safari", emoji: "🧭", label: "Safari", accent: "mint" },
  { id: "mail", emoji: "✉️", label: "Mail", accent: "rose" },
  { id: "calendar", emoji: "🗓", label: "Calendar", accent: "gold" },
  { id: "music", emoji: "🎵", label: "Music", accent: "sky" },
  { id: "notes", emoji: "📝", label: "Notes", accent: "mint" },
  { id: "settings", emoji: "⚙️", label: "Settings", accent: "silver" }
];

export default function Dock({ openWindow, openWindowIds }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="dock-wrap">
      <nav className="dock glass-panel" aria-label="Application dock">
        {dockApps.map((app, index) => {
          const distance =
            hoveredIndex === null ? null : Math.abs(hoveredIndex - index);
          const hoverClass =
            distance === 0 ? " is-hovered" : distance === 1 ? " is-near" : "";

          return (
            <button
              key={app.label}
              type="button"
              className={`dock-item accent-${app.accent}${openWindowIds.includes(app.id) ? " is-active" : ""}${hoverClass}`}
              aria-label={app.label}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              onClick={() => openWindow(app.id)}
            >
              <span className="dock-icon">{app.emoji}</span>
              <span className="dock-tooltip">{app.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
