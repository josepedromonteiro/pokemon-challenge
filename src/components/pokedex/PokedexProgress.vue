<template>
  <div v-if="total > 0" class="progress">
    <div class="progress-top">
      <span class="text-sm">Your Progress</span>
      <span class="text-sm font-medium">
        {{ caught }}/{{ total }} ({{ percent.toFixed(1) }}%)
      </span>
    </div>
    <ProgressBar :value="percent" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import ProgressBar from '@/components/ProgressBar.vue';
import { pokeApiService } from '@/services/pokemon-api-service.ts';
import { usePokedexStore } from '@/stores/pokedex.store.ts';

const { pokemons } = usePokedexStore();

const caught = computed(() => pokemons.length);

const total = ref(0);
const percent = computed(() =>
  total.value > 0 ? (caught.value / total.value) * 100 : 0
);

const setupTotal = async () => {
  if (!total.value) {
    try {
      total.value = await pokeApiService.getPokemonCount();
    } catch {
      total.value = 0;
    }
  }
};

onMounted(async () => {
  setupTotal();
});
</script>

<style scoped>
@reference "@/index.css";
@layer components {
  .progress {
    @apply mt-3 mb-4;
  }

  .progress-top {
    @apply mb-1 flex items-center justify-between text-foreground/80;
  }
}
</style>
