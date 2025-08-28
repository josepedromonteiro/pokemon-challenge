import type { PokemonDetail } from '@/models/api/pokemon-detail.api';
import type { DeepPartial } from '@/types/deep-partial';

// TODO - Create tests
import { ref, computed } from 'vue';

import {
  type GridItemData,
  mapToTableRowData,
  type TableRowData,
  type ViewMode,
} from '@/models/poke-ui';
import { pokeApiService } from '@/services/pokemon-api-service';
import { usePokedexStore } from '@/stores/pokedex.store';
import { useUI } from '@/stores/ui.store';
import { toGridItem } from '@/utils/pokeui.utils';

export function useHomeView() {
  const ui = useUI();
  const { isCaught, pokemonById } = usePokedexStore();

  const viewMode = computed<ViewMode>({
    get: () => ui.viewMode,
    set: (m) => ui.setViewMode(m),
  });

  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return details.value;
    return details.value.filter(
      (d) =>
        (d.name ?? '').toLowerCase().includes(q) || String(d.id ?? '') === q
    );
  });

  const gridItems = computed<GridItemData[]>(() =>
    filtered.value.map(toGridItem)
  );

  const tableRows = computed<TableRowData[]>(() =>
    filtered.value.map((d) =>
      mapToTableRowData(d, {
        caughtAt: pokemonById(d.id!)?.caughtAt,
        isCaught: isCaught(d.id!),
      })
    )
  );

  const canLoadMore = computed(() => details.value.length < total.value);

  const details = ref<DeepPartial<PokemonDetail>[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const pageSize = ref(50);
  const offset = ref(0);
  const query = ref('');

  const loadPage = async ({ replace = false } = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const page = await pokeApiService.getPokemonPageWithDetails(
        pageSize.value,
        offset.value,
        { concurrency: 8, ignoreErrors: true }
      );

      total.value = page.count ?? 0;
      const items = (page.results ?? []).filter(
        Boolean
      ) as DeepPartial<PokemonDetail>[];
      details.value = replace ? items : [...details.value, ...items];
    } catch {
      error.value = 'Failed to load Pokémon.';
    } finally {
      loading.value = false;
    }
  };

  const resetAndReload = () => {
    offset.value = 0;
    return loadPage({ replace: true });
  };

  const loadMore = () => {
    offset.value += pageSize.value;
    return loadPage();
  };

  return {
    canLoadMore,
    details,
    error,
    filtered,
    gridItems,
    loading,
    loadMore,
    loadPage,

    offset,
    pageSize,
    query,
    resetAndReload,

    tableRows,
    total,
    viewMode,
  };
}
