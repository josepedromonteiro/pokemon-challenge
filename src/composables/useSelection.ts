import { ref } from 'vue';

type AvailableTypes = string | number;

export const useSelection = <T extends AvailableTypes = number>() => {
  const selecting = ref(false);
  const selected = ref<Set<T>>(new Set<T>());

  const toggleSelecting = () => {
    selecting.value = !selecting.value;
    if (!selecting.value) selected.value.clear();
  };

  const isSelected = (id: T) => {
    return (selected.value as Set<T>).has(id);
  };

  const toggleSelect = (id: T) => {
    const next = new Set<T>(selected.value as Set<T>);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    selected.value = next;
  };

  const selectAll = (ids: T[]) => {
    selected.value = new Set(ids);
  };

  const clear = () => {
    selected.value.clear();
    selecting.value = false;
  };

  return {
    clear,
    isSelected,
    selectAll,
    selected,
    selecting,
    toggleSelect,
    toggleSelecting,
  };
};
