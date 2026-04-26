import { useState } from "react";
import Window from "./Window";

interface BrowserProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  zIndex?: number;
  onFocus?: () => void;
  isActive?: boolean;
}

function Browser({ onClose, initialPosition, zIndex, onFocus, isActive }: BrowserProps) {
  const [url, setUrl] = useState("https://www.google.com");
  const [currentUrl, setCurrentUrl] = useState("https://www.google.com");
  const [history, setHistory] = useState<string[]>(["https://www.google.com"]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigate = (newUrl: string) => {
    if (newUrl !== currentUrl) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentUrl(newUrl);
      setUrl(newUrl);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const prevUrl = history[historyIndex - 1];
      setCurrentUrl(prevUrl);
      setUrl(prevUrl);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextUrl = history[historyIndex + 1];
      setCurrentUrl(nextUrl);
      setUrl(nextUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(url);
  };

  const getPageContent = (url: string) => {
    // Mock page content based on URL
    if (url.includes("google.com")) {
      return (
        <div className="page-content google">
          <div className="google-logo">🔍 Google</div>
          <div className="search-box">
            <input type="text" placeholder="Search Google or type a URL" />
            <button>🔍</button>
          </div>
          <div className="google-apps">
            <div className="app-grid">
              <div className="app-item">📧 Gmail</div>
              <div className="app-item">📷 Photos</div>
              <div className="app-item">📊 Drive</div>
              <div className="app-item">📅 Calendar</div>
            </div>
          </div>
        </div>
      );
    } else if (url.includes("github.com")) {
      return (
        <div className="page-content github">
          <div className="github-header">
            <div className="github-logo">🐙 GitHub</div>
            <div className="github-nav">
              <input type="text" placeholder="Search or jump to..." />
              <button>Pull requests</button>
              <button>Issues</button>
              <button>Marketplace</button>
            </div>
          </div>
          <div className="github-content">
            <h2>Where the world builds software</h2>
            <p>Millions of developers and companies build, ship, and maintain their software on GitHub—the largest and most advanced development platform in the world.</p>
            <div className="repo-grid">
              <div className="repo-item">
                <h3>facebook/react</h3>
                <p>A declarative, efficient, and flexible JavaScript library for building user interfaces.</p>
                <div className="repo-stats">⭐ 200k • 🍴 40k</div>
              </div>
              <div className="repo-item">
                <h3>microsoft/vscode</h3>
                <p>Visual Studio Code</p>
                <div className="repo-stats">⭐ 150k • 🍴 25k</div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="page-content generic">
          <h1>Welcome to {url}</h1>
          <p>This is a simulated web page. In a real browser, you would see the actual content from {url}.</p>
          <div className="mock-content">
            <h2>Features</h2>
            <ul>
              <li>Responsive design</li>
              <li>Modern UI</li>
              <li>Fast loading</li>
            </ul>
          </div>
        </div>
      );
    }
  };

  return (
    <Window
      title="Browser"
      onClose={onClose}
      width={900}
      height={600}
      initialPosition={initialPosition}
      zIndex={zIndex}
      onFocus={onFocus}
      isActive={isActive}
    >
      <div className="browser">
        <div className="browser-toolbar">
          <div className="browser-controls">
            <button onClick={goBack} disabled={historyIndex === 0}>←</button>
            <button onClick={goForward} disabled={historyIndex === history.length - 1}>→</button>
            <button onClick={() => navigate(currentUrl)}>🔄</button>
          </div>

          <form onSubmit={handleSubmit} className="browser-address-bar">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL or search term"
            />
            <button type="submit">Go</button>
          </form>

          <div className="browser-bookmarks">
            <button onClick={() => navigate("https://www.google.com")}>🔍 Google</button>
            <button onClick={() => navigate("https://github.com")}>🐙 GitHub</button>
            <button onClick={() => navigate("https://stackoverflow.com")}>📚 Stack Overflow</button>
          </div>
        </div>

        <div className="browser-content">
          {getPageContent(currentUrl)}
        </div>
      </div>
    </Window>
  );
}

export default Browser;
