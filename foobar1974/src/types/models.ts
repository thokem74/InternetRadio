export type RepeatMode = 'off' | 'all' | 'one';

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  durationMs: number;
}
