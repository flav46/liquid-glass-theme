import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Window from "./Window";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

interface MusicPlayerProps {
  onClose: () => void;
  onFocus?: () => void;
  isActive?: boolean;
}

const mockTracks: Track[] = [
  { id: "1", title: "Midnight Aurora", artist: "Liquid Glass", duration: "3:45" },
  { id: "2", title: "Ocean Dreams", artist: "Calm Waves", duration: "4:12" },
  { id: "3", title: "Forest Rain", artist: "Nature Sounds", duration: "5:30" },
  { id: "4", title: "Sunset Glow", artist: "Ambient", duration: "3:58" },
  { id: "5", title: "Space Journey", artist: "Cosmic", duration: "6:15" },
  { id: "6", title: "Mint Breeze", artist: "Fresh", duration: "3:22" },
  { id: "7", title: "Rainbow Bridge", artist: "Spectrum", duration: "4:45" },
  { id: "8", title: "Cotton Sunset", artist: "Dream", duration: "3:08" },
];

function MusicPlayer({ onClose, onFocus, isActive }: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<Track>(mockTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            playNext();
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const playNext = () => {
    const idx = mockTracks.findIndex(t => t.id === currentTrack.id);
    const nextIdx = shuffle ? Math.floor(Math.random() * mockTracks.length) : (idx + 1) % mockTracks.length;
    setCurrentTrack(mockTracks[nextIdx]);
    setProgress(0);
  };

  const playPrev = () => {
    const idx = mockTracks.findIndex(t => t.id === currentTrack.id);
    const prevIdx = idx > 0 ? idx - 1 : mockTracks.length - 1;
    setCurrentTrack(mockTracks[prevIdx]);
    setProgress(0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Window
      title="Music"
      icon="🎵"
      isActive={isActive ?? true}
      defaultSize={{ width: 420, height: 560 }}
      minSize={{ width: 350, height: 450 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="music-app">
        <div className="music-artwork">
          <motion.div
            className="album-cover"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: isPlaying ? 10 : 0, repeat: Infinity, ease: "linear" }}
          >
            🎵
          </motion.div>
        </div>

        <div className="music-info">
          <div className="music-title">{currentTrack.title}</div>
          <div className="music-artist">{currentTrack.artist}</div>
        </div>

        <div className="music-progress-container" ref={progressRef} onClick={handleProgressClick}>
          <div className="music-progress">
            <div className="music-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="music-time">
            <span>{Math.floor(progress / 100 * 238 / 60)}:{String(Math.floor((progress / 100 * 238) % 60)).padStart(2, '0')}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        <div className="music-controls">
          <button
            className={`music-btn music-btn-small ${shuffle ? "active" : ""}`}
            onClick={() => setShuffle(!shuffle)}
            title="Shuffle"
          >
            🔀
          </button>
          <button className="music-btn" onClick={playPrev}>⏮</button>
          <button className="music-btn-large" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="music-btn" onClick={playNext}>⏭</button>
          <button
            className={`music-btn music-btn-small ${repeat > 0 ? "active" : ""}`}
            onClick={() => setRepeat((repeat + 1) % 3)}
            title="Repeat"
          >
            {repeat === 2 ? "🔁" : "🔂"}
          </button>
        </div>

        <div className="music-volume">
          <span>🔈</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <span>🔊</span>
        </div>

        <div className="music-playlist">
          {mockTracks.map((track, idx) => (
            <motion.div
              key={track.id}
              className={`playlist-item ${currentTrack.id === track.id ? "active" : ""}`}
              onClick={() => { setCurrentTrack(track); setProgress(0); }}
              whileHover={{ x: 4 }}
            >
              <span className="playlist-num">{idx + 1}</span>
              <span className="playlist-title">{track.title}</span>
              <span className="playlist-duration">{track.duration}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Window>
  );
}

export default MusicPlayer;