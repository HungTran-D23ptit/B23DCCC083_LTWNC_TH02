import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongRow } from './SongRow';
import type { Song } from '../../types';

describe('SongRow', () => {
  const mockSong: Song = {
    id: 's1',
    title: 'Mưa tháng Sáu 1',
    artist: 'Lê Minh',
    genre: 'Pop',
    duration: 150,
  };

  it('hiển thị tên bài và 2:30', () => {
    render(
      <SongRow
        index={0}
        style={{}}
        data={{
          songs: [mockSong],
          onPlay: vi.fn(),
        }}
      />
    );

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Lê Minh')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  it('bấm nút Phát (tìm bằng getByRole) thì hàm mock vi.fn() được gọi với đúng bài hát', async () => {
    const user = userEvent.setup();
    const handlePlayMock = vi.fn();

    render(
      <SongRow
        index={0}
        style={{}}
        data={{
          songs: [mockSong],
          onPlay: handlePlayMock,
        }}
      />
    );

    const playBtn = screen.getByRole('button', { name: /phát/i });
    await user.click(playBtn);

    expect(handlePlayMock).toHaveBeenCalledTimes(1);
    expect(handlePlayMock).toHaveBeenCalledWith(mockSong, 0);
  });

  it('bấm nút yêu thích gọi hàm onToggleFavorite với id bài hát', async () => {
    const user = userEvent.setup();
    const handleFavMock = vi.fn();

    render(
      <SongRow
        index={0}
        style={{}}
        data={{
          songs: [mockSong],
          onPlay: vi.fn(),
          onToggleFavorite: handleFavMock,
          isFavorite: () => false,
        }}
      />
    );

    const favButton = screen.getByRole('button', { name: 'Thêm vào yêu thích' });
    await user.click(favButton);

    expect(handleFavMock).toHaveBeenCalledWith('s1');
  });

  it('bấm nút + Hàng đợi gọi hàm onAddToQueue với bài hát', async () => {
    const user = userEvent.setup();
    const handleQueueMock = vi.fn();

    render(
      <SongRow
        index={0}
        style={{}}
        data={{
          songs: [mockSong],
          onPlay: vi.fn(),
          onAddToQueue: handleQueueMock,
        }}
      />
    );

    const queueButton = screen.getByRole('button', { name: /thêm mưa tháng sáu 1 vào hàng đợi/i });
    await user.click(queueButton);

    expect(handleQueueMock).toHaveBeenCalledWith(mockSong);
  });
});
