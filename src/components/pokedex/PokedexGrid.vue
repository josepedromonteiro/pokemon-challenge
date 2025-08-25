<!-- src/components/PokemonGrid.vue -->
<template>
  <div class="grid">
    <template v-if="loading && filtered.length === 0">
      <GridLoaderContent/>
    </template>

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
        @toggle-caught="toggle({id: p.id})"
    />
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {usePokedexView} from "@/stores/pokedex.store.ts";
import PokemonCard from "@/components/PokemonCard.vue";
import {pokedexQuery} from "@/composables/useListQuery.ts";
import {ref, watch} from "vue";
import {PokedexFilterService} from "@/services/filter-service.local.ts";
import type {PokedexEntry} from "@/models/pokedex.ts";
import GridLoaderContent from "@/components/GridLoaderContent.vue";

const pokedexFilterService = new PokedexFilterService();

const loading = ref(false);
const error = ref(false);
const filtered = ref<PokedexEntry[]>([]);
const store = usePokedexView()
const {selecting} = storeToRefs(store)
const {toggle} = store;


const loadPokedex = async () => {
  loading.value = true;
  error.value = false;
  try {
    const result = await pokedexFilterService.list(pokedexQuery.query.value);
    filtered.value = result.data;
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
};


watch(() => store.entries, () => {
  loadPokedex();
});

watch(pokedexQuery.query, () => {
  loadPokedex();
}, {
  immediate: true
})
</script>

<style>
@reference "@/index.css";
@layer components {
  .grid {
    @apply mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4;
  }
}
</style>
