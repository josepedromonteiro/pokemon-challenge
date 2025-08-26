import { defineStore } from 'pinia';
import type { ViewMode } from '@/models/poke-ui.ts'; // 'grid' | 'table'

const STORAGE_KEY = 'ui:viewMode';

/**
 * UI store for persisting user interface preferences.
 * - Currently handles Home view mode (grid vs table)
 * - Persists choice to localStorage
 */
export const useUI = defineStore('ui', {
  state: () => ({
    viewMode:
      (localStorage.getItem(STORAGE_KEY) as ViewMode | null) ??
      ('grid' as ViewMode),
  }),
  actions: {
    setViewMode(mode: ViewMode) {
      this.viewMode = mode;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, mode);
      }
    },
  },
});
