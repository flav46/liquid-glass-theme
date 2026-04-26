import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "liquid-glass-settings";

interface SettingsData {
  wallpaper: string;
  accent: string;
  glow: number;
  glass: number;
  animationLevel: number;
  sound: boolean;
  dockPosition: "bottom" | "left";
}

const defaultSettings: SettingsData = {
  wallpaper: "aurora",
  accent: "#8ad4ff",
  glow: 64,
  glass: 60,
  animationLevel: 70,
  sound: true,
  dockPosition: "bottom",
};

export function useSettings() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    setLoaded(true);
  }, []);

  const updateSettings = useCallback((patch: Partial<SettingsData>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save settings:", e);
      }
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to reset settings:", e);
    }
  }, []);

  return { settings, updateSettings, resetSettings, loaded };
}

export function playSound(type: "open" | "close" | "click" | "error") {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const frequencies: Record<string, number> = {
      open: 440,
      close: 330,
      click: 523,
      error: 220,
    };
    
    oscillator.frequency.value = frequencies[type] || 440;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (e) {
    // Audio not supported
  }
}