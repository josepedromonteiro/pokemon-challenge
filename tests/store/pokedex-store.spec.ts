import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { usePokedexStore } from '@/stores/pokedex.store';
import type { PokedexEntry, PokedexId } from '@/models/pokedex';
import type { PokedexStore } from '@/services/pokedex-store.interface';
import type { PokemonDetail } from '@/models/api/pokemon-detail.api';

class MemoryStore implements PokedexStore {
  private data: Record<PokedexId, PokedexEntry>;
  catchSpy = vi.fn();
  releaseSpy = vi.fn();
  saveSpy = vi.fn();
  setNoteSpy = vi.fn();
  constructor(seed: Record<PokedexId, PokedexEntry> = {}) {
    this.data = { ...seed };
  }
  async load() {
    return { ...this.data };
  }
  async save(snapshot: Record<PokedexId, PokedexEntry>) {
    this.saveSpy(snapshot);
    this.data = { ...snapshot };
  }
  async catch(entry: PokedexEntry) {
    this.catchSpy(entry);
    this.data[entry.id] = entry;
  }
  async release(ids: PokedexId | PokedexId[]) {
    this.releaseSpy(ids);
    const list = Array.isArray(ids) ? ids : [ids];
    for (const id of list) delete this.data[id];
  }
  async setNote(id: PokedexId, note: string) {
    this.setNoteSpy({ id, note });
    const cur = this.data[id];
    if (cur) this.data[id] = { ...cur, note };
  }
}

const makeApi = (
  overrides?: Partial<{ getPokemonById: (id: number) => any }>
) => ({
  getPokemonById: vi.fn(overrides?.getPokemonById),
});

const detail = (
  id: number,
  name = `p${id}`,
  height = 10,
  types = ['electric']
) =>
  ({
    id,
    name,
    height,
    types: types.map((t: string, i: number) => ({
      slot: i + 1,
      type: { name: t, url: '' },
    })),
    sprites: {
      front_default: null,
      other: { 'official-artwork': { front_default: null } },
    },
  }) as unknown as PokemonDetail;

describe('usePokedexStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('loads from persistence and sets status', async () => {
    const seed: Record<PokedexId, PokedexEntry> = {
      25: {
        id: 25,
        name: 'pikachu',
        image: 'img',
        height: 4,
        types: ['electric'],
        caughtAt: 't0',
      },
    };
    const mem = new MemoryStore(seed);
    const dex = usePokedexStore();
    dex.setDependencies({ store: mem });

    expect(dex.status).toBe('idle');
    await dex.load();
    expect(dex.status).toBe('ready');
    expect(dex.pokemons.length).toBe(1);
    expect(dex.pokemons[0].id).toBe(25);
  });

  it('catchOne with entry stamps caughtAt and persists', async () => {
    const mem = new MemoryStore();
    const dex = usePokedexStore();
    dex.setDependencies({ store: mem });

    const nowBefore = Date.now();
    const entry = await dex.catchOne({
      entry: {
        id: 1,
        name: 'bulbasaur',
        image: 'i',
        height: 7,
        types: ['grass'],
      },
    });
    const nowAfter = Date.now();

    expect(entry.id).toBe(1);
    expect(new Date(entry.caughtAt).getTime()).toBeGreaterThanOrEqual(
      nowBefore
    );
    expect(new Date(entry.caughtAt).getTime()).toBeLessThanOrEqual(nowAfter);
    expect(mem.catchSpy).toHaveBeenCalledTimes(1);
    expect(dex.isCaught(1)).toBe(true);
  });

  it('catchOne by id uses API when available', async () => {
    const mem = new MemoryStore();
    const api = makeApi({
      getPokemonById: async (id: number) =>
        detail(id, 'charmander', 6, ['fire']),
    });
    const dex = usePokedexStore();
    dex.setDependencies({ store: mem, api: api as any });

    const e = await dex.catchOne({ id: 4 });
    expect(api.getPokemonById).toHaveBeenCalledWith(4);
    expect(e.name).toBe('charmander');
    expect(e.height).toBe(6);
    expect(e.types).toEqual(['fire']);
  });

  it('catchOne by id falls back gracefully when API fails', async () => {
    const mem = new MemoryStore();
    const api = makeApi({
      getPokemonById: async () => {
        throw new Error('network');
      },
    });
    const dex = usePokedexStore();
    dex.setDependencies({ store: mem, api: api as any });

    const e = await dex.catchOne({ id: 99 });
    expect(e.id).toBe(99);
    expect(e.name).toBe('#99');
    expect(e.height).toBe(0);
    expect(e.types).toEqual([]);
  });

  it('release removes one or many ids and persists', async () => {
    const mem = new MemoryStore();
    const dex = usePokedexStore();
    dex.setDependencies({ store: mem });

    await dex.catchOne({
      entry: { id: 1, name: 'a', image: 'i', height: 1, types: [] },
    });
    await dex.catchOne({
      entry: { id: 2, name: 'b', image: 'i', height: 1, types: [] },
    });
    expect(dex.pokemons.map((p) => p.id)).toEqual([1, 2]);

    await dex.release(1);
    expect(dex.pokemons.map((p) => p.id)).toEqual([2]);

    await dex.release([2]);
    expect(dex.pokemons.length).toBe(0);
  });

  it('toggle releases if present, otherwise catches', async () => {
    const mem = new MemoryStore();
    const dex = usePokedexStore();
    dex.setDependencies({ store: mem });

    await dex.toggle({ id: 5 });
    expect(dex.isCaught(5)).toBe(true);

    await dex.toggle({ id: 5 });
    expect(dex.isCaught(5)).toBe(false);
  });

  it('setNote delegates to store and mirrors in local map', async () => {
    const mem = new MemoryStore({
      7: {
        id: 7,
        name: 'squirtle',
        image: 'i',
        height: 5,
        types: ['water'],
        caughtAt: 't0',
      },
    });
    const dex = usePokedexStore();
    dex.setDependencies({ store: mem });

    await dex.load();
    expect(dex.pokemonById(7)?.note).toBeUndefined();

    await dex.setNote(7, 'cute');
    expect(mem.setNoteSpy).toHaveBeenCalledWith({ id: 7, note: 'cute' });
    expect(dex.pokemonById(7)?.note).toBe('cute');
  });

});
