import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode, Dispatch } from 'react';
import type { Playlist } from '../../types';
import { playlistReducer, type PlaylistAction } from './playlistReducer';
import { withLogger } from './withLogger';

export const PlaylistStateContext = createContext<Playlist[] | undefined>(undefined);
export const PlaylistDispatchContext = createContext<Dispatch<PlaylistAction> | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'music-playlists';

const getInitialPlaylists = (): Playlist[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse playlists from localStorage', err);
  }
  return [];
};

export const PlaylistProvider: React.FC<{
  children: ReactNode;
  initialPlaylists?: Playlist[];
}> = ({ children, initialPlaylists }) => {
  const [playlists, dispatch] = useReducer(
    withLogger(playlistReducer),
    initialPlaylists ?? getInitialPlaylists()
  );

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(playlists));
    } catch (err) {
      console.error('Failed to write playlists to localStorage', err);
    }
  }, [playlists]);

  return (
    <PlaylistStateContext.Provider value={playlists}>
      <PlaylistDispatchContext.Provider value={dispatch}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  );
};

export function usePlaylists(): Playlist[] {
  const context = useContext(PlaylistStateContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
}

export function usePlaylistDispatch(): Dispatch<PlaylistAction> {
  const context = useContext(PlaylistDispatchContext);
  if (context === undefined) {
    throw new Error('usePlaylistDispatch must be used within a PlaylistProvider');
  }
  return context;
}
