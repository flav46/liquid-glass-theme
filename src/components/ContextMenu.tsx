import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContextMenuItem {
  label: string;
  icon?: string;
  action?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (rect.right > viewportWidth) {
        menuRef.current.style.left = `${position.x - rect.width}px`;
      }
      if (rect.bottom > viewportHeight) {
        menuRef.current.style.top = `${position.y - rect.height}px`;
      }
    }
  }, [position]);

  return (
    <motion.div
      ref={menuRef}
      className="context-menu"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ left: position.x, top: position.y }}
    >
      {items.map((item, idx) => (
        item.divider ? (
          <div key={idx} className="context-menu-divider" />
        ) : (
          <button
            key={idx}
            className={`context-menu-item ${item.disabled ? "disabled" : ""}`}
            onClick={() => { item.action?.(); onClose(); }}
            disabled={item.disabled}
          >
            {item.icon && <span className="context-menu-icon">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        )
      ))}
    </motion.div>
  );
}

interface ContextMenuProviderProps {
  children: ReactNode;
}

export function ContextMenuProvider({ children }: ContextMenuProviderProps) {
  const [menu, setMenu] = useState<{
    items: ContextMenuItem[];
    position: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      
      const items: ContextMenuItem[] = [
        { label: "New Folder", icon: "📁", action: () => console.log("New Folder") },
        { label: "New File", icon: "📄", action: () => console.log("New File") },
        { divider: true, label: "" },
        { label: "Paste", icon: "📋", action: () => console.log("Paste") },
        { label: "Refresh", icon: "🔄", action: () => console.log("Refresh") },
        { divider: true, label: "" },
        { label: "Settings", icon: "⚙️", action: () => console.log("Settings") },
      ];
      
      setMenu({ items, position: { x: e.clientX, y: e.clientY } });
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <>
      {children}
      <AnimatePresence>
        {menu && (
          <ContextMenu
            items={menu.items}
            position={menu.position}
            onClose={() => setMenu(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}