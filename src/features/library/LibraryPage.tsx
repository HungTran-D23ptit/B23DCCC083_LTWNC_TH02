import React, { useState, useMemo, useCallback, useContext } from 'react';
import { FixedSizeList } from 'react-window';
import { SONGS, GENRES } from '../../data/songs';
import type { Song, Genre, Playlist } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { SongRow, type SongRowData } from './SongRow';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { PlaylistStateContext, PlaylistDispatchContext } from '../playlists/PlaylistContext';

export interface LibraryPageProps {
  selectedPlaylistId?: string;
  onSelectPlaylist?: (id: string) => void;
  onAddSongToPlaylist?: (playlistId: string, songId: string) => void;
  playlists?: Playlist[];
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  selectedPlaylistId: propSelectedPlaylistId,
  onSelectPlaylist: propOnSelectPlaylist,
  onAddSongToPlaylist: propOnAddSongToPlaylist,
  playlists: propPlaylists,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<string>('default');

  const contextPlaylists = useContext(PlaylistStateContext) || [];
  const contextDispatch = useContext(PlaylistDispatchContext);

  const playlists = propPlaylists ?? contextPlaylists;

  const [localSelectedPlaylistId, setLocalSelectedPlaylistId] = useState<string>(() => {
    return playlists.length > 0 ? playlists[0].id : '';
  });

  const selectedPlaylistId = propSelectedPlaylistId !== undefined
    ? propSelectedPlaylistId
    : localSelectedPlaylistId;

  const handleSelectPlaylist = (id: string) => {
    if (propOnSelectPlaylist) {
      propOnSelectPlaylist(id);
    } else {
      setLocalSelectedPlaylistId(id);
    }
  };

  const debouncedQuery = useDebounce(searchQuery, 300);

  const handleQueryShift = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredSongs = useMemo(() => {
    let result = SONGS;

    if (debouncedQuery.trim() !== '') {
      const q = debouncedQuery.trim().toLowerCase();
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(q) ||
          song.artist.toLowerCase().includes(q)
      );
    }

    if (selectedGenre !== 'Tất cả') {
      result = result.filter((song) => song.genre === selectedGenre);
    }

    if (sortBy === 'title') {
      return [...result].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    }

    if (sortBy === 'duration') {
      return [...result].sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [debouncedQuery, selectedGenre, sortBy]);

  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const handlePlay = useCallback(
    (_song: Song, index: number) => {
      playQueue(filteredSongs, index);
    },
    [playQueue, filteredSongs]
  );

  const handleToggleFavorite = useCallback(
    (id: string) => {
      toggleFavorite(id);
    },
    [toggleFavorite]
  );

  const isFavoriteCheck = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  const handleAddToQueue = useCallback(
    (song: Song) => {
      addToQueue(song);
    },
    [addToQueue]
  );

  const handleAddToPlaylist = useCallback(
    (song: Song) => {
      if (propOnAddSongToPlaylist && selectedPlaylistId) {
        propOnAddSongToPlaylist(selectedPlaylistId, song.id);
      } else if (contextDispatch && selectedPlaylistId) {
        contextDispatch({
          type: 'addSong',
          playlistId: selectedPlaylistId,
          songId: song.id,
        });
      }
    },
    [propOnAddSongToPlaylist, contextDispatch, selectedPlaylistId]
  );

  const hasValidPlaylist = Boolean(
    selectedPlaylistId && playlists.some((p) => p.id === selectedPlaylistId)
  );

  const itemData = useMemo<SongRowData>(
    () => ({
      songs: filteredSongs,
      onPlay: handlePlay,
      onToggleFavorite: handleToggleFavorite,
      isFavorite: isFavoriteCheck,
      onAddToQueue: handleAddToQueue,
      onAddToPlaylist: handleAddToPlaylist,
      hasPlaylists: hasValidPlaylist,
    }),
    [
      filteredSongs,
      handlePlay,
      handleToggleFavorite,
      isFavoriteCheck,
      handleAddToQueue,
      handleAddToPlaylist,
      hasValidPlaylist,
    ]
  );

  const getItemKey = useCallback(
    (index: number, data: SongRowData) => data.songs[index].id,
    []
  );

  return (
    <div className="library-page" data-testid="library-page">
      <div className="library-header">
        <h1 className="page-title">Thư viện bài hát</h1>
        <p className="page-subtitle">Khám phá hơn 10.000 bài hát tuyển chọn</p>
      </div>

      <div className="controls-bar">
        <div className="search-box">
          <label htmlFor="search-input" className="control-label">
            Tìm kiếm
          </label>
          <input
            id="search-input"
            type="text"
            className="input-search"
            placeholder="Tìm theo tên bài hoặc ca sĩ..."
            value={searchQuery}
            onChange={handleQueryShift}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="genre-select" className="control-label">
            Thể loại
          </label>
          <select
            id="genre-select"
            className="select-input"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="Tất cả">Tất cả</option>
            {GENRES.map((g: Genre) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select" className="control-label">
            Sắp xếp
          </label>
          <select
            id="sort-select"
            className="select-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Mặc định</option>
            <option value="title">Tên A–Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </div>

        <div className="filter-group playlist-select-group">
          <label htmlFor="playlist-select" className="control-label">
            Playlist đang chọn
          </label>
          <select
            id="playlist-select"
            className="select-input"
            value={selectedPlaylistId}
            onChange={(e) => handleSelectPlaylist(e.target.value)}
            disabled={playlists.length === 0}
          >
            {playlists.length === 0 ? (
              <option value="">Chưa có playlist</option>
            ) : (
              <>
                <option value="">-- Chọn playlist --</option>
                {playlists.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      <div className="results-status" data-testid="results-status">
        {filteredSongs.length > 0 ? (
          <span className="status-found">
            Tìm thấy {filteredSongs.length} bài hát
          </span>
        ) : (
          <span className="status-empty">Không tìm thấy bài hát nào</span>
        )}
      </div>

      {filteredSongs.length > 0 ? (
        <div className="virtualized-list-container">
          <div className="list-table-header">
            <span className="col-index">#</span>
            <span className="col-info">Bài hát &amp; Nghệ sĩ</span>
            <span className="col-genre">Thể loại</span>
            <span className="col-duration">Thời lượng</span>
            <span className="col-actions">Thao tác</span>
          </div>
          <FixedSizeList
            height={560}
            itemCount={filteredSongs.length}
            itemSize={56}
            width="100%"
            itemData={itemData}
            itemKey={getItemKey}
            className="virtual-song-list"
          >
            {SongRow as unknown as React.ComponentType<import('react-window').ListChildComponentProps<SongRowData>>}
          </FixedSizeList>
        </div>
      ) : (
        <div className="empty-state">
          <p>Không tìm thấy bài hát nào phù hợp với bộ lọc.</p>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
