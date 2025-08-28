import type { ViewMode } from '@/models/poke-ui.ts';

import { defineStore } from 'pinia';
import { ref } from 'vue';

const STORAGE_KEY = 'ui:viewMode';

export const useUI = defineStore('ui', () => {
  const viewMode = ref<ViewMode>(
    (localStorage.getItem(STORAGE_KEY) as ViewMode | null) ?? 'grid'
  );

  const setViewMode = (mode: ViewMode) => {
    viewMode.value = mode;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  };

  return {
    setViewMode,
    viewMode,
  };
});
