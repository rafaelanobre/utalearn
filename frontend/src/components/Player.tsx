import { forwardRef } from "react";
import type { SongMeta } from "../types";

interface PlayerProps {
  meta: SongMeta;
  showJapanese: boolean;
  onToggleJapanese: () => void;
}

export const Player = forwardRef<HTMLAudioElement, PlayerProps>(
  ({ meta, showJapanese, onToggleJapanese }, ref) => (
    <div className="player">
      <h1>{meta.title}</h1>
      <p className="artist">{meta.artist}</p>
      <audio
        ref={ref}
        controls
        src="/poc/audio"
        onPlay={(e) => e.currentTarget.blur()}
        onPause={(e) => e.currentTarget.blur()}
      />
      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={showJapanese}
            onChange={onToggleJapanese}
          />{" "}
          Show Japanese
        </label>
        <span className="shortcuts">
          Space: play/pause &middot; Arrows: seek &plusmn;5s
        </span>
      </div>
    </div>
  ),
);
