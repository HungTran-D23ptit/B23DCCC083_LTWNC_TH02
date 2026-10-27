import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PlaylistDetailPage } from './PlaylistDetailPage';
import { PlaylistProvider } from './PlaylistContext';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';
import type { Playlist } from '../../types';

function renderDetailPage(initialPlaylists: Playlist[], initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <PlaylistProvider initialPlaylists={initialPlaylists}>
        <Routes>
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        </Routes>
      </PlaylistProvider>
    </MemoryRouter>
  );
}

describe('PlaylistDetailPage', () => {
  beforeEach(() => {
    usePlayerStore.setState({ ...initialPlayerState });
  });

  it('hiển thị thông báo khi không tìm thấy playlist', () => {
    renderDetailPage([], '/playlists/pl-invalid');
    expect(screen.getByText('Không tìm thấy playlist.')).toBeInTheDocument();
  });

  it('hiển thị tên playlist, số bài và tổng thời lượng chính xác', () => {
    const playlists: Playlist[] = [
      { id: 'pl-run', name: 'Chạy bộ', songIds: ['s1', 's2'] },
    ];
    renderDetailPage(playlists, '/playlists/pl-run');

    expect(screen.getByText('Chạy bộ')).toBeInTheDocument();
    expect(screen.getByText('2 bài hát')).toBeInTheDocument();
    expect(screen.getByText(/tổng thời lượng: 5 phút 37 giây/i)).toBeInTheDocument();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
  });

  it('bấm Phát tất cả sẽ phát toàn bộ bài hát trong playlist', async () => {
    const user = userEvent.setup();
    const playlists: Playlist[] = [
      { id: 'pl-run', name: 'Chạy bộ', songIds: ['s1', 's2'] },
    ];
    renderDetailPage(playlists, '/playlists/pl-run');

    const playAllBtn = screen.getByRole('button', { name: /phát tất cả/i });
    await user.click(playAllBtn);

    const state = usePlayerStore.getState();
    expect(state.isPlaying).toBe(true);
    expect(state.queue).toHaveLength(2);
    expect(state.queue[0].title).toBe('Mưa tháng Sáu 1');
  });

  it('bấm nút Bỏ thì gỡ bài hát khỏi playlist', async () => {
    const user = userEvent.setup();
    const playlists: Playlist[] = [
      { id: 'pl-run', name: 'Chạy bộ', songIds: ['s1', 's2'] },
    ];
    renderDetailPage(playlists, '/playlists/pl-run');

    const removeButtons = screen.getAllByRole('button', { name: /bỏ bài /i });
    await user.click(removeButtons[0]);

    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
  });

  it('hiển thị trạng thái trống khi playlist chưa có bài nào', () => {
    const playlists: Playlist[] = [
      { id: 'pl-empty', name: 'Rỗng', songIds: [] },
    ];
    renderDetailPage(playlists, '/playlists/pl-empty');

    expect(screen.getByText('Playlist này chưa có bài hát nào.')).toBeInTheDocument();
  });
});
