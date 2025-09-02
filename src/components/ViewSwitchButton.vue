<template>
  <Tabs v-model="model" class="tabs">
    <TabsList>
      <TabsTrigger value="grid">
        <GridIcon />
      </TabsTrigger>
      <TabsTrigger value="table">
        <TableIcon />
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>

<script setup lang="ts">
import type { ViewMode } from '@/models/poke-ui.ts';

import { GridIcon, TableIcon } from 'lucide-vue-next';

import { Tabs, TabsList, TabsTrigger } from '@/lib/ui/tabs';

const model = defineModel<ViewMode>();
</script>

<style scoped>
@reference "@/index.css";

@layer components {
  .tabs button {
    @apply cursor-pointer;
  }
}
</style>
