<!-- src/components/pokedex/PokedexControls.vue -->
<template>
  <div class="controls">
    <div class="controls-left">
      <h1 class="controls-title">My Pokédex</h1>
      <p class="controls-meta" v-if="store.entries.length">Caught: <b>{{ store.entries.length }}</b></p>
    </div>

    <div class="controls-right">
      <input
          v-model.trim="nameModel"
          type="search"
          placeholder="Search"
          class="input"
      />

      <Select v-model="sort">
        <SelectTrigger>
          <SelectValue placeholder="Sort"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem
              v-for="(label, key) in AVAILABLE_SORT_OPTIONS"
              :key="key"
              :value="key"
          >
            {{ label }}
          </SelectItem>
          <SelectItem key="clear" :value="null">
            Clear
          </SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" @click="toggleSelecting">
        {{ selecting ? 'Cancel' : 'Select' }}
      </Button>

      <Button variant="outline" :disabled="selected.size === 0" @click="removeSelected">
        Remove ({{ selected.size }})
      </Button>

      <Button @click="exportCSV">Export CSV</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {Button} from '@/components/ui/button'
import {usePokedexView} from "@/stores/pokedex.store.ts";
import {type OrderByFields} from "@/services/filter-service.local.ts";
import {computed, ref, watch} from "vue";
import {pokedexQuery} from "@/composables/useListQuery.ts";
import {Select, SelectContent, SelectTrigger, SelectItem, SelectValue} from "@/components/ui/select";

const AVAILABLE_SORT_OPTIONS: Record<OrderByFields, string> = {
  "height-asc": "Height ↑",
  "height-desc": "Height ↓",
  "oldest": "Oldest",
  "newest": "Newest",
};

const store = usePokedexView();

const sort = ref<OrderByFields | undefined>(undefined);

const {selecting, selected} = storeToRefs(store)
const {toggleSelecting, removeSelected, exportCSV} = store;

const nameModel = computed<string>({
  get: () => pokedexQuery.filter.value?.name ?? "",
  set: (val) => pokedexQuery.setFilter("name", val || undefined),
});

watch(sort, () => {
  pokedexQuery.setOrderBy(sort.value);
});

</script>

<style>
@reference "@/index.css";
@layer components {
  .controls {
    @apply flex flex-col gap-3 md:flex-row md:items-center md:justify-between;
  }

  .controls-left {
    @apply flex items-baseline gap-3;
  }

  .controls-title {
    @apply text-xl font-semibold;
  }

  .controls-meta {
    @apply text-sm text-foreground/70;
  }

  .controls-right {
    @apply flex items-center gap-2;
  }

  .input {
    @apply h-10 w-56 max-w-full rounded-md border border-border/60 bg-background/70 px-3 outline-none backdrop-blur;
  }
}
</style>
