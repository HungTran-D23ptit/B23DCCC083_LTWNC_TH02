import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';

export interface CreatePlaylistFormProps {
  existingNames: string[];
}

export const CreatePlaylistForm: React.FC<CreatePlaylistFormProps> = ({ existingNames }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = usePlaylistDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Tên playlist không được để trống');
      return;
    }

    const isDuplicate = existingNames.some(
      (n) => n.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setError('Tên playlist đã tồn tại');
      return;
    }

    dispatch({ type: 'create', name: trimmed });
    setName('');
    setError(null);
  };

  return (
    <form className="create-playlist-form" onSubmit={handleSubmit} data-testid="create-playlist-form">
      <div className="form-group">
        <label htmlFor="playlist-name-input" className="form-label">
          Tên playlist
        </label>
        <div className="form-input-row">
          <input
            id="playlist-name-input"
            type="text"
            className="input-text"
            placeholder="Nhập tên playlist mới..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
          />
          <button type="submit" className="btn-primary btn-create">
            Tạo
          </button>
        </div>
        {error && (
          <p className="error-message" role="alert" data-testid="playlist-error">
            {error}
          </p>
        )}
      </div>
    </form>
  );
};

export const PlaylistsPage: React.FC = () => {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  const existingNames = playlists.map((p) => p.name);

  const handleRemove = (id: string) => {
    dispatch({ type: 'remove', id });
  };

  return (
    <div className="playlists-page" data-testid="playlists-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Danh sách playlist</h1>
          <p className="page-subtitle">Tạo và quản lý các danh sách phát cá nhân</p>
        </div>
      </div>

      <CreatePlaylistForm existingNames={existingNames} />

      <div className="playlists-section">
        <h2 className="section-title">Playlist của bạn ({playlists.length})</h2>

        {playlists.length === 0 ? (
          <div className="empty-state">
            <p>Bạn chưa có playlist nào. Hãy tạo playlist đầu tiên của bạn ở trên!</p>
          </div>
        ) : (
          <div className="playlist-grid">
            {playlists.map((pl) => (
              <div key={pl.id} className="playlist-card" data-testid={`playlist-card-${pl.id}`}>
                <div className="playlist-card-content">
                  <h3 className="playlist-card-title">
                    <Link to={`/playlists/${pl.id}`} className="playlist-title-link">
                      {pl.name}
                    </Link>
                  </h3>
                  <span className="playlist-song-count">{pl.songIds.length} bài</span>
                </div>
                <div className="playlist-card-actions">
                  <Link to={`/playlists/${pl.id}`} className="btn-secondary btn-detail">
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    className="btn-danger btn-delete"
                    onClick={() => handleRemove(pl.id)}
                    aria-label={`Xóa playlist ${pl.name}`}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistsPage;
