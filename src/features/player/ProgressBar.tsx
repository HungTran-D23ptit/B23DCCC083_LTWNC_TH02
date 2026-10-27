import React from 'react';
import { usePlayerStore } from './usePlayerStore';
import { formatDuration } from '../../utils/format';

export const ProgressBar: React.FC = () => {
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex].duration
      : 0
  );

  const progressPercent = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="player-progress-container" data-testid="player-progress">
      <span className="time-display" data-testid="time-display">
        {formatDuration(position)} / {formatDuration(duration)}
      </span>
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={duration}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
