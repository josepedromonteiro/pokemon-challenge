<script setup lang="ts">
import PokemonGrid from '@/components/PokemonGrid.vue';
import type { GridItemData, TableRowData, ViewMode } from '@/models/poke-ui.ts';
import PokemonTable from '@/components/PokemonTable.vue';

export interface PokemonLayoutSwitcherProps {
  viewMode: ViewMode;
  gridItems?: GridItemData[];
  tableRows?: TableRowData[];
  loading: boolean;
  error?: string | null;
}
const props = defineProps<PokemonLayoutSwitcherProps>();

const emit = defineEmits<{
  (e: 'load-more', mode: 'grid' | 'table'): void;
  (e: 'update:viewMode', value: ViewMode): void;
}>();
</script>

<template>
  <section class="list-wrapper">
    <p v-if="error" class="error">{{ error }}</p>

    <PokemonGrid
      v-if="props.viewMode === 'grid'"
      :items="props.gridItems ?? []"
      :loading="loading"
      @load-more="() => emit('load-more', 'grid')"
    />
    <PokemonTable
      v-else
      :items="props.tableRows ?? []"
      :pushing="loading"
      @load-more="() => emit('load-more', 'table')"
    />
  </section>
</template>

<style>
@reference "@/index.css";

@layer components {
  .list-wrapper {
    @apply py-4;
  }
}
</style>
