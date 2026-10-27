import { describe, it, expect } from 'vitest';
import { playlistReducer } from './playlistReducer';
import type { Playlist } from '../../types';

describe('playlistReducer', () => {
  const initialPlaylists: Playlist[] = [
    { id: 'pl-1', name: 'Nhạc trẻ', songIds: ['s1', 's2'] },
    { id: 'pl-2', name: 'Acoustic', songIds: ['s3'] },
  ];

  it('tạo playlist mới thành công', () => {
    const newState = playlistReducer(initialPlaylists, {
      type: 'create',
      name: 'Chạy bộ',
    });

    expect(newState).toHaveLength(3);
    const created = newState.find((p) => p.name === 'Chạy bộ');
    expect(created).toBeDefined();
    expect(created?.songIds).toEqual([]);
  });

  it('tạo playlist với tên rỗng thì state giữ nguyên', () => {
    const newState = playlistReducer(initialPlaylists, {
      type: 'create',
      name: '   ',
    });

    expect(newState).toEqual(initialPlaylists);
  });

  it('rename đổi tên playlist thành công', () => {
    const newState = playlistReducer(initialPlaylists, {
      type: 'rename',
      id: 'pl-1',
      name: 'Nhạc Pop thịnh hành',
    });

    expect(newState.find((p) => p.id === 'pl-1')?.name).toBe('Nhạc Pop thịnh hành');
    expect(newState.find((p) => p.id === 'pl-2')?.name).toBe('Acoustic');
  });

  it('addSong thêm bài hát vào playlist', () => {
    const newState = playlistReducer(initialPlaylists, {
      type: 'addSong',
      playlistId: 'pl-1',
      songId: 's5',
    });

    const target = newState.find((p) => p.id === 'pl-1');
    expect(target?.songIds).toEqual(['s1', 's2', 's5']);
  });

  it('addSong không thêm trùng bài hát đã có trong playlist', () => {
    const newState = playlistReducer(initialPlaylists, {
      type: 'addSong',
      playlistId: 'pl-1',
      songId: 's1',
    });

    const target = newState.find((p) => p.id === 'pl-1');
    expect(target?.songIds).toEqual(['s1', 's2']);
    expect(target?.songIds).toHaveLength(2);
  });

  it('removeSong xóa bài hát khỏi playlist', () => {
    const newState = playlistReducer(initialPlaylists, {
      type: 'removeSong',
      playlistId: 'pl-1',
      songId: 's1',
    });

    const target = newState.find((p) => p.id === 'pl-1');
    expect(target?.songIds).toEqual(['s2']);
  });

  it('remove xóa playlist thành công', () => {
    const newState = playlistReducer(initialPlaylists, {
      type: 'remove',
      id: 'pl-1',
    });

    expect(newState).toHaveLength(1);
    expect(newState.find((p) => p.id === 'pl-1')).toBeUndefined();
  });

  it('xóa playlist không tồn tại thì state giữ nguyên (toEqual)', () => {
    const newState = playlistReducer(initialPlaylists, {
      type: 'remove',
      id: 'pl-nonexistent',
    });

    expect(newState).toEqual(initialPlaylists);
  });
});
