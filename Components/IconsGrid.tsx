import { motion, useMotionValue } from "framer-motion";
import { useState } from "react";
import "./IconsGrid.css";

const apps = [
  // Page 1 - Core Apps
  { icon: "📱", name: "Neural Link" },
  { icon: "💬", name: "HoloChat" },
  { icon: "📧", name: "Quantum Mail" },
  { icon: "🌐", name: "MetaWeb" },
  { icon: "📷", name: "Photon Cam" },
  { icon: "📸", name: "Memory Vault" },
  { icon: "🎵", name: "Sonic Waves" },
  { icon: "📺", name: "HoloVision" },
  { icon: "🕒", name: "Chrono Sync" },
  { icon: "🌤️", name: "Astro Weather" },
  { icon: "🗺️", name: "Quantum Map" },
  { icon: "📝", name: "Neuro Notes" },
  { icon: "⚙️", name: "System Core" },
  { icon: "📱", name: "App Nexus" },
  { icon: "💼", name: "Data Wallet" },
  { icon: "🎮", name: "VR Games" },
  { icon: "📚", name: "Knowledge Base" },
  { icon: "🏃‍♂️", name: "Bio Metrics" },
  { icon: "🛒", name: "Quantum Store" },
  { icon: "📅", name: "Time Matrix" },
  // Page 2 - Advanced Tech
  { icon: "🤖", name: "AI Assistant" },
  { icon: "🚀", name: "Space Comm" },
  { icon: "⚡", name: "Energy Core" },
  { icon: "🔬", name: "Lab Access" },
  { icon: "🧬", name: "Gene Lab" },
  { icon: "🌌", name: "Stellar Nav" },
  { icon: "💎", name: "Crypto Vault" },
  { icon: "🔮", name: "Oracle" },
  { icon: "🛡️", name: "Cyber Shield" },
  { icon: "⚛️", name: "Particle Sim" },
  { icon: "🌐", name: "Web3 Hub" },
  { icon: "🎯", name: "Target Lock" },
  { icon: "🔥", name: "Fusion Core" },
  { icon: "💫", name: "Plasma Drive" },
  { icon: "🌟", name: "Stellar Maps" },
  { icon: "⚡", name: "Neural Boost" },
  { icon: "🌀", name: "Vortex Link" },
  { icon: "💠", name: "Quantum Key" },
  { icon: "🌈", name: "Prism View" },
  { icon: "✨", name: "Aura Scanner" },
  // Page 3 - Future Tech
  { icon: "🚁", name: "Drone Control" },
  { icon: "🤖", name: "Bot Network" },
  { icon: "🛰️", name: "Satellite Link" },
  { icon: "🔭", name: "Telescope" },
  { icon: "🧪", name: "Chem Lab" },
  { icon: "⚗️", name: "Alchemy" },
  { icon: "🧲", name: "Magnetics" },
  { icon: "🌡️", name: "Thermo Scan" },
  { icon: "📡", name: "Signal Boost" },
  { icon: "🔋", name: "Power Cell" },
  { icon: "💻", name: "Holo Desk" },
  { icon: "🎨", name: "Design Matrix" },
  { icon: "🎭", name: "Avatar Lab" },
  { icon: "🎪", name: "VR Circus" },
  { icon: "🏰", name: "Castle Builder" },
  { icon: "🗡️", name: "Combat Sim" },
  { icon: "🏹", name: "Archer VR" },
  { icon: "🎸", name: "Music Synth" },
  { icon: "🎹", name: "Piano Holo" },
  { icon: "🥁", name: "Drum Matrix" },
];

const APPS_PER_PAGE = 20;
const totalPages = Math.ceil(apps.length / APPS_PER_PAGE);

function IconsGrid() {
  const [currentPage, setCurrentPage] = useState(0);
  const x = useMotionValue(0);

  const paginate = (newDirection: number) => {
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + newDirection;
      if (nextPage < 0) return 0;
      if (nextPage >= totalPages) return totalPages - 1;
      return nextPage;
    });
  };

  const renderPage = (pageIndex: number) => {
    const startIndex = pageIndex * APPS_PER_PAGE;
    const pageApps = apps.slice(startIndex, startIndex + APPS_PER_PAGE);

    return (
      <motion.div
        key={pageIndex}
        className="page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {pageApps.map((app, index) => (
          <motion.div
            key={`${pageIndex}-${index}`}
            className="app-icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="icon">{app.icon}</div>
            <div className="app-name">{app.name}</div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="icons-container">
      <motion.div
        className="pages-wrapper"
        drag="x"
        dragConstraints={{ left: -(totalPages - 1) * 100, right: 0 }}
        style={{ x }}
        onDragEnd={(_, info) => {
          const offset = info.offset.x;
          if (offset > 50) {
            paginate(-1);
          } else if (offset < -50) {
            paginate(1);
          }
        }}
      >
        {Array.from({ length: totalPages }, (_, i) => renderPage(i))}
      </motion.div>

      <div className="page-indicators">
        {Array.from({ length: totalPages }, (_, i) => (
          <motion.div
            key={i}
            className={`indicator ${i === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(i)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
}

export default IconsGrid;
