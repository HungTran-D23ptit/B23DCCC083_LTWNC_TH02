import type { Playlist } from '../../types';

export type PlaylistAction =
  | { type: 'create'; name: string }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addSong'; playlistId: string; songId: string }
  | { type: 'removeSong'; playlistId: string; songId: string };

export function playlistReducer(state: Playlist[], action: PlaylistAction): Playlist[] {
  switch (action.type) {
    case 'create': {
      const trimmed = action.name.trim();
      if (!trimmed) return state;
      const newPlaylist: Playlist = {
        id: `pl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: trimmed,
        songIds: [],
      };
      return [...state, newPlaylist];
    }
    case 'rename': {
      const trimmed = action.name.trim();
      if (!trimmed) return state;
      return state.map((pl) =>
        pl.id === action.id ? { ...pl, name: trimmed } : pl
      );
    }
    case 'remove': {
      const exists = state.some((pl) => pl.id === action.id);
      if (!exists) return state;
      return state.filter((pl) => pl.id !== action.id);
    }
    case 'addSong': {
      return state.map((pl) => {
        if (pl.id !== action.playlistId) return pl;
        if (pl.songIds.includes(action.songId)) return pl;
        return { ...pl, songIds: [...pl.songIds, action.songId] };
      });
    }
    case 'removeSong': {
      return state.map((pl) => {
        if (pl.id !== action.playlistId) return pl;
        return {
          ...pl,
          songIds: pl.songIds.filter((id) => id !== action.songId),
        };
      });
    }
    default:
      return state;
  }
}
