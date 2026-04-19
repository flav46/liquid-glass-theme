import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import "./dock.css";

function Dock() {
  const icons = ["📞", "💬", "🌐", "🎵"];
  const [mouseX, setMouseX] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dockRef.current && isHovering) {
        const rect = dockRef.current.getBoundingClientRect();
        setMouseX(e.clientX - rect.left);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    if (dockRef.current) {
      dockRef.current.addEventListener('mousemove', handleMouseMove);
      dockRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (dockRef.current) {
        dockRef.current.removeEventListener('mousemove', handleMouseMove);
        dockRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isHovering]);

  const calculateScale = (index: number) => {
    if (!isHovering || !dockRef.current) return 1;

    const iconElement = iconRefs.current[index];
    if (!iconElement) return 1;

    const dockRect = dockRef.current.getBoundingClientRect();
    const iconRect = iconElement.getBoundingClientRect();
    const iconCenter = iconRect.left + iconRect.width / 2 - dockRect.left;
    const distance = Math.abs(mouseX - iconCenter);
    const maxDistance = 80; // Adjust for sensitivity

    if (distance > maxDistance) return 1;

    // Smooth magnification curve
    const magnification = 1.6; // Max scale
    const scale = 1 + (magnification - 1) * (1 - distance / maxDistance);

    return Math.max(1, scale);
  };

  return (
    <div
      className="dock"
      ref={dockRef}
      onMouseEnter={() => setIsHovering(true)}
    >
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          ref={(el) => (iconRefs.current[index] = el)}
          className="icon"
          animate={{ scale: calculateScale(index) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
}

export default Dock;
