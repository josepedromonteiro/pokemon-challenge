<template>
  <div class="toolbar controls">
    <div class="controls-left">
      <h1 class="controls-title">My Pokédex</h1>
      <p class="controls-meta" v-if="nEntries">
        Caught: <b>{{ nEntries }}</b>
      </p>
    </div>

    <div class="controls-right">
      <Input
        v-model.trim="nameModel"
        type="search"
        placeholder="Search"
        class="w-56"
      />

      <MultiSelect
        v-model="selectedTypes"
        :options="typeOptions"
        placeholder="Filter by types"
        class="w-56"
        @done="onSelectTypes"
      />

      <Select v-model="sort">
        <SelectTrigger>
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="(label, key) in AVAILABLE_SORT_OPTIONS"
            :key="key"
            :value="key"
          >
            {{ label }}
          </SelectItem>
          <SelectItem key="clear" :value="null"> Clear</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="secondary" @click="pokedexViewStore.toggleSelecting">
        {{ selecting ? 'Cancel' : 'Select' }}
      </Button>

      <Button
        variant="secondary"
        :disabled="selected.size === 0"
        @click="pokedexViewStore.removeSelected"
      >
        Remove ({{ selected.size }})
      </Button>

      <Button @click="onExport">Export CSV</Button>
    </div>
  </div>

  <AlertDialog v-model:open="showExportDialog">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Selection active</AlertDialogTitle>
        <AlertDialogDescription>
          You currently have the selection option active. Do you want to export
          the selected ({{ selected.size }}
          pokémons) ? Or all of your Pokédex ?
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogAction size="sm" @click="exportFull"
          >Export Full Pokédex</AlertDialogAction
        >
        <AlertDialogAction size="sm" @click="exportSelected"
          >Export Selected Pokémons</AlertDialogAction
        >
        <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Button } from '@/components/ui/button';
import { usePokedexViewStore } from '@/stores/pokedex-view.store.ts';
import { type OrderByFields } from '@/services/pokedex-filter-service.ts';
import { computed, onMounted, ref, watch } from 'vue';

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import MultiSelect from '@/components/MultiSelect.vue';
import { Input } from '@/components/ui/input';
import { pokeApiService } from '@/services/pokemon-api-service.ts';
import { usePokedexQuery } from '@/stores/pokedex-query.store.ts';
import { usePokedexStore } from '@/stores/pokedex.store.ts';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

const AVAILABLE_SORT_OPTIONS: Record<OrderByFields, string> = {
  'height-asc': 'Height ↑',
  'height-desc': 'Height ↓',
  oldest: 'Oldest',
  newest: 'Newest',
};

const pokedexViewStore = usePokedexViewStore();
const { selecting, selected } = storeToRefs(pokedexViewStore);

const pokedexQuery = usePokedexQuery();
const pokedexStore = usePokedexStore();

const sort = ref<OrderByFields | undefined>(undefined);
const showExportDialog = ref(false);
const allTypes = ref<string[]>([]);
const selectedTypes = ref<string[]>(
  (pokedexQuery.filter?.types as string[]) ?? []
);

const nameModel = computed<string>({
  get: () => (pokedexQuery.filter?.name ?? '') as string,
  set: (val: string) => {
    pokedexQuery.setFilter('name', val || undefined);
  },
});

const typeOptions = computed(() =>
  allTypes.value.map((t) => ({ label: t, value: t }))
);
const nEntries = computed(() => pokedexStore.pokemons.length);

const onSelectTypes = () => {
  pokedexQuery.setFilter('types', selectedTypes.value);
};

const setupTypes = () => {
  pokeApiService.getPokemonTypes().then((res) => {
    allTypes.value = res.results.map((type) => type.name);
  });
};

const onExport = () => {
  if (selecting) {
    showExportDialog.value = true;
  } else {
    exportFull();
  }
};

const exportFull = () => {
  pokedexStore.exportCSV();
  showExportDialog.value = false;
};

const exportSelected = () => {
  pokedexStore.exportCSV(Array.from(selected.value));
  showExportDialog.value = false;
};

onMounted(() => {
  setupTypes();
});

watch(sort, () => {
  pokedexQuery.setOrderBy(sort.value);
});

watch(
  selectedTypes,
  (v) => {
    pokedexQuery.setFilter('types', v.length ? v : undefined);
  },
  { immediate: true }
);
</script>

<style scoped>
@reference "@/index.css";
@layer components {
  .controls {
    @apply flex flex-col gap-3 md:flex-row md:items-center md:justify-between;
  }

  .controls-left {
    @apply flex items-baseline gap-3;
  }

  .controls-title {
    @apply text-xl font-semibold;
  }

  .controls-meta {
    @apply text-sm text-foreground/70;
  }

  .controls-right {
    @apply flex flex-wrap items-center gap-2;
  }
}
</style>
