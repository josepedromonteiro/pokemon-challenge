<template>
  <div class="grid">
    <PokemonCard
      v-for="p in filtered"
      :key="p.id"
      :id="p.id"
      :name="p.name"
      :image="p.image"
      :caught="true"
      :selecting="selecting"
      :selected="store.isSelected(p.id)"
      @onSelect="store.toggleSelected(p.id)"
      @toggle-caught="toggle({ id: p.id })"
    />
    <template v-if="loading">
      <GridLoaderContent />
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePokedexViewStore } from '@/stores/pokedex-view.store.ts';
import PokemonCard from '@/components/PokemonCard.vue';
import { ref, watch } from 'vue';
import { PokedexFilterService } from '@/services/pokedex-filter-service.ts';
import type { PokedexEntry } from '@/models/pokedex.ts';
import GridLoaderContent from '@/components/GridLoaderContent.vue';
import { usePokedexQuery } from '@/stores/pokedex-query.store.ts';
import { usePokedexStore } from '@/stores/pokedex.store.ts';

const store = usePokedexViewStore();
const pokedexQuery = usePokedexQuery();
const pokedexStore = usePokedexStore();

const pokedexFilterService = new PokedexFilterService(
  () => pokedexStore.pokemons
);

const loading = ref(false);
const error = ref(false);
const filtered = ref<PokedexEntry[]>([]);
const { selecting } = storeToRefs(store);
const { toggle } = store;

const loadPokedex = async () => {
  loading.value = true;
  error.value = false;
  try {
    const result = await pokedexFilterService.list(pokedexQuery.query);
    filtered.value = result.data;
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

watch(
  () => pokedexStore.pokemonMap,
  () => {
    loadPokedex();
  }
);

watch(
  () => pokedexQuery.query,
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
  .grid {
    @apply mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4;
  }
}
</style>
