import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from './useFavoritesStore';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  it('toggle thêm id vào danh sách khi chưa có', () => {
    const { toggle } = useFavoritesStore.getState();
    toggle('s1');

    expect(useFavoritesStore.getState().ids).toEqual(['s1']);
    expect(useFavoritesStore.getState().isFavorite('s1')).toBe(true);
  });

  it('toggle bỏ id khỏi danh sách khi đã có', () => {
    const { toggle } = useFavoritesStore.getState();
    toggle('s1');
    toggle('s2');
    expect(useFavoritesStore.getState().ids).toEqual(['s1', 's2']);

    toggle('s1');
    expect(useFavoritesStore.getState().ids).toEqual(['s2']);
    expect(useFavoritesStore.getState().isFavorite('s1')).toBe(false);
    expect(useFavoritesStore.getState().isFavorite('s2')).toBe(true);
  });
});
