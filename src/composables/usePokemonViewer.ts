import type {
  GridItemData,
  TableRowData,
  ViewerItem,
  ViewMode,
} from '@/models/poke-ui.ts';

import { ref, watch } from 'vue';

/**
 * This composable manages the state for a Pokémon viewer that can switch between grid and table views.
 * We can set a more generic dataset using `setData`,
 * or we can provide fetch functions to load data based on the current view mode.
 * @param fetchTableData
 * @param fetchGridData
 */
export const usePokemonViewer = (
  fetchTableData?: () => Promise<TableRowData[]>,
  fetchGridData?: () => Promise<GridItemData[]>
) => {
  const viewMode = ref<ViewMode>('grid');
  const error = ref<string | undefined>();
  const loading = ref<boolean>(false);

  const tableRows = ref<TableRowData[]>([]);
  const gridItems = ref<GridItemData[]>([]);

  const setData = (data: ViewerItem[]) => {
    tableRows.value = data;
    gridItems.value = data;
    loading.value = false;
  };

  const loadItems = async () => {
    if (!fetchGridData && !fetchTableData) {
      return;
    }

    loading.value = true;
    error.value = undefined;

    try {
      if (viewMode.value === 'grid') {
        const data = await fetchGridData?.();
        gridItems.value = data ?? [];
      }

      if (viewMode.value === 'table') {
        const data = await fetchTableData?.();
        tableRows.value = data ?? [];
      }
    } catch {
      error.value = 'Error loading items';
    } finally {
      loading.value = false;
    }
  };

  watch(
    viewMode,
    () => {
      loadItems();
    },
    { immediate: true }
  );

  return {
    error,
    gridItems,
    loading,
    loadItems,
    setData,
    tableRows,
    viewMode,
  };
};
