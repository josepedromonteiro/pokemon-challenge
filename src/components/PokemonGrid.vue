<template>
  <div class="grid">
    <template v-if="loading && items.length === 0">
      <GridLoaderContent/>
    </template>

    <PokemonCard
        v-for="p in items"
        :key="p.id"
        :id="p.id"
        :name="p.name"
        :image="p.image"
        :caught="isCaught(p.id)"
        @toggle-caught="$emit('toggle-caught', p.id)"
    />
  </div>
</template>

<script setup lang="ts">
import PokemonCard from './PokemonCard.vue'
import {usePokedex} from '@/composables/usePokedex'
import GridLoaderContent from "@/components/GridLoaderContent.vue";
import type {GridItemData} from "@/models/poke.ui.ts";

defineProps<{
  items: GridItemData[]
  loading: boolean
}>()

defineEmits<{ (e: 'toggle-caught', id: number): void }>()

const {isCaught} = usePokedex()
</script>

<style>
@reference "@/index.css";

@layer components {
  .grid {
    @apply mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4;
  }
}
</style>
