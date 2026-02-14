import { useState, useEffect, useRef, useMemo } from "react";
import type { SongData } from "../types";

interface FlatWord {
  segmentId: number;
  wordIndex: number;
  start: number;
  end: number;
}

export interface SyncState {
  activeSegmentId: number | null;
  activeWordIndex: number | null;
}

export function useSyncEngine(
  songData: SongData | null,
  audioRef: React.RefObject<HTMLAudioElement | null>,
) {
  const [syncState, setSyncState] = useState<SyncState>({
    activeSegmentId: null,
    activeWordIndex: null,
  });
  const rafRef = useRef<number>(0);
  const lastSegRef = useRef<number | null>(null);
  const lastWordRef = useRef<number | null>(null);

  const flatWords = useMemo<FlatWord[]>(() => {
    if (!songData) return [];
    const words: FlatWord[] = [];
    for (const seg of songData.segments) {
      for (let i = 0; i < seg.words.length; i++) {
        const w = seg.words[i];
        words.push({
          segmentId: seg.id,
          wordIndex: i,
          start: w.start,
          end: w.end,
        });
      }
    }
    return words;
  }, [songData]);

  useEffect(() => {
    if (!flatWords.length) return;

    function tick() {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        const time = audio.currentTime;

        // Binary search: find rightmost word where start <= time
        let lo = 0;
        let hi = flatWords.length - 1;
        let found = -1;
        while (lo <= hi) {
          const mid = (lo + hi) >>> 1;
          if (flatWords[mid].start <= time) {
            found = mid;
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }

        let segId: number | null = null;
        let wordIdx: number | null = null;

        if (found >= 0 && time < flatWords[found].end) {
          segId = flatWords[found].segmentId;
          wordIdx = flatWords[found].wordIndex;
        }

        // Only update state when active word changes
        if (segId !== lastSegRef.current || wordIdx !== lastWordRef.current) {
          lastSegRef.current = segId;
          lastWordRef.current = wordIdx;
          setSyncState({ activeSegmentId: segId, activeWordIndex: wordIdx });
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [flatWords, audioRef]);

  return syncState;
}
