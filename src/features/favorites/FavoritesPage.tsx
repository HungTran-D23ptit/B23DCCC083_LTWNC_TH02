import React, { useMemo, useCallback } from 'react';
import { SONGS } from '../../data/songs';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';

export const FavoritesPage: React.FC = () => {
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  const favoriteSongs = useMemo(() => {
    return SONGS.filter((s) => favoriteIds.includes(s.id));
  }, [favoriteIds]);

  const handlePlayAll = useCallback(() => {
    if (favoriteSongs.length > 0) {
      playQueue(favoriteSongs, 0);
    }
  }, [favoriteSongs, playQueue]);

  const handlePlaySingle = useCallback(
    (_song: Song, index: number) => {
      playQueue(favoriteSongs, index);
    },
    [favoriteSongs, playQueue]
  );

  return (
    <div className="favorites-page" data-testid="favorites-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bài hát yêu thích</h1>
          <p className="page-subtitle">
            Danh sách bài hát bạn đã lưu ({favoriteSongs.length} bài)
          </p>
        </div>
        {favoriteSongs.length > 0 && (
          <button
            type="button"
            className="btn-primary btn-play-all"
            onClick={handlePlayAll}
            data-testid="play-all-btn"
          >
            ▶ Phát tất cả
          </button>
        )}
      </div>

      {favoriteSongs.length === 0 ? (
        <div className="empty-state" data-testid="empty-favorites">
          <p className="empty-title">Bạn chưa có bài hát yêu thích.</p>
          <p className="empty-desc">
            Hãy khám phá Thư viện và bấm nút ♥ trên các bài hát yêu thích để lưu vào đây!
          </p>
        </div>
      ) : (
        <div className="favorites-list-table">
          <div className="list-table-header">
            <span className="col-index">#</span>
            <span className="col-info">Bài hát &amp; Nghệ sĩ</span>
            <span className="col-genre">Thể loại</span>
            <span className="col-duration">Thời lượng</span>
            <span className="col-actions">Thao tác</span>
          </div>
          <div className="favorites-items">
            {favoriteSongs.map((song, index) => (
              <div key={song.id} className="song-row" data-testid={`favorite-row-${song.id}`}>
                <span className="col-index">{index + 1}</span>
                <div className="col-info">
                  <div className={`song-thumb genre-thumb-${song.genre.toLowerCase()}`} aria-hidden="true">
                    <span>{song.title.charAt(0)}</span>
                  </div>
                  <div className="song-text-meta">
                    <span className="song-title">{song.title}</span>
                    <span className="song-artist">{song.artist}</span>
                  </div>
                </div>
                <span className={`col-genre badge-genre badge-${song.genre.toLowerCase()}`}>{song.genre}</span>
                <span className="col-duration">{formatDuration(song.duration)}</span>
                <div className="col-actions">
                  <button
                    type="button"
                    className="btn-action btn-play"
                    onClick={() => handlePlaySingle(song, index)}
                    aria-label={`Phát ${song.title}`}
                  >
                    Phát
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-fav active"
                    onClick={() => toggleFavorite(song.id)}
                    aria-label="Bỏ yêu thích"
                    title="Bỏ yêu thích"
                  >
                    ♥
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-queue"
                    onClick={() => addToQueue(song)}
                    aria-label={`Thêm ${song.title} vào hàng đợi`}
                  >
                    + Hàng đợi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
