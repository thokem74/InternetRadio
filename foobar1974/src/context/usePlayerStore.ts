import { create } from 'zustand';
import type { RepeatMode, Track } from '../types/models';

interface PlayerState {
  queue: Track[];
  shuffle: boolean;
  repeat: RepeatMode;
  setQueue: (queue: Track[]) => void;
  setShuffle: (shuffle: boolean) => void;
  setRepeat: (repeat: RepeatMode) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  queue: [],
  shuffle: false,
  repeat: 'off',
  setQueue: (queue) => set({ queue }),
  setShuffle: (shuffle) => set({ shuffle }),
  setRepeat: (repeat) => set({ repeat })
}));
