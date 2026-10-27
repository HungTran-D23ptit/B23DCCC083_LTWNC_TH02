import React, { useEffect } from 'react';
import { usePlayerStore } from './usePlayerStore';
import { ProgressBar } from './ProgressBar';

export const PlayerBar: React.FC = () => {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const tick = usePlayerStore((s) => s.tick);
  const currentSong = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );
  const queueLength = usePlayerStore((s) => s.queue.length);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, tick]);

  return (
    <footer className="player-bar" data-testid="player-bar">
      <div className="player-bar-inner">
        <div className="player-info">
          {currentSong ? (
            <div className="player-song-card">
              <div className="player-thumb-artwork" aria-hidden="true">
                <span>🎵</span>
              </div>
              <div className="player-text-block">
                <div className="player-top-row">
                  <span className="now-playing-label">Đang phát:</span>
                  <strong className="song-title">{currentSong.title}</strong>
                </div>
                <div className="player-bottom-row">
                  <span className="separator">–</span>
                  <span className="song-artist">{currentSong.artist}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="player-song-card not-playing-card">
              <div className="player-thumb-artwork empty" aria-hidden="true">
                <span>🎧</span>
              </div>
              <div className="player-text-block">
                <span className="not-playing">Chưa phát bài nào</span>
              </div>
            </div>
          )}
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button
              type="button"
              className="ctrl-btn"
              onClick={prev}
              disabled={queueLength === 0}
              aria-label="Bài trước"
            >
              Trước
            </button>
            <button
              type="button"
              className="ctrl-btn ctrl-play"
              onClick={togglePlay}
              disabled={queueLength === 0}
              aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
            >
              {isPlaying ? 'Tạm dừng' : 'Phát'}
            </button>
            <button
              type="button"
              className="ctrl-btn"
              onClick={next}
              disabled={queueLength === 0}
              aria-label="Bài sau"
            >
              Sau
            </button>
          </div>
          <ProgressBar />
        </div>

        <div className="player-queue-status">
          <span className="queue-badge">Hàng đợi: {queueLength} bài</span>
        </div>
      </div>
    </footer>
  );
};

export default PlayerBar;
