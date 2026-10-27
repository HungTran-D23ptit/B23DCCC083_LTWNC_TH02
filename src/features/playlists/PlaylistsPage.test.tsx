import type { ReactElement } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PlaylistsPage } from './PlaylistsPage';
import { PlaylistProvider } from './PlaylistContext';
import type { Playlist } from '../../types';

function renderWithProviders(ui: ReactElement, initialPlaylists?: Playlist[]) {
  return render(
    <MemoryRouter>
      <PlaylistProvider initialPlaylists={initialPlaylists}>
        {ui}
      </PlaylistProvider>
    </MemoryRouter>
  );
}

describe('PlaylistsPage', () => {
  it('bấm Tạo khi ô trống thì thấy "Tên playlist không được để trống"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    const createButton = screen.getByRole('button', { name: /tạo/i });
    await user.click(createButton);

    expect(screen.getByText('Tên playlist không được để trống')).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    const input = screen.getByLabelText(/tên playlist/i);
    const createButton = screen.getByRole('button', { name: /tạo/i });

    await user.type(input, 'Nhạc Acoustic Chill');
    await user.click(createButton);

    expect(screen.getByText('Nhạc Acoustic Chill')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('nhập tên trùng lặp không phân biệt hoa thường thì thấy "Tên playlist đã tồn tại"', async () => {
    const user = userEvent.setup();
    const initialPlaylists: Playlist[] = [
      { id: 'p1', name: 'Chạy bộ', songIds: [] },
    ];
    renderWithProviders(<PlaylistsPage />, initialPlaylists);

    const input = screen.getByLabelText(/tên playlist/i);
    const createButton = screen.getByRole('button', { name: /tạo/i });

    await user.type(input, 'chạy bộ');
    await user.click(createButton);

    expect(screen.getByText('Tên playlist đã tồn tại')).toBeInTheDocument();
  });

  it('bấm nút Xóa thì xóa playlist tương ứng khỏi danh sách', async () => {
    const user = userEvent.setup();
    const initialPlaylists: Playlist[] = [
      { id: 'p1', name: 'Nhạc Cổ Điển', songIds: [] },
    ];
    renderWithProviders(<PlaylistsPage />, initialPlaylists);

    expect(screen.getByText('Nhạc Cổ Điển')).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', { name: /xóa playlist nhạc cổ điển/i });
    await user.click(deleteBtn);

    expect(screen.queryByText('Nhạc Cổ Điển')).not.toBeInTheDocument();
  });
});
