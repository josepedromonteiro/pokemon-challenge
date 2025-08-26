<template>
  <section class="wrap">
    <ControlsBar v-model="query"/>

    <div class="mt-2 flex">
      <div class="status" v-if="!loading && !error">
        Showing <b>{{ gridItems.length }}</b> of <b>{{ state.count }}</b>
      </div>
      <Tabs class="tabs" v-model="viewMode">
        <TabsList>
          <TabsTrigger value="grid">
            <GridIcon/>
          </TabsTrigger>
          <TabsTrigger value="table">
            <TableIcon/>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <div v-if="error" class="error">
      <p class="text-sm">Failed to load Pokémon.</p>
      <button class="btn" @click="reload">Retry</button>
    </div>

    <PokemonLayoutSwitcher
        v-model:view-mode="viewMode"
        :grid-items="gridItems"
        :table-rows="tableRows"
        :loading="loading"
    />

    <div v-if="!loading && !error && canLoadMore" class="pager">
      <Button variant="ghost" @click="loadMore">Load more</Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, computed} from 'vue';
import {pokeApiService} from '@/services/pokemon-api-service.ts';
import PokemonLayoutSwitcher from '@/layouts/PokemonLayoutSwitcher.vue';
import {Tabs, TabsTrigger, TabsList} from '@/components/ui/tabs';
import {GridIcon, TableIcon} from 'lucide-vue-next';
import ControlsBar from '@/components/ControlsBar.vue';
import {Button} from '@/components/ui/button';
import {
  type GridItemData,
  type TableRowData,
  mapToTableRowData,
} from '@/models/poke-ui.ts';
import type {PokemonDetail} from '@/models/api/pokemon-detail.api';
import {useUI} from '@/stores/ui.store.ts';
import type {DeepPartial} from '@/types/deep-partial.ts';
import {toGridItem} from '@/utils/pokeui.utils.ts';
import {usePokedexStore} from '@/stores/pokedex.store.ts';

const ui = useUI();
const {pokemonById, isCaught} = usePokedexStore();

const INITIAL_LIMIT = 50;
const PAGE_SIZE = 50;

const state = reactive({limit: INITIAL_LIMIT, offset: 0, count: 0});
const loading = ref(false);
const error = ref<{ message?: string } | null>(null);

const details = ref<DeepPartial<PokemonDetail>[]>([]);

const viewMode = computed({
  get: () => ui.viewMode,
  set: (m) => ui.setViewMode(m),
});

const query = ref('');

const captureOf = (id: number) => ({
  isCaught: isCaught(id),
  caughtAt: pokemonById(id)?.caughtAt,
});

const fetchDetailsPage = async (limit: number, offset: number) => {
  loading.value = true;
  error.value = null;
  try {
    const page = await pokeApiService.getPokemonPageWithDetails(limit, offset, {
      concurrency: 8,
      ignoreErrors: true,
    });
    state.count = page.count ?? 0;
    const newItems = (page.results ?? []).filter(
        Boolean
    ) as DeepPartial<PokemonDetail>[];

    if (offset === 0) details.value = newItems;
    else details.value = [...details.value, ...newItems];
  } catch {
    error.value = {message: 'An error occurred'};
  } finally {
    loading.value = false;
  }
}

const filteredDetails = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return details.value;
  return details.value.filter(
      (d) =>
          (d.name ?? '').toLowerCase().includes(q) ||
          String(d.id ?? '').toLowerCase() === q
  );
});

const gridItems = computed<GridItemData[]>(() =>
    filteredDetails.value.map(toGridItem)
);

const tableRows = computed<TableRowData[]>(() =>
    filteredDetails.value.map((d) => mapToTableRowData(d, captureOf(d.id!)))
);

const canLoadMore = computed(() => details.value.length >= state.limit);

async
const loadMore = () => {
  state.offset += state.limit === 0 ? PAGE_SIZE : state.limit;
  state.limit = PAGE_SIZE;
  await fetchDetailsPage(state.limit, state.offset);
}

const reload = () => {
  state.offset = 0;
  state.limit = INITIAL_LIMIT;
  fetchDetailsPage(state.limit, state.offset);
}

onMounted(async () => {
  fetchDetailsPage(state.limit, state.offset);
});
</script>
<style scoped>
@reference "@/index.css";

@layer components {
  .tabs button {
    @apply cursor-pointer;
  }

  .wrap {
    @apply mx-auto max-w-6xl px-4 pb-6;
  }

  .status {
    @apply mt-3 flex-1 text-sm text-foreground/70;
  }

  .error {
    @apply mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3;
  }

  .btn {
    @apply mt-2 rounded-md bg-primary px-4 py-2 text-primary-foreground;
  }

  .pager {
    @apply mt-6 flex justify-center;
  }
}
</style>
