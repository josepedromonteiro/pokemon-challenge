import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { ref } from 'vue';

const mockPokemons = ref<any[]>([]);
const mockStatus = ref<'idle' | 'loading' | 'ready' | 'error'>('idle');
const releaseSpy = vi.fn();
const loadSpy = vi.fn();
const toggleSpy = vi.fn();

vi.mock('@/stores/pokedex.store.ts', () => ({
  usePokedexStore: () => ({
    pokemons: mockPokemons,
    status: mockStatus,
    release: releaseSpy,
    load: loadSpy,
    toggle: toggleSpy,
  }),
}));

const toCSVSpy = vi.fn();
vi.mock('@/utils/csv.util.ts', () => ({
  toCSV: (...args: any[]) => toCSVSpy(...args),
}));

import { usePokedexViewStore } from '@/stores/pokedex-view.store';

describe('usePokedexViewStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    releaseSpy.mockReset();
    loadSpy.mockReset();
    toggleSpy.mockReset();
    toCSVSpy.mockReset();
    mockPokemons.value = [];
    mockStatus.value = 'idle';
  });

  it('exposes entries from core store and initial UI state', () => {
    const s = usePokedexViewStore();
    expect(s.entries).toEqual([]);
    expect(s.loading).toBe(false);
    expect(s.selecting).toBe(false);
    expect(s.selected.size).toBe(0);
  });

  it('toggleSelecting toggles and clears selection when disabling', () => {
    const s = usePokedexViewStore();
    s.toggleSelecting();
    expect(s.selecting).toBe(true);
    s.toggleSelected(1);
    s.toggleSelected(2);
    expect(s.selected.size).toBe(2);
    s.toggleSelecting();
    expect(s.selecting).toBe(false);
    expect(s.selected.size).toBe(0);
  });

  it('toggleSelected adds/removes ids; isSelected reflects it', () => {
    const s = usePokedexViewStore();
    expect(s.isSelected(7)).toBe(false);
    s.toggleSelected(7);
    expect(s.isSelected(7)).toBe(true);
    s.toggleSelected(7);
    expect(s.isSelected(7)).toBe(false);
  });

  it('removeSelected releases selected ids and resets selection mode', async () => {
    const s = usePokedexViewStore();
    s.toggleSelecting();
    s.toggleSelected(3);
    s.toggleSelected(5);
    await s.removeSelected();
    expect(releaseSpy).toHaveBeenCalledWith([3, 5]);
    expect(s.selected.size).toBe(0);
    expect(s.selecting).toBe(false);
  });

  it('removeSelected is no-op when nothing selected', async () => {
    const s = usePokedexViewStore();
    await s.removeSelected();
    expect(releaseSpy).not.toHaveBeenCalled();
  });

  it('exportCSV maps current entries and calls toCSV with filename', () => {
    const s = usePokedexViewStore();
    mockPokemons.value = [
      { id: 1, name: 'bulbasaur', caughtAt: 't1', note: 'a' },
      { id: 25, name: 'pikachu', caughtAt: undefined, note: undefined },
    ];
    s.exportCSV();
    expect(toCSVSpy).toHaveBeenCalledTimes(1);
    const [rows, filename] = toCSVSpy.mock.calls[0];
    expect(filename).toBe('pokedex-wallet.csv');
    expect(rows).toEqual([
      { id: 1, name: 'bulbasaur', caughtAt: 't1', note: 'a' },
      { id: 25, name: 'pikachu', caughtAt: '', note: '' },
    ]);
  });

  it('init calls load on core store', async () => {
    const s = usePokedexViewStore();
    await s.init();
    expect(loadSpy).toHaveBeenCalledTimes(1);
  });
});
