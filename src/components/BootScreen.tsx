import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./BootScreen.css";

const installSteps = [
  { text: "Preparing partitions...", duration: 800 },
  { text: "Copying system files...", duration: 1200 },
  { text: "Installing kernel modules...", duration: 1000 },
  { text: "Configuring display server...", duration: 900 },
  { text: "Applying liquid glass effects...", duration: 1100 },
  { text: "Initializing desktop environment...", duration: 800 },
  { text: "Starting services...", duration: 600 },
];

interface BootScreenProps {
  onComplete: () => void;
}

function BootScreen({ onComplete }: BootScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; scale: number }[]>([]);
  const wallpapers = ["aurora", "ocean", "sunset", "forest", "rainbow", "space", "mint", "cotton-candy"];
  const [wallpaperTheme] = useState(() => wallpapers[Math.floor(Math.random() * wallpapers.length)]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.3 + Math.random() * 0.7,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (currentStep >= installSteps.length) {
      setIsComplete(true);
      setTimeout(() => {
        setShowDesktop(true);
        setTimeout(onComplete, 800);
      }, 600);
      return;
    }

    const step = installSteps[currentStep];
    const increment = 100 / installSteps.length;
    let stepProgress = 0;
    const interval = step.duration / 30;

    const timer = setInterval(() => {
      stepProgress += increment / 30;
      setProgress((currentStep * increment) + stepProgress);
      
      if (stepProgress >= increment) {
        clearInterval(timer);
        setCurrentStep(prev => prev + 1);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentStep, onComplete]);

  const getPhase = () => {
    if (currentStep < 2) return "partition";
    if (currentStep < 4) return "kernel";
    if (currentStep < 6) return "desktop";
    return "services";
  };

  return (
    <AnimatePresence>
      {!showDesktop && (
        <motion.div
          className="boot-screen-container"
          initial={{ opacity: 1 }}
          exit={isComplete ? { opacity: 0, scale: 1.05 } : undefined}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className={`boot-wallpaper boot-wallpaper-${wallpaperTheme}`}>
            <motion.div 
              className="boot-aurora boot-aurora-1"
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="boot-aurora boot-aurora-2"
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [1.1, 1, 1.1],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="boot-noise" />
            
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="boot-particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  transform: `scale(${particle.scale})`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {!isComplete ? (
            <motion.div
              className="boot-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="boot-logo-wrapper"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <div className="boot-logo">
                  <motion.div
                    className="boot-logo-inner"
                    animate={{ 
                      background: [
                        "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(138,212,255,0.6))",
                        "linear-gradient(145deg, rgba(255,255,255,0.6), rgba(138,212,255,0.9))",
                        "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(138,212,255,0.6))",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="boot-logo-text">LG</span>
                </div>
              </motion.div>

              <motion.h1
                className="boot-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Liquid Glass OS
              </motion.h1>

              <motion.div
                className="boot-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Installing {getPhase()}...
              </motion.div>

              <motion.div
                className="boot-progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="progress-track">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <div className="progress-text">{Math.round(progress)}%</div>
              </motion.div>

              <motion.div
                className="boot-current-step"
                key={currentStep}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {installSteps[currentStep]?.text || "Complete!"}
              </motion.div>

              <motion.div
                className="install-steps-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1 }}
              >
                {installSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`step-item ${idx < currentStep ? "completed" : ""} ${idx === currentStep ? "current" : ""}`}
                  >
                    <span className="step-dot">
                      {idx < currentStep ? "✓" : idx === currentStep ? "●" : "○"}
                    </span>
                    <span className="step-text">{step.text}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                className="boot-dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="boot-complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="boot-complete-logo"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <div className="boot-logo">
                  <div className="boot-logo-inner" />
                  <span className="boot-logo-text">LG</span>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Welcome to Liquid Glass OS
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Loading your desktop...
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BootScreen;