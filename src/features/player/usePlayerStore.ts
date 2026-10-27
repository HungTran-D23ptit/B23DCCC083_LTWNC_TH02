import { create } from 'zustand';
import type { Song } from '../../types';

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number;
  playQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
}

export const initialPlayerState = {
  queue: [] as Song[],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
};

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  ...initialPlayerState,

  playQueue: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0 || startIndex < 0 || startIndex >= songs.length) {
      return;
    }
    set({
      queue: songs,
      currentIndex: startIndex,
      isPlaying: true,
      position: 0,
    });
  },

  togglePlay: () => {
    const { queue, currentIndex, isPlaying } = get();
    if (queue.length === 0 || currentIndex < 0) return;
    set({ isPlaying: !isPlaying });
  },

  next: () => {
    const { queue, currentIndex } = get();
    if (currentIndex + 1 >= queue.length) {
      set({ isPlaying: false });
    } else {
      set({
        currentIndex: currentIndex + 1,
        position: 0,
        isPlaying: true,
      });
    }
  },

  prev: () => {
    const { currentIndex, position } = get();
    if (position > 3) {
      set({ position: 0 });
    } else if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        position: 0,
        isPlaying: true,
      });
    } else {
      set({ position: 0 });
    }
  },

  addToQueue: (song: Song) => {
    const { queue } = get();
    if (queue.some((s) => s.id === song.id)) {
      return;
    }
    set({ queue: [...queue, song] });
  },

  tick: () => {
    const { queue, currentIndex, position, isPlaying } = get();
    if (!isPlaying || currentIndex < 0 || currentIndex >= queue.length) {
      return;
    }
    const currentSong = queue[currentIndex];
    if (position + 1 >= currentSong.duration) {
      get().next();
    } else {
      set({ position: position + 1 });
    }
  },
}));
