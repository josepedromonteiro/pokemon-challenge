// composables/useHomeView.ts
import {ref, computed} from 'vue';
import type {DeepPartial} from '@/types/deep-partial';
import type {PokemonDetail} from '@/models/api/pokemon-detail.api';
import {pokeApiService} from '@/services/pokemon-api-service';
import {toGridItem} from '@/utils/pokeui.utils';
import {type GridItemData, mapToTableRowData, type TableRowData, type ViewMode} from '@/models/poke-ui';
import {usePokedexStore} from '@/stores/pokedex.store';
import {useUI} from '@/stores/ui.store';

export function useHomeView() {

    const ui = useUI();
    const {pokemonById, isCaught} = usePokedexStore();

    const details = ref<DeepPartial<PokemonDetail>[]>([]);
    const total = ref(0);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const pageSize = ref(50);
    const offset = ref(0);
    const query = ref('');

    // view mode lives in UI store (shared across pages if you want)
    const viewMode = computed<ViewMode>({
        get: () => ui.viewMode,
        set: (m) => ui.setViewMode(m),
    });


    async function loadPage({replace = false} = {}) {

        loading.value = true;
        error.value = null;

        try {
            const page = await pokeApiService.getPokemonPageWithDetails(
                pageSize.value,
                offset.value,
                {concurrency: 8, ignoreErrors: true}
            );

            total.value = page.count ?? 0;
            const items = (page.results ?? []).filter(Boolean) as DeepPartial<PokemonDetail>[];
            details.value = replace ? items : [...details.value, ...items];
        } catch (e: any) {
            if (e?.name !== 'AbortError') {
                error.value = 'Failed to load Pokémon.';
            }
        } finally {
            loading.value = false;
        }
    }

    function resetAndReload() {
        offset.value = 0;
        return loadPage({replace: true});
    }

    function loadMore() {
        offset.value += pageSize.value;
        return loadPage();
    }

    const filtered = computed(() => {
        const q = query.value.trim().toLowerCase();
        if (!q) return details.value;
        return details.value.filter(
            (d) => (d.name ?? '').toLowerCase().includes(q) || String(d.id ?? '') === q
        );
    });

    // mappings for UI
    const gridItems = computed<GridItemData[]>(() => filtered.value.map(toGridItem));

    const tableRows = computed<TableRowData[]>(() =>
        filtered.value.map((d) =>
            mapToTableRowData(d, {
                isCaught: isCaught(d.id!),
                caughtAt: pokemonById(d.id!)?.caughtAt,
            })
        )
    );

    const canLoadMore = computed(() => details.value.length < total.value);

    return {
        details,
        total,
        loading,
        error,
        pageSize,
        offset,
        query,
        viewMode,

        filtered,
        gridItems,
        tableRows,
        canLoadMore,

        loadPage,
        resetAndReload,
        loadMore,
    };
}
