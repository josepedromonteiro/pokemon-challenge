<template>
  <div class="grid">
    <PokemonCard
      v-for="p in items"
      :key="p.id"
      :id="p.id"
      :name="p.name"
      :image="p.image"
      :caught="isCaught(p.id)"
      @toggle-caught="toggle({ id: p.id })"
    />
    <template v-if="loading">
      <GridLoaderContent />
    </template>
  </div>
</template>

<script setup lang="ts">
import PokemonCard from './PokemonCard.vue';
import GridLoaderContent from '@/components/GridLoaderContent.vue';
import type { GridItemData } from '@/models/poke-ui.ts';
import { usePokedexStore } from '@/stores/pokedex.store.ts';

defineProps<{
  items: GridItemData[];
  loading: boolean;
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
