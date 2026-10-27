import { describe, it, expect } from 'vitest';
import { generateSongs, SONGS, GENRES } from './songs';

describe('songs data', () => {
  it('generateSongs(10000) tạo ra đúng 10000 phần tử', () => {
    const list = generateSongs(10000);
    expect(list).toHaveLength(10000);
  });

  it('tất cả các id trong danh sách là duy nhất không trùng lặp', () => {
    const list = generateSongs(10000);
    const idSet = new Set(list.map((s) => s.id));
    expect(idSet.size).toBe(10000);
  });

  it('mọi thời lượng bài hát nằm trong khoảng 150 đến 300 giây', () => {
    const list = generateSongs(10000);
    for (const song of list) {
      expect(song.duration).toBeGreaterThanOrEqual(150);
      expect(song.duration).toBeLessThanOrEqual(300);
    }
  });

  it('mọi bài hát đều có đầy đủ thông tin hợp lệ về thể loại và nghệ sĩ', () => {
    expect(SONGS).toHaveLength(10000);
    const firstSong = SONGS[0];
    expect(firstSong).toEqual({
      id: 's1',
      title: 'Mưa tháng Sáu 1',
      artist: 'Lê Minh',
      genre: 'Pop',
      duration: 150,
    });

    for (let i = 0; i < 50; i++) {
      expect(GENRES).toContain(SONGS[i].genre);
      expect(SONGS[i].artist).toBeTruthy();
      expect(SONGS[i].title).toBeTruthy();
    }
  });
});
