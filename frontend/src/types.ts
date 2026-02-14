export interface WordTiming {
  text: string;
  romaji: string;
  start: number;
  end: number;
  score: number;
}

export interface Segment {
  id: number;
  start: number;
  end: number;
  text: string;
  romaji: string;
  words: WordTiming[];
}

export interface SongMeta {
  title: string;
  artist: string;
  youtube_url: string;
  language: string;
  duration_seconds: number;
  generated_at: string;
  whisperx_model: string;
  align_model: string;
}

export interface SongData {
  meta: SongMeta;
  segments: Segment[];
}
