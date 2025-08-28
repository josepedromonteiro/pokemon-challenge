<!--TODO - Improve this typing:rows="items as  unknown as DynamicRow[]"-->
<template>
  <DynamicTable
    :columns="COLUMNS"
    :rows="items as unknown as DynamicRow[]"
    :loading="loading"
    :selecting="selecting"
    :selected="selected"
    :pushing="pushing"
    row-clickable
    @toggle-select="toggleSelect"
    @toggle-all="(ids) => (ids ? selectAll(ids) : clear())"
    @row-click="onRowClick"
  >
    <template #cell.sprite="{ value, row }">
      <img
        :src="value as string"
        :alt="row.name as string"
        class="h-10 w-10 object-contain"
        @error="(e) => ((e.target as HTMLImageElement).src = value as string)"
      />
    </template>

    <template #cell.name="{ value, row }">
      <RouterLink :to="`/pokemon/${row.id}`" class="capitalize hover:underline">
        {{ value }}
      </RouterLink>
      <div class="text-xs text-foreground/60">#{{ row.id }}</div>
    </template>

    <template #cell.types="{ value }">
      <div class="flex flex-wrap gap-1">
        <span
          v-for="t in value as string[]"
          :key="t"
          class="inline-flex items-center rounded-full border border-border/50 px-2 py-0.5 text-xs capitalize"
        >
          {{ t }}
        </span>
      </div>
    </template>

    <template #cell.caughtAt="{ value }">
      <span class="text-sm">
        {{ value ? new Date(value as string).toLocaleString() : '--' }}
      </span>
    </template>

    <template #cell.actions="{ row }">
      <Button
        size="xs"
        :variant="isCaught(row.id) ? 'secondary' : 'default'"
        @click.stop="toggle({ id: row.id })"
      >
        {{ isCaught(row.id) ? 'Release' : 'Catch' }}
      </Button>
    </template>
  </DynamicTable>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import DynamicTable, { type DynamicRow } from '@/components/DynamicTable.vue';
import { Button } from '@/components/ui/button';
import { useSelection } from '@/composables/useSelection.ts';
import { COLUMNS } from '@/configs/pokemon-table.ts';
import { type TableRowData } from '@/models/poke-ui.ts';
import { usePokedexStore } from '@/stores/pokedex.store.ts';

const router = useRouter();
const { clear, selectAll, selected, selecting, toggleSelect } = useSelection();
const { isCaught, toggle } = usePokedexStore();

defineProps<{
  items: TableRowData[];
  loading?: boolean;
  pushing?: boolean;
}>();

const onRowClick = (row: TableRowData) => {
  router.push(`/pokemon/${row.id}`);
};
</script>

<!--This style well be applied gloabally since .sticky-col is applied inside the Dynamic table component-->
<style>
@reference "@/index.css";
@layer components {
  .sticky-col {
    @apply sticky z-[1] bg-background;
  }
}
</style>
