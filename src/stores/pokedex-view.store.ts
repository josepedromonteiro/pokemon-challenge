import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { toCSV } from '@/utils/csv.util.ts';
import { usePokedexStore } from '@/stores/pokedex.store.ts';

/**
 * UI-facing store for the Pokédex page.
 * - Wraps core pokedex store (data/actions)
 * - Manages selection UI state and CSV export
 */
export const usePokedexViewStore = defineStore('pokedexView', () => {
  const pokedexStore = usePokedexStore();
  const { toggle, release, load } = pokedexStore;
  const { pokemons, status } = storeToRefs(pokedexStore);

  const loading = computed(() => status.value === 'loading');

  const selecting = ref(false);
  const selected = ref<Set<number>>(new Set());

  /** Enable/disable selection mode; clears selection when disabling. */
  function toggleSelecting() {
    selecting.value = !selecting.value;
    if (!selecting.value) selected.value.clear();
  }

  /** Toggle a single row id in the selection set. */
  function toggleSelected(id: number) {
    const next = new Set(selected.value);
    next.has(id) ? next.delete(id) : next.add(id);
    selected.value = next;
  }

  /** Check if a row id is selected. */
  function isSelected(id: number) {
    return selected.value.has(id);
  }

  /** Remove all selected entries and exit selection mode. */
  function removeSelected() {
    const ids = [...selected.value];
    if (!ids.length) return;
    release(ids);
    selected.value.clear();
    selecting.value = false;
  }

  /**
   * Export current list as CSV
   */
  function exportCSV() {
    const rows = pokemons.value.map((i) => ({
      id: i.id,
      name: i.name,
      caughtAt: i.caughtAt ?? '',
      note: i.note ?? '',
    }));
    toCSV(rows, 'pokedex-wallet.csv');
  }

  async function init() {
    await load();
  }

  return {
    // expose entries for templates (ref from core store)
    entries: pokemons,
    loading,

    // selection UI
    selecting,
    selected,
    toggle,
    toggleSelecting,
    toggleSelected,
    isSelected,
    removeSelected,

    // utilities
    exportCSV,
    init,
  };
});
