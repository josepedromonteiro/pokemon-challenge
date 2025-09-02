<template>
  <div class="toolbar controls">
    <div class="controls-left">
      <h1 class="controls-title">My Pokédex</h1>
      <p v-if="nEntries" class="controls-meta">
        Caught: <b>{{ nEntries }}</b>
      </p>
    </div>

    <div class="controls-right">
      <Input
        v-model.trim="nameModel"
        type="search"
        placeholder="Search"
        class="min-w-56 flex-1"
      />

      <MultiSelect
        v-model="selectedTypes"
        :options="typeOptions"
        placeholder="Filter by types"
        button-class="min-w-36 flex-1 w-36"
        @done="onSelectTypes"
      />
      <Select v-model="sort">
        <SelectTrigger class="min-w-36 flex-1">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="(label, key) in AVAILABLE_SORT_OPTIONS"
            :key="key"
            :value="key"
          >
            {{ label }}
          </SelectItem>
          <SelectItem key="clear" :value="null"> Clear</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="secondary" @click="selectStore?.toggleSelecting">
        {{ selectStore?.selecting.value ? 'Cancel' : 'Select' }}
      </Button>
      <Button
        v-if="(selectStore?.selected.value.size ?? 0) > 0"
        variant="destructive"
        @click="emit('on-remove')"
      >
        Remove ({{ selectStore?.selected.value.size ?? 0 }})
      </Button>

      <slot name="actions"> </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { useSelection } from '@/composables/useSelection.ts';

import { computed, onMounted, ref, watch } from 'vue';

import MultiSelect from '@/components/MultiSelect.vue';
import { Button } from '@/lib/ui/button';
import { Input } from '@/lib/ui/input';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@/lib/ui/select';
import { type OrderByFields } from '@/services/pokedex-filter-service.ts';
import { pokeApiService } from '@/services/pokemon-api-service.ts';
import { usePokedexQuery } from '@/stores/pokedex-query.store.ts';
import { usePokedexStore } from '@/stores/pokedex.store.ts';

const AVAILABLE_SORT_OPTIONS: Record<OrderByFields, string> = {
  'height-asc': 'Height ↑',
  'height-desc': 'Height ↓',
  newest: 'Newest',
  oldest: 'Oldest',
};

defineProps<{
  selectStore?: ReturnType<typeof useSelection<number>>;
}>();

const emit = defineEmits<{
  (e: 'on-remove'): void;
}>();

const pokedexQuery = usePokedexQuery();
const pokedexStore = usePokedexStore();

const sort = ref<OrderByFields | undefined>(undefined);
const allTypes = ref<string[]>([]);
const selectedTypes = ref<string[]>(
  (pokedexQuery.filter?.types as string[]) ?? []
);

const nameModel = computed<string>({
  get: () => (pokedexQuery.filter?.name ?? '') as string,
  set: (val: string) => {
    pokedexQuery.setFilter('name', val || undefined);
  },
});

const typeOptions = computed(() =>
  allTypes.value.map((t) => ({ label: t, value: t }))
);
const nEntries = computed(() => pokedexStore.pokemons.length);

const onSelectTypes = () => {
  pokedexQuery.setFilter('types', selectedTypes.value);
};

const setupTypes = () => {
  pokeApiService.getPokemonTypes().then((res) => {
    allTypes.value = res.results.map((type) => type.name);
  });
};

onMounted(() => {
  setupTypes();
});

watch(sort, () => {
  pokedexQuery.setOrderBy(sort.value);
});

watch(
  selectedTypes,
  (v) => {
    pokedexQuery.setFilter('types', v.length ? v : undefined);
  },
  { immediate: true }
);
</script>

<style scoped>
@reference "@/index.css";
@layer components {
  .controls {
    @apply flex flex-col gap-x-8 gap-y-3 md:flex-row md:items-center md:justify-between;
  }

  .controls-left {
    @apply flex items-baseline gap-3 whitespace-nowrap;
  }

  .controls-title {
    @apply text-xl font-semibold;
  }

  .controls-meta {
    @apply text-sm text-foreground/70;
  }

  .controls-right {
    @apply flex flex-wrap items-center gap-2;
  }
}
</style>
