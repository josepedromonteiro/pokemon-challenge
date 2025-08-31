<template>
  <div class="grid">
    <PokemonCard
      v-for="p in items"
      :id="p.id"
      :key="p.id"
      :selecting="selectionStore?.selecting.value"
      :selected="selectionStore?.isSelected(p.id)"
      :name="p.name"
      :image="p.sprite"
      :caught="isCaught(p.id)"
      @on-select="selectionStore?.toggleSelect(p.id)"
      @toggle-caught="toggle({ id: p.id })"
    />
    <template v-if="loading">
      <GridLoaderContent />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { useSelection } from '@/composables/useSelection.ts';
import type { GridItemData } from '@/models/poke-ui.ts';

import GridLoaderContent from '@/components/GridLoaderContent.vue';
import { usePokedexStore } from '@/stores/pokedex.store.ts';

import PokemonCard from './PokemonCard.vue';

defineProps<{
  items: GridItemData[];
  loading: boolean;
  selectionStore?: ReturnType<typeof useSelection<number>>;
}>();

defineEmits<{ (e: 'toggle-caught', id: number): void }>();

const { isCaught, toggle } = usePokedexStore();
</script>

<style scoped>
@reference "@/index.css";

@layer components {
  .grid {
    @apply grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4;
  }
}
</style>
