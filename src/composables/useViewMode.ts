import type { ViewMode } from '@/models/poke-ui.ts';

import { ref, watch, onMounted, onBeforeUnmount, type Ref } from 'vue';

type Options = {
  storageKey?: string;
  defaultValue?: ViewMode;
  syncAcrossTabs?: boolean;
};

export function useViewMode({
  defaultValue = 'grid',
  storageKey = 'ui:viewMode',
  syncAcrossTabs = true,
}: Options = {}) {
  const viewMode: Ref<ViewMode> = ref(defaultValue);

  const setViewMode = (mode: ViewMode) => {
    viewMode.value = mode;
  };

  const onStorage = (e: StorageEvent) => {
    if (e.key === storageKey && e.newValue) {
      viewMode.value = e.newValue as ViewMode;
    }
  };

  onMounted(() => {
    try {
      const raw = localStorage.getItem(storageKey) as ViewMode | null;
      if (raw) viewMode.value = raw;
    } catch (e) {
      console.error(e);
    }

    if (syncAcrossTabs) {
      window.addEventListener('storage', onStorage);
    }
  });

  watch(viewMode, (val) => {
    localStorage.setItem(storageKey, val);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('storage', onStorage);
  });

  return { setViewMode, viewMode };
}
