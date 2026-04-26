import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WindowProps {
  title: string;
  icon: string;
  children: ReactNode;
  isActive: boolean;
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  resizable?: boolean;
  onClose: () => void;
  onFocus: () => void;
}

function Window({
  title,
  icon,
  children,
  isActive,
  defaultSize = { width: 600, height: 400 },
  minSize = { width: 300, height: 200 },
  resizable = true,
  onClose,
  onFocus,
}: WindowProps) {
  const [position, setPosition] = useState({ x: 100, y: 80 });
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0, x: 0, y: 0 });

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.current.x)),
          y: Math.max(48, e.clientY - dragOffset.current.y)
        });
      } else if (isResizing) {
        const newW = Math.max(minSize.width, startSize.current.width + e.clientX - startSize.current.x);
        const newH = Math.max(minSize.height, startSize.current.height + e.clientY - startSize.current.y);
        setSize({ width: newW, height: newH });
      }
    };

    const stopDrag = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [isDragging, isResizing, minSize]);

  const startDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    onFocus();
  };

  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    startSize.current = { width: size.width, height: size.height, x: e.clientX, y: e.clientY };
    onFocus();
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={title}
        className={`os-window ${isActive ? "os-window--active" : ""}`}
        style={{ left: position.x, top: position.y, width: size.width, height: size.height }}
        onMouseDown={onFocus}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="os-window-header" onMouseDown={startDrag}>
          <div className="os-window-controls">
            <button className="os-window-btn os-window-btn--close" onClick={onClose} aria-label="Close" />
            <span className="os-window-btn os-window-btn--minimize" />
            <span className="os-window-btn os-window-btn--maximize" />
          </div>
          <div className="os-window-title">
            <span>{icon}</span>
            <span>{title}</span>
          </div>
          <div className="os-window-spacer" />
        </div>
        <div className="os-window-content">{children}</div>
        {resizable && <div className="os-window-resize" onMouseDown={startResize} />}
      </motion.div>
    </AnimatePresence>
  );
}

export default Window;