import React from "react";

export default function Spotlight() {
  return (
    <section className="spotlight glass-panel" aria-label="Spotlight search">
      <div className="spotlight-search">
        <span className="spotlight-icon">⌘K</span>
        <span className="spotlight-text">Search apps, files, and glass presets</span>
      </div>
      <div className="spotlight-tags">
        <span>Liquid Glass</span>
        <span>macOS</span>
        <span>Icons</span>
      </div>
    </section>
  );
}
