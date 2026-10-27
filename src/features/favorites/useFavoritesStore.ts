import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id: string) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((item) => item !== id) });
        } else {
          set({ ids: [...ids, id] });
        }
      },
      isFavorite: (id: string) => {
        return get().ids.includes(id);
      },
    }),
    {
      name: 'music-favorites',
    }
  )
);
