<template>
  <section class="wrap">
    <ControlsBar v-model="query" />

    <div class="mt-2 flex">
      <div v-if="!loading && !error" class="status">
        Showing <b>{{ gridItems.length }}</b> of <b>{{ total }}</b>
      </div>
      <ViewSwitchButton v-model="viewMode" />
    </div>

    <div v-if="error" class="error">
      <p class="text-sm">{{ error }}</p>
      <button class="btn" @click="resetAndReload">Retry</button>
    </div>

    <PokemonLayoutSwitcher
      v-model:view-mode="viewMode"
      :grid-items="gridItems"
      :table-rows="tableRows"
      :loading="loading"
    />

    <div v-if="!loading && !error && canLoadMore" class="pager">
      <Button variant="ghost" @click="loadMore">Load more</Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import ControlsBar from '@/components/ControlsBar.vue';
import { Button } from '@/components/ui/button';
import ViewSwitchButton from '@/components/ViewSwitchButton.vue';
import { useHomeView } from '@/composables/useHomeView';
import PokemonLayoutSwitcher from '@/layouts/PokemonLayoutSwitcher.vue';

const {
  canLoadMore,
  error,
  gridItems,
  loading,
  loadMore,
  loadPage,
  query,
  resetAndReload,
  tableRows,
  total,
  viewMode,
} = useHomeView();

onMounted(() => {
  loadPage();
});
</script>

<style scoped>
@reference "@/index.css";

@layer components {
  .tabs button {
    @apply cursor-pointer;
  }

  .wrap {
    @apply mx-auto max-w-6xl px-4 pb-6;
  }

  .status {
    @apply mt-3 flex-1 text-sm text-foreground/70;
  }

  .error {
    @apply mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3;
  }

  .btn {
    @apply mt-2 rounded-md bg-primary px-4 py-2 text-primary-foreground;
  }

  .pager {
    @apply mt-6 flex justify-center;
  }
}
</style>
