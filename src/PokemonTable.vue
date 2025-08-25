<template>
  <!--  <div class="flex items-center gap-2 mb-2">-->
  <!--    <Button @click="toggleSelecting">{{ selecting ? 'Cancel' : 'Select' }}</Button>-->
  <!--  </div>-->

  <DynamicTable
      :columns="COLUMNS"
      :rows="items"
      :loading="loading"
      :selecting="selecting"
      :selected="selected"
      :pushing="pushing"
      @toggle-select="toggleSelect"
      @toggle-all="ids => ids ? selectAll(ids) : clear()"
      @rowClick="onRowClick"
  >
    <!-- Custom cells -->
    <template #cell.sprite="{ value, row }">
      <img :src="value" :alt="row.name" class="h-10 w-10 object-contain "
           @error="e => (e.target as HTMLImageElement).src = value"/>
    </template>

    <template #cell.name="{ value, row }">
      <RouterLink :to="`/pokemon/${row.id}`" class="hover:underline capitalize">{{ value }}</RouterLink>
      <div class="text-xs text-foreground/60">#{{ row.id }}</div>
    </template>

    <template #cell.caughtAt="{ value }">
      <span class="text-sm">{{ value ? new Date(value).toLocaleString() : '--' }}</span>
    </template>

    <template #cell.actions="{ row }">
      <Button size="xs" :variant="isCaught(row.id)  ? 'secondary' : 'default'" @click.stop="toggle({id: row.id})">{{
          isCaught(row.id) ? 'Release' : 'Catch'
        }}
      </Button>
    </template>
  </DynamicTable>
</template>

<script setup lang="ts">
import {Button} from "@/components/ui/button";
import DynamicTable, {type DynamicColumn} from "@/components/DynamicTable.vue";
import {useSelection} from "@/composables/useSelection.ts";
import {type TableRowData} from "@/models/poke.ui.ts";
import {usePokedex} from "@/composables/usePokedex.ts";
import {useRouter} from "vue-router";

const router = useRouter();
const {selecting, selected, toggleSelect, selectAll, clear} = useSelection();
const {isCaught, toggle} = usePokedex();


const COLUMNS: DynamicColumn[] = [
  {key: 'sprite', label: '', class: 'w-14 min-w-[56px] shrink-0'},
  {key: 'name', label: 'Name'},
  {key: 'hp', label: 'HP'},
  {key: 'attack', label: 'Attack'},
  {key: 'defense', label: 'Defense'},
  {key: 'specialAttack', label: 'Special attack'},
  {key: 'specialDefense', label: 'Special defense'},
  {key: 'speed', label: 'Speed'},
  {key: 'height', label: 'Height'},
  {key: 'weight', label: 'Weight'},
  {key: 'caughtAt', label: 'Caught', class: 'l'},
  {key: 'actions', label: '', class: 'text-center', cellClass: 'text-center'},
]

defineProps<{
  items: TableRowData[];
  loading?: boolean;
  pushing?: boolean;
}>();

const onRowClick = (row: TableRowData) => {
  router.push(`/pokemon/${row.id}`);
};
</script>
