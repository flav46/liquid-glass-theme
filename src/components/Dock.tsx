import { motion } from "framer-motion";
import "./Desktop.css";

interface App {
  id: string;
  name: string;
  icon: string;
}

interface DockProps {
  APPS: App[];
  onAppClick: (appId: string) => void;
}

function Dock({ APPS, onAppClick }: DockProps) {
  return (
    <nav className="dock">
      <motion.button
        className="dock-launcher"
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open apps"
      >
        ◌
      </motion.button>

      <div className="dock-divider" />

      {APPS.map((app) => (
        <motion.button
          key={app.id}
          className="dock-item"
          whileHover={{ scale: 1.1, y: -8 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAppClick(app.id)}
          title={app.name}
        >
          {app.icon}
        </motion.button>
      ))}
    </nav>
  );
}

export default Dock;