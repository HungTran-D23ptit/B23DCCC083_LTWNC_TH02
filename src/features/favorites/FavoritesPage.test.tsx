import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoritesPage } from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';

describe('FavoritesPage', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState({ ...initialPlayerState });
  });

  it('hiển thị thông báo khi chưa có bài hát yêu thích', () => {
    render(<FavoritesPage />);
    expect(screen.getByText('Bạn chưa có bài hát yêu thích.')).toBeInTheDocument();
  });

  it('liệt kê các bài hát yêu thích và bấm Phát tất cả phát toàn bộ danh sách', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1', 's2'] });

    render(<FavoritesPage />);

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();

    const playAllBtn = screen.getByRole('button', { name: /phát tất cả/i });
    await user.click(playAllBtn);

    const playerState = usePlayerStore.getState();
    expect(playerState.isPlaying).toBe(true);
    expect(playerState.queue).toHaveLength(2);
    expect(playerState.currentIndex).toBe(0);
  });

  it('bấm nút Phát ở một bài hát yêu thích thì phát bài đó', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1', 's2'] });

    render(<FavoritesPage />);

    const playSecondSongBtn = screen.getByRole('button', { name: 'Phát Nắng tháng Sáu 1' });
    await user.click(playSecondSongBtn);

    const playerState = usePlayerStore.getState();
    expect(playerState.isPlaying).toBe(true);
    expect(playerState.currentIndex).toBe(1);
  });

  it('bấm nút Bỏ yêu thích thì gỡ bài hát khỏi danh sách', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1'] });

    render(<FavoritesPage />);
    const unfavBtn = screen.getByRole('button', { name: /bỏ yêu thích/i });
    await user.click(unfavBtn);

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  it('bấm nút + Hàng đợi thì thêm bài hát vào queue', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1'] });

    render(<FavoritesPage />);
    const queueBtn = screen.getByRole('button', { name: /thêm mưa tháng sáu 1 vào hàng đợi/i });
    await user.click(queueBtn);

    expect(usePlayerStore.getState().queue).toHaveLength(1);
  });
});
