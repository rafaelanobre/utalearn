import { useState, useEffect } from "react";
import type { SongData } from "../types";

export function useSongData() {
  const [songData, setSongData] = useState<SongData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/poc/song")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setSongData)
      .catch((err) => setError(err.message));
  }, []);

  return { songData, error };
}
