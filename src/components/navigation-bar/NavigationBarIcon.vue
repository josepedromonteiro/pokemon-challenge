<template>
  <span v-if="isString">{{ icon }}</span>
  <component :is="icon" v-else-if="isComponent" />
  <img
    v-else-if="isImage"
    :src="(icon as TabIconImage).src"
    :alt="(icon as TabIconImage).alt || ''"
  />
</template>

<script lang="ts" setup>
import type { TabIcon, TabIconImage } from '@/models/toolbar.ts';

import { computed } from 'vue';

const props = defineProps<{ icon: TabIcon }>();

const isString = computed(() => typeof props.icon === 'string');
const isComponent = computed(() => typeof props.icon === 'function');
const isImage = computed(
  () => typeof props.icon === 'object' && props.icon.type === 'image'
);
</script>

<style scoped>
@reference "@/index.css";

@layer components {
  img {
    @apply h-6 w-6;
  }
}
</style>
