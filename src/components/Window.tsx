import { motion } from "framer-motion";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  width?: number;
  height?: number;
}

function Window({ title, children, onClose, width = 600, height = 400 }: WindowProps) {
  return (
    <motion.div
      className="app-window"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      style={{ width, height }}
    >
      <div className="window-header">
        <div className="window-title">{title}</div>
        <button className="window-close" onClick={onClose}>✕</button>
      </div>
      <div className="window-content">
        {children}
      </div>
    </motion.div>
  );
}

export default Window;