/**
 * UI Store (Zustand Global State)
 *
 * Manages global UI state across components without prop drilling.
 *
 * Current state:
 * - activeMenuItem: Which menu item's details modal is open
 *
 * Usage Pattern (Correct):
 * - MenuCard.tsx calls openMenuItem() directly (no props needed)
 * - MenuPage.tsx reads activeMenuItem to show/hide modal
 * - Modal calls closeMenuItem() directly
 *
 * Benefits of Zustand:
 * - No prop drilling (MenuGrid doesn't need to know about modal)
 * - Any component can access state without passing props
 * - Simple API (no providers, just import and use)
 * - Auto re-renders only components that use changed state
 *
 * Example:
 * const openMenuItem = useUIStore(state => state.openMenuItem);
 * openMenuItem(item); // Updates global state, MenuPage auto re-renders
 */

import { create } from 'zustand';
import type { MenuItem } from '../lib/types';

interface UIState {
  // Current menu item being viewed in modal (null = modal closed)
  activeMenuItem: MenuItem | null;

  // Open modal with specific menu item
  openMenuItem: (item: MenuItem) => void;

  // Close modal
  closeMenuItem: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeMenuItem: null,
  openMenuItem: (item) => set({ activeMenuItem: item }),
  closeMenuItem: () => set({ activeMenuItem: null })
}));
