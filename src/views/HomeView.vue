<template>
  <section class="wrap">
    <ControlsBar v-model="query"/>

    <div class="flex mt-2">
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
      <p class="text-sm">Failed to load Pokémon (status {{ error.status }}).</p>
      <button class="btn" @click="reload">Retry</button>
    </div>

    <PokemonListLayout
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
import {onMounted, reactive, ref, computed} from 'vue'
import {pokeApiService} from '@/services/pokeapi'
import PokemonListLayout from '@/layouts/PokemonListLayout.vue'
import {Tabs, TabsTrigger, TabsList} from '@/components/ui/tabs'
import {GridIcon, TableIcon} from 'lucide-vue-next'
import ControlsBar from '@/components/ControlsBar.vue'
import {Button} from '@/components/ui/button'
import { type GridItemData, type TableRowData, toGridItem, mapToTableRowData} from '@/models/poke.ui'
import type {DeepPartial} from '@/models/utils/deep-partial'
import type {PokemonDetail} from '@/models/api/pokemon-detail.api'
import {usePokedex} from '@/composables/usePokedex'
import {useUI} from "@/stores/ui.store.ts"; // your caught store

const ui = useUI();
const {load: loadPokedex, pokemonById, isCaught} = usePokedex()

const INITIAL_LIMIT = 50
const PAGE_SIZE = 50

const state = reactive({limit: INITIAL_LIMIT, offset: 0, count: 0})
const loading = ref(false)
const error = ref<{ status: number; message?: string } | null>(null)

// Single source of truth: details (can be DeepPartial because of ignoreErrors)
const details = ref<DeepPartial<PokemonDetail>[]>([])


const viewMode = computed({
  get: () => ui.viewMode,
  set: (m) => ui.setViewMode(m),
})

const query = ref('')

// caught meta (adjust to your store shape)


const captureOf = (id: number) => ({
  isCaught: isCaught.value(id),
  caughtAt: pokemonById(id).value?.caughtAt
})

async function fetchDetailsPage(limit: number, offset: number) {
  loading.value = true
  error.value = null
  try {
    const page = await pokeApiService.getPokemonPageWithDetails(limit, offset, {
      concurrency: 8,
      ignoreErrors: true
    })
    state.count = page.count ?? 0
    const newItems = (page.results ?? []).filter(Boolean) as DeepPartial<PokemonDetail>[]

    if (offset === 0) details.value = newItems
    else details.value = [...details.value, ...newItems]
  } catch (e: any) {
    error.value = {status: e?.status || 500, message: e?.message}
  } finally {
    loading.value = false
  }
}

const filteredDetails = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return details.value
  return details.value.filter(d =>
      (d.name ?? '').toLowerCase().includes(q) || String(d.id ?? '').toLowerCase() === q
  )
})

const gridItems = computed<GridItemData[]>(() =>
    filteredDetails.value.map(toGridItem)
)

const tableRows = computed<TableRowData[]>(() =>
    filteredDetails.value.map(d => mapToTableRowData(d, captureOf(d.id!)))
)

const canLoadMore = computed(() => details.value.length >= state.limit)

async function loadMore() {
  state.offset += state.limit === 0 ? PAGE_SIZE : state.limit
  state.limit = PAGE_SIZE
  await fetchDetailsPage(state.limit, state.offset)
}

function reload() {
  state.offset = 0
  state.limit = INITIAL_LIMIT
  fetchDetailsPage(state.limit, state.offset)
}

onMounted(async () => {
  await loadPokedex() // preload caught info if you need it
  fetchDetailsPage(state.limit, state.offset)
})
</script>
<style>
@reference "@/index.css";

@layer components {

  .tabs button {
    @apply cursor-pointer;
  }

  .wrap {
    @apply mx-auto max-w-6xl px-4 py-6;
  }

  .status {
    @apply mt-3 text-sm text-foreground/70 flex-1;
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
