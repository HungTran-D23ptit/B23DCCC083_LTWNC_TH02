import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';

describe('ProgressBar', () => {
  beforeEach(() => {
    usePlayerStore.setState({ ...initialPlayerState });
  });

  it('hiển thị 0:00 / 0:00 khi chưa có bài hát nào được chọn', () => {
    render(<ProgressBar />);
    expect(screen.getByTestId('time-display')).toHaveTextContent('0:00 / 0:00');
  });

  it('hiển thị thời gian và tiến trình bài hát chính xác', () => {
    usePlayerStore.setState({
      queue: [
        { id: 's1', title: 'Bài hát 1', artist: 'Ca sĩ 1', genre: 'Pop', duration: 150 },
      ],
      currentIndex: 0,
      position: 45,
    });

    render(<ProgressBar />);
    expect(screen.getByTestId('time-display')).toHaveTextContent('0:45 / 2:30');

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '45');
    expect(progressBar).toHaveAttribute('aria-valuemax', '150');
  });
});
