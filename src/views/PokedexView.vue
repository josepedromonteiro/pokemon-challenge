<template>
  <section class="wrap">
    <PokedexControls :select-store="selection" @on-remove="onRemove">
      <template #actions>
        <Button @click="onExport">Export CSV</Button>
      </template>
    </PokedexControls>
    <div class="flex items-center justify-between gap-8">
      <div class="flex-1">
        <PokedexProgress />
      </div>
      <ViewSwitchButton v-model="viewMode"></ViewSwitchButton>
    </div>
    <div class="content">
      <PokemonLayoutSwitcher
        v-model:view-mode="viewMode"
        :grid-items="gridItems"
        :table-rows="tableRows"
        :loading="loading"
        :selection-store="selection"
      />
    </div>
    <AlertDialog v-model:open="showExportDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Selection active</AlertDialogTitle>
          <AlertDialogDescription>
            You currently have the selection option active. Do you want to
            export the selected ({{ selection?.selected.value.size }}
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
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import PokedexControls from '@/components/pokedex/PokedexControls.vue';
import PokedexProgress from '@/components/pokedex/PokedexProgress.vue';
import ViewSwitchButton from '@/components/ViewSwitchButton.vue';
import { usePokemonViewer } from '@/composables/usePokemonViewer.ts';
import { useSelection } from '@/composables/useSelection.ts';
import { useViewMode } from '@/composables/useViewMode.ts';
import PokemonLayoutSwitcher from '@/layouts/PokemonLayoutSwitcher.vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/lib/ui/alert-dialog';
import { Button } from '@/lib/ui/button';
import { PokedexFilterService } from '@/services/pokedex-filter-service.ts';
import { usePokedexQuery } from '@/stores/pokedex-query.store.ts';
import { usePokedexViewStore } from '@/stores/pokedex-view.store.ts';
import { usePokedexStore } from '@/stores/pokedex.store.ts';

const UI_POKEDEX = 'ui:pokedex';

const pokedexViewStore = usePokedexViewStore();
const pokedexQuery = usePokedexQuery();
const pokedexStore = usePokedexStore();
const pokemonViewer = usePokemonViewer();
const { viewMode } = useViewMode({
  storageKey: UI_POKEDEX,
});
const { error, gridItems, loading, tableRows } = pokemonViewer;
const selection = useSelection();

const pokedexFilterService = new PokedexFilterService(
  () => pokedexStore.pokemons
);

const showExportDialog = ref(false);

const loadPokedex = async () => {
  loading.value = true;
  error.value = undefined;
  try {
    const result = await pokedexFilterService.list(pokedexQuery.query);
    pokemonViewer.setData(result.data);
  } catch {
    error.value = '';
  } finally {
    loading.value = false;
  }
};

const onRemove = () => {
  pokedexViewStore.removeItems(Array.from(selection.selected.value));
  selection.clear();
};

const onExport = () => {
  if (selection.selecting.value) {
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
  pokedexStore.exportCSV(Array.from(selection.selected.value ?? []));
  showExportDialog.value = false;
};

onMounted(() => {
  pokedexViewStore.init().then(() => {
    loadPokedex();
  });
});

watch(
  () => [pokedexStore.pokemonMap, pokedexQuery.query],
  () => {
    loadPokedex();
  },
  {
    immediate: true,
  }
);
</script>

<style scoped>
@reference "@/index.css";
@layer components {
  .wrap {
    @apply mx-auto max-w-6xl px-4 py-6;
  }

  .content {
    @apply px-4;
  }
}
</style>
