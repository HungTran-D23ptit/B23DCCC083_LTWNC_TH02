import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerBar } from './PlayerBar';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';

describe('PlayerBar', () => {
  beforeEach(() => {
    usePlayerStore.setState({ ...initialPlayerState });
  });

  it('hiển thị Chưa phát bài nào khi chưa có bài hát trong hàng đợi', () => {
    render(<PlayerBar />);
    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument();
  });

  it('hiển thị thông tin bài hát và cập nhật nút khi phát nhạc', async () => {
    const user = userEvent.setup();
    usePlayerStore.setState({
      queue: [
        { id: 's1', title: 'Mưa tháng Sáu 1', artist: 'Lê Minh', genre: 'Pop', duration: 150 },
        { id: 's2', title: 'Nắng tháng Sáu 1', artist: 'Quang Huy', genre: 'Indie', duration: 187 },
      ],
      currentIndex: 0,
      isPlaying: true,
      position: 0,
    });

    render(<PlayerBar />);

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Lê Minh')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 2 bài')).toBeInTheDocument();

    const pauseBtn = screen.getByRole('button', { name: 'Tạm dừng' });
    await user.click(pauseBtn);
    expect(usePlayerStore.getState().isPlaying).toBe(false);

    const nextBtn = screen.getByRole('button', { name: 'Bài sau' });
    await user.click(nextBtn);
    expect(usePlayerStore.getState().currentIndex).toBe(1);

    const prevBtn = screen.getByRole('button', { name: 'Bài trước' });
    await user.click(prevBtn);
    expect(usePlayerStore.getState().currentIndex).toBe(0);
  });

  it('chạy timer mỗi giây khi isPlaying là true', () => {
    vi.useFakeTimers();
    usePlayerStore.setState({
      queue: [
        { id: 's1', title: 'Mưa tháng Sáu 1', artist: 'Lê Minh', genre: 'Pop', duration: 150 },
      ],
      currentIndex: 0,
      isPlaying: true,
      position: 0,
    });

    render(<PlayerBar />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(usePlayerStore.getState().position).toBe(3);
    vi.useRealTimers();
  });
});
