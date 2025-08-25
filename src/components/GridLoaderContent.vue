<template>
  <div v-for="i in items" :key="i" class="skeleton"></div>
</template>

<style>
@reference "@/index.css";
@layer components {
  .skeleton {
    @apply h-36 animate-pulse rounded-lg border border-border/50 bg-muted/40 p-3;
  }
}
</style>
<script setup lang="ts">
withDefaults(defineProps<{
  items?: number
}>(), {
  items: 10
});
</script>
