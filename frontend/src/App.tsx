import { useRef, useState, useEffect, useCallback } from "react";
import { useSongData } from "./hooks/useSongData";
import { useSyncEngine } from "./hooks/useSyncEngine";
import { Player } from "./components/Player";
import { LyricsDisplay } from "./components/LyricsDisplay";
import "./App.css";

const SEEK_STEP = 5;

export default function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { songData, error } = useSongData();
  const syncState = useSyncEngine(songData, audioRef);
  const [showJapanese, setShowJapanese] = useState(false);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const audio = audioRef.current;
      if (!audio) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (audio.paused) audio.play();
          else audio.pause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          audio.currentTime = Math.max(0, audio.currentTime - SEEK_STEP);
          break;
        case "ArrowRight":
          e.preventDefault();
          audio.currentTime = Math.min(
            audio.duration,
            audio.currentTime + SEEK_STEP,
          );
          break;
      }
    },
    [],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (error) return <p className="status">Error: {error}</p>;
  if (!songData) return <p className="status">Loading...</p>;

  return (
    <div className="app">
      <Player
        ref={audioRef}
        meta={songData.meta}
        showJapanese={showJapanese}
        onToggleJapanese={() => setShowJapanese((v) => !v)}
      />
      <LyricsDisplay
        segments={songData.segments}
        syncState={syncState}
        showJapanese={showJapanese}
      />
    </div>
  );
}
