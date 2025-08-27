import {defineStore, storeToRefs} from 'pinia';
import {computed, ref} from 'vue';
import {usePokedexStore} from '@/stores/pokedex.store.ts';

// TODO - Consider moving this into a composable and use provide to inject the composable

/**
 * UI-facing store for the Pokédex page.
 * - Wraps core pokedex store (data/actions)
 * - Manages selection UI state and CSV export
 */
export const usePokedexViewStore = defineStore('pokedexView', () => {
    const pokedexStore = usePokedexStore();
    const {toggle, release, load} = pokedexStore;
    const {pokemons, status} = storeToRefs(pokedexStore);

    const loading = computed(() => status.value === 'loading');

    const selecting = ref(false);
    const selected = ref<Set<number>>(new Set());

    /** Enable/disable selection mode; clears selection when disabling. */
    const toggleSelecting = () => {
        selecting.value = !selecting.value;
        if (!selecting.value) selected.value.clear();
    };

    /** Toggle a single row id in the selection set. */
    const toggleSelected = (id: number) => {
        const next = new Set(selected.value);
        next.has(id) ? next.delete(id) : next.add(id);
        selected.value = next;
    };

    /** Check if a row id is selected. */
    const isSelected = (id: number) => {
        return selected.value.has(id);
    };

    /** Remove all selected entries and exit selection mode. */
    const removeSelected = () => {
        const ids = [...selected.value];
        if (!ids.length) return;
        release(ids);
        selected.value.clear();
        selecting.value = false;
    };

    const init = async () => {
        await load();
    };

    return {
        entries: pokemons,
        loading,
        selecting,
        selected,
        toggle,
        toggleSelecting,
        toggleSelected,
        isSelected,
        removeSelected,
        init,
    };
});
