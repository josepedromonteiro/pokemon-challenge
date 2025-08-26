<template>
  <div class="stat-bar">
    <div class="stat-fill" :style="{ width: clamped + '%' }" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number; // Between 0-100
}>();

const clamped = computed(() => Math.min(100, Math.max(0, props.value)));
</script>

<style scoped>
@reference "@/index.css";
.stat-bar {
  @apply h-2 w-full overflow-hidden rounded bg-muted/40;
}

.stat-fill {
  @apply h-full rounded bg-primary transition-all duration-300;
}
</style>
