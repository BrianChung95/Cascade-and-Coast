import { create } from 'zustand';
import type { MenuItem } from '../lib/types';

interface UIState {
  activeMenuItem: MenuItem | null;
  openMenuItem: (item: MenuItem) => void;
  closeMenuItem: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeMenuItem: null,
  openMenuItem: (item) => set({ activeMenuItem: item }),
  closeMenuItem: () => set({ activeMenuItem: null })
}));
