<template>
  <section class="wrap">
    <PokedexControls/>
    <PokedexGrid/>
  </section>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import PokedexControls from '@/components/pokedex/PokedexControls.vue'
import {usePokedexView} from "@/stores/pokedex.store.ts";
import PokedexGrid from "@/components/pokedex/PokedexGrid.vue";

const store = usePokedexView()
onMounted(() => {
  store.init();
});
</script>

<style>
@reference "@/index.css";
@layer components {
  .wrap {
    @apply mx-auto max-w-6xl px-4 py-6;
  }
}
</style>
