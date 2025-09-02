<template>
  <div class="table-wrap">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-if="selecting" class="w-8">
            <Checkbox
              :checked="allChecked"
              :indeterminate="someChecked && !allChecked"
              @update:checked="onToggleAll"
            />
          </TableHead>

          <TableHead v-for="col in columns" :key="col.key" :class="col.class">
            {{ col.label }}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody v-if="(!loading && rows.length) || pushing">
        <TableRow
          v-for="row in rows"
          :key="row.id"
          :class="[
            isSelected(row.id) ? 'bg-muted/40' : '',
            rowClickable
              ? 'cursor-pointer hover:bg-muted/30'
              : 'cursor-default',
          ]"
          @click="onRowClick(row)"
        >
          <TableCell
            v-if="selecting"
            class="w-8"
            @click.stop
            @mousedown.stop
            @keydown.stop
          >
            <Checkbox
              :model-value="isSelected(row.id)"
              @update:model-value="
                () => {
                  emit('toggle-select', row.id);
                }
              "
            />
          </TableCell>

          <TableCell
            v-for="col in columns"
            :key="col.key"
            :class="col.cellClass"
          >
            <slot
              :name="`cell.${col.key}`"
              :row="row"
              :value="row[col.key]"
              :col="col"
            >
              <span class="block truncate">
                {{ row[col.key] }}
              </span>
            </slot>
          </TableCell>
        </TableRow>
        <template v-if="showPushLoader">
          <TableRow v-for="i in 6" :key="'push-' + i">
            <TableCell :colspan="colspan" class="py-2">
              <div class="h-8 w-full animate-pulse rounded bg-muted/60"></div>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>

      <!--      Loaiding-->
      <TableBody v-else-if="loading">
        <TableRow v-for="i in 6" :key="i">
          <TableCell :colspan="colspan">
            <div class="h-8 w-full animate-pulse rounded bg-muted/60"></div>
          </TableCell>
        </TableRow>
      </TableBody>

      <!--      Empty-->
      <TableBody v-else>
        <TableRow>
          <TableCell
            :colspan="colspan"
            class="p-6 text-center text-sm text-foreground/60"
          >
            No items.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div
      v-if="pagination"
      class="sticky bottom-10 flex items-center justify-between gap-3 p-3"
    >
      <div class="text-xs text-foreground/70">
        Showing
        <b>{{ start + 1 }}</b
        >–<b>{{ end }}</b> of <b>{{ pagination.total }}</b>
      </div>

      <Pagination
        v-slot="{ page: inner }"
        :items-per-page="pagination.pageSize"
        :total="pagination.total"
        :default-page="page"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious
            :disabled="loading || page <= 1"
            @click="goToPage(page - 1)"
          />

          <template v-for="(item, i) in items" :key="i">
            <PaginationItem
              v-if="item.type === 'page'"
              :value="item.value"
              :is-active="item.value === inner"
              @click="goToPage(item.value)"
            >
              {{ item.value }}
            </PaginationItem>

            <PaginationEllipsis v-else :index="i" />
          </template>

          <PaginationNext
            :disabled="loading || page >= totalPages"
            @click="goToPage(page + 1)"
          />
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Checkbox } from '@/lib/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/lib/ui/pagination';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/lib/ui/table';

// TODO - Move type declarations
export interface DynamicTableProps {
  rows: DynamicRow[];
  columns: DynamicColumn[];
  selecting?: boolean;
  selected?: number[] | Set<number>;
  loading?: boolean;
  pushing?: boolean;
  rowClickable?: boolean;
  pagination?: {
    pageSize: number;
    total: number;
  };
  page?: number;
}

export type DynamicColumn = {
  key: string;
  label: string;
  class?: string;
  cellClass?: string;
};

export type DynamicRow = { id: number } & Record<string, unknown>;

const props = defineProps<DynamicTableProps>();

const emit = defineEmits<{
  (e: 'toggle-select', id: number): void;
  (e: 'toggle-all', ids: number[] | null): void;
  (e: 'row-click', rowData: DynamicRow): void;
  (e: 'update:page', value: number): void;
  (e: 'page-change', payload: { page: number; pageSize: number }): void;
}>();

const selecting = computed(() => !!props.selecting);
const loading = computed(() => !!props.loading);
const rowClickable = computed(() => props.rowClickable ?? true);
const showPushLoader = computed(() => props.pushing);
const selectedSet = computed(() => {
  const v = props.selected;
  if (!v) return new Set<number>();
  return v instanceof Set ? v : new Set(v);
});
const rowIds = computed(() => props.rows?.map((r) => r.id) ?? []);
const allChecked = computed(
  () =>
    rowIds.value.length > 0 &&
    rowIds.value.every((id) => selectedSet.value.has(id))
);
const someChecked = computed(() =>
  rowIds.value.some((id) => selectedSet.value.has(id))
);
const colspan = computed(
  () => (selecting.value ? 1 : 0) + (props.columns?.length ?? 0)
);

const page = computed(() => props?.page ?? 0);
const pageSize = computed(() => props.pagination?.pageSize ?? 0);
const total = computed(() => props.pagination?.total ?? 0);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value))
);
const start = computed(() => (page.value - 1) * pageSize.value);
const end = computed(() =>
  Math.min(start.value + props.rows.length, total.value)
);

const goToPage = (p: number) => {
  const clamped = Math.max(1, Math.min(totalPages.value, p));
  if (clamped === page.value) return;
  emit('update:page', clamped);
  emit('page-change', { page: clamped, pageSize: pageSize.value });
};

const isSelected = (id: number) => {
  return selectedSet.value.has(id);
};

const onRowClick = (data: DynamicRow) => {
  emit('row-click', data);
};

const onToggleAll = (checked: boolean) => {
  if (checked) {
    emit('toggle-all', rowIds.value);
  } else {
    emit('toggle-all', null);
  }
};
</script>

<style scoped>
@reference "@/index.css";
@layer components {
  .table-wrap {
    @apply w-full overflow-x-auto rounded-lg border border-border/50 bg-card/70 backdrop-blur;
  }
}
</style>
