import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LibraryPage } from './LibraryPage';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { PlaylistProvider } from '../playlists/PlaylistContext';

describe('LibraryPage', () => {
  beforeEach(() => {
    usePlayerStore.setState({ ...initialPlayerState });
    useFavoritesStore.setState({ ids: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('khởi tạo hiển thị đủ 10.000 bài hát', () => {
    render(
      <PlaylistProvider>
        <LibraryPage />
      </PlaylistProvider>
    );

    expect(screen.getByText('Thư viện bài hát')).toBeInTheDocument();
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
  });

  it('tìm kiếm theo tên có debounce 300ms', () => {
    vi.useFakeTimers();

    render(
      <PlaylistProvider>
        <LibraryPage />
      </PlaylistProvider>
    );

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'mưa' } });

    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();
  });

  it('lọc theo thể loại kết hợp với tìm kiếm', async () => {
    vi.useFakeTimers();

    render(
      <PlaylistProvider>
        <LibraryPage />
      </PlaylistProvider>
    );

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'mưa' } });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();

    const genreSelect = screen.getByLabelText('Thể loại');
    fireEvent.change(genreSelect, { target: { value: 'Rock' } });

    expect(screen.getByText('Tìm thấy 250 bài hát')).toBeInTheDocument();
  });

  it('tìm kiếm từ khóa không có kết quả hiển thị thông báo', () => {
    vi.useFakeTimers();

    render(
      <PlaylistProvider>
        <LibraryPage />
      </PlaylistProvider>
    );

    const searchInput = screen.getByLabelText('Tìm kiếm');
    fireEvent.change(searchInput, { target: { value: 'xyznotfound' } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Không tìm thấy bài hát nào')).toBeInTheDocument();
  });

  it('sắp xếp theo Tên A-Z và Thời lượng tăng dần', () => {
    render(
      <PlaylistProvider>
        <LibraryPage />
      </PlaylistProvider>
    );

    const sortSelect = screen.getByLabelText('Sắp xếp');
    fireEvent.change(sortSelect, { target: { value: 'title' } });

    expect(screen.getByText('Biển bình yên 1')).toBeInTheDocument();

    fireEvent.change(sortSelect, { target: { value: 'duration' } });
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
  });

  it('chọn playlist và hiển thị các nút + Playlist', async () => {
    const user = userEvent.setup();
    const handleAddMock = vi.fn();
    const playlists = [{ id: 'p1', name: 'Nhạc trẻ', songIds: [] }];

    render(
      <LibraryPage
        playlists={playlists}
        selectedPlaylistId="p1"
        onAddSongToPlaylist={handleAddMock}
      />
    );

    const addButtons = screen.getAllByRole('button', { name: '+ Playlist' });
    expect(addButtons[0]).toBeEnabled();

    await user.click(addButtons[0]);
    expect(handleAddMock).toHaveBeenCalledWith('p1', 's1');
  });
});
