// src/stores/pokedexView.ts
import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {usePokedex} from '@/composables/usePokedex'
import {toCSV} from '@/utils/csv'
// import {usePokedexFilters} from "@/composables/usePokedexFilters.ts";

export const usePokedexView = defineStore('pokedex', () => {

    const {pokemons, toggle, release, load, status} = usePokedex()
    const loading = computed(() => status.value === 'loading')

    const selecting = ref(false)
    const selected = ref<Set<number>>(new Set())


    // Actions
    function toggleSelecting() {
        selecting.value = !selecting.value
        if (!selecting.value) selected.value.clear()
    }

    function toggleSelected(id: number) {
        const next = new Set(selected.value)
        next.has(id) ? next.delete(id) : next.add(id)
        selected.value = next
    }

    function isSelected(id: number) {
        return selected.value.has(id);
    }

    function removeSelected() {
        const ids = [...selected.value]
        if (!ids.length) return
        release(ids)
        selected.value.clear()
        selecting.value = false
    }

    function exportCSV() {
        const rows = pokemons.value.map(i => ({
            id: i.id, name: i.name, caughtAt: i.caughtAt ?? '', note: i.note ?? '',
        }))
        toCSV(rows, 'pokedex-wallet.csv')
    }

    async function init() {
        await load()
    }

    return {
        entries: pokemons,
        // filtered,
        loading,
        // query, sort,
        selecting, selected,
        toggle, toggleSelecting, toggleSelected, isSelected, removeSelected, exportCSV, init,
    }
})
