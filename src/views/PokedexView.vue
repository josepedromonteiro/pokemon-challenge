<template>
  <section class="wrap">
    <PokedexControls />
    <PokedexProgress />
    <div class="content">
      <PokedexGrid />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import PokedexControls from '@/components/pokedex/PokedexControls.vue';
import PokedexGrid from '@/components/pokedex/PokedexGrid.vue';
import PokedexProgress from '@/components/pokedex/PokedexProgress.vue';
import { usePokedexViewStore } from '@/stores/pokedex-view.store.ts';

const store = usePokedexViewStore();
onMounted(() => {
  store.init();
});
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
