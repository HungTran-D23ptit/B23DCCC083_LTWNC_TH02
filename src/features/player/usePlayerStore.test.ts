import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';
import type { Song } from '../../types';

const mockSongs: Song[] = [
  { id: 's1', title: 'Bài hát 1', artist: 'Ca sĩ 1', genre: 'Pop', duration: 180 },
  { id: 's2', title: 'Bài hát 2', artist: 'Ca sĩ 2', genre: 'Rock', duration: 200 },
  { id: 's3', title: 'Bài hát 3', artist: 'Ca sĩ 3', genre: 'Ballad', duration: 10 },
];

describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({ ...initialPlayerState });
  });

  it('playQueue đặt đúng bài và bắt đầu phát', () => {
    const { playQueue } = usePlayerStore.getState();
    playQueue(mockSongs, 1);

    const state = usePlayerStore.getState();
    expect(state.queue).toHaveLength(3);
    expect(state.currentIndex).toBe(1);
    expect(state.isPlaying).toBe(true);
    expect(state.position).toBe(0);
    expect(state.queue[state.currentIndex].title).toBe('Bài hát 2');
  });

  it('togglePlay chuyển đổi trạng thái phát và tạm dừng', () => {
    const { playQueue, togglePlay } = usePlayerStore.getState();
    playQueue(mockSongs, 0);

    expect(usePlayerStore.getState().isPlaying).toBe(true);
    togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
    togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  });

  it('tick tăng position 1 giây khi đang phát', () => {
    const { playQueue, tick } = usePlayerStore.getState();
    playQueue(mockSongs, 0);

    tick();
    expect(usePlayerStore.getState().position).toBe(1);
    tick();
    expect(usePlayerStore.getState().position).toBe(2);
  });

  it('tick ở giây cuối tự sang bài sau', () => {
    const { playQueue, tick } = usePlayerStore.getState();
    playQueue(mockSongs, 2);

    usePlayerStore.setState({ position: 9 });
    tick();

    const state = usePlayerStore.getState();
    expect(state.isPlaying).toBe(false);

    playQueue(mockSongs, 0);
    usePlayerStore.setState({ position: 179 });
    tick();

    const nextState = usePlayerStore.getState();
    expect(nextState.currentIndex).toBe(1);
    expect(nextState.position).toBe(0);
    expect(nextState.isPlaying).toBe(true);
  });

  it('next ở bài cuối thì isPlaying là false', () => {
    const { playQueue, next } = usePlayerStore.getState();
    playQueue(mockSongs, 2);

    expect(usePlayerStore.getState().isPlaying).toBe(true);
    next();

    const state = usePlayerStore.getState();
    expect(state.isPlaying).toBe(false);
  });

  it('prev khi đã phát quá 3 giây thì chỉ tua về 0:00', () => {
    const { playQueue, prev } = usePlayerStore.getState();
    playQueue(mockSongs, 1);
    usePlayerStore.setState({ position: 5 });

    prev();

    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
  });

  it('prev khi phát chưa quá 3 giây thì lùi về bài trước', () => {
    const { playQueue, prev } = usePlayerStore.getState();
    playQueue(mockSongs, 1);
    usePlayerStore.setState({ position: 2 });

    prev();

    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.position).toBe(0);
  });

  it('prev ở bài đầu tiên thì chỉ tua về 0:00', () => {
    const { playQueue, prev } = usePlayerStore.getState();
    playQueue(mockSongs, 0);
    usePlayerStore.setState({ position: 1 });

    prev();

    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.position).toBe(0);
  });

  it('addToQueue thêm vào cuối hàng đợi và bỏ qua nếu bài đã có', () => {
    const { playQueue, addToQueue } = usePlayerStore.getState();
    playQueue([mockSongs[0]], 0);

    expect(usePlayerStore.getState().queue).toHaveLength(1);

    addToQueue(mockSongs[1]);
    expect(usePlayerStore.getState().queue).toHaveLength(2);
    expect(usePlayerStore.getState().queue[1].id).toBe('s2');

    addToQueue(mockSongs[0]);
    expect(usePlayerStore.getState().queue).toHaveLength(2);
  });
});
