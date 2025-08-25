// src/composables/useSelection.ts
import {ref} from 'vue'

type AvailableTypes = string | number;

export function useSelection<T extends AvailableTypes = number>() {
    const selecting = ref(false)
    const selected = ref<Set<T>>(new Set<T>())

    function toggleSelecting() {
        selecting.value = !selecting.value
        if (!selecting.value) selected.value.clear()
    }

    function toggleSelect(id: T) {
        const next = new Set<T>(selected.value as Set<T>);
        next.has(id) ? next.delete(id) : next.add(id)
        selected.value = next
    }

    function selectAll(ids: T[]) {
        selected.value = new Set(ids)
    }

    function clear() {
        selected.value.clear()
    }

    return {selecting, selected, toggleSelecting, toggleSelect, selectAll, clear}
}
