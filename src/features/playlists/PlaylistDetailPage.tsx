import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';
import { SONGS } from '../../data/songs';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';
import { usePlayerStore } from '../player/usePlayerStore';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((s) => s.playQueue);

  const playlist = playlists.find((p) => p.id === id);

  const playlistSongs: Song[] = useMemo(() => {
    if (!playlist) return [];
    return playlist.songIds
      .map((songId) => SONGS.find((s) => s.id === songId))
      .filter((s): s is Song => s !== undefined);
  }, [playlist]);

  const totalDuration = useMemo(() => {
    return playlistSongs.reduce((sum, song) => sum + song.duration, 0);
  }, [playlistSongs]);

  if (!playlist) {
    return (
      <div className="playlist-detail-page" data-testid="playlist-not-found">
        <div className="page-header">
          <Link to="/playlists" className="btn-back">
            ← Quay lại danh sách playlist
          </Link>
        </div>
        <div className="empty-state">
          <p className="empty-title">Không tìm thấy playlist.</p>
        </div>
      </div>
    );
  }

  const mins = Math.floor(totalDuration / 60);
  const secs = totalDuration % 60;

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playQueue(playlistSongs, 0);
    }
  };

  const handlePlaySingle = (index: number) => {
    playQueue(playlistSongs, index);
  };

  const handleRemoveSong = (songId: string) => {
    dispatch({
      type: 'removeSong',
      playlistId: playlist.id,
      songId,
    });
  };

  return (
    <div className="playlist-detail-page" data-testid="playlist-detail-page">
      <div className="page-header">
        <Link to="/playlists" className="btn-back">
          ← Quay lại playlist
        </Link>
        <div className="detail-header-info">
          <h1 className="page-title">{playlist.name}</h1>
          <p className="playlist-meta" data-testid="playlist-meta">
            <span>{playlistSongs.length} bài hát</span>
            <span className="dot">•</span>
            <span className="total-duration">
              Tổng thời lượng: {mins} phút {secs} giây
            </span>
          </p>
        </div>
        {playlistSongs.length > 0 && (
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

      {playlistSongs.length === 0 ? (
        <div className="empty-state" data-testid="empty-playlist">
          <p className="empty-title">Playlist này chưa có bài hát nào.</p>
          <p className="empty-desc">
            Vào <Link to="/">Thư viện</Link>, chọn playlist này và bấm <strong>+ Playlist</strong> để thêm bài hát.
          </p>
        </div>
      ) : (
        <div className="playlist-song-table">
          <div className="list-table-header">
            <span className="col-index">#</span>
            <span className="col-info">Bài hát &amp; Nghệ sĩ</span>
            <span className="col-genre">Thể loại</span>
            <span className="col-duration">Thời lượng</span>
            <span className="col-actions">Thao tác</span>
          </div>
          <div className="playlist-song-items">
            {playlistSongs.map((song, index) => (
              <div
                key={song.id}
                className="song-row"
                data-testid={`playlist-song-row-${song.id}`}
              >
                <span className="col-index">{index + 1}</span>
                <div className="col-info">
                  <span className="song-title">{song.title}</span>
                  <span className="song-artist">{song.artist}</span>
                </div>
                <span className="col-genre badge-genre">{song.genre}</span>
                <span className="col-duration">{formatDuration(song.duration)}</span>
                <div className="col-actions">
                  <button
                    type="button"
                    className="btn-action btn-play"
                    onClick={() => handlePlaySingle(index)}
                    aria-label={`Phát ${song.title}`}
                  >
                    Phát
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-danger-action"
                    onClick={() => handleRemoveSong(song.id)}
                    aria-label={`Bỏ bài ${song.title}`}
                  >
                    Bỏ
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

export default PlaylistDetailPage;
