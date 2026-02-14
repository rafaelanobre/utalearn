import { useEffect, useRef } from "react";
import type { Segment } from "../types";
import type { SyncState } from "../hooks/useSyncEngine";

interface LyricsDisplayProps {
  segments: Segment[];
  syncState: SyncState;
  showJapanese: boolean;
}

export function LyricsDisplay({
  segments,
  syncState,
  showJapanese,
}: LyricsDisplayProps) {
  const activeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [syncState.activeSegmentId, syncState.activeWordIndex]);

  return (
    <div className="lyrics">
      {segments.map((seg) => (
        <p key={seg.id} className="segment">
          {seg.words.map((word, i) => {
            const isActive =
              seg.id === syncState.activeSegmentId &&
              i === syncState.activeWordIndex;
            const romaji =
              i === 0 ? word.romaji : word.romaji.toLowerCase();
            return (
              <span key={i}>
                {i > 0 && " "}
                <span
                  ref={isActive ? activeRef : undefined}
                  className={isActive ? "word active" : "word"}
                >
                  {showJapanese ? (
                    <ruby>
                      {word.text}
                      <rp>(</rp>
                      <rt>{romaji}</rt>
                      <rp>)</rp>
                    </ruby>
                  ) : (
                    romaji
                  )}
                </span>
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
