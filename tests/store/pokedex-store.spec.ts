import type { PokemonDetail } from '@/models/api/pokemon-detail.api';
import type { PokedexEntry, PokedexId } from '@/models/pokedex';
import type { PokedexStore } from '@/services/pokedex-store.interface';

import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { usePokedexStore } from '@/stores/pokedex.store';

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
    height,
    id,
    name,
    sprites: {
      front_default: null,
      other: { 'official-artwork': { front_default: null } },
    },
    stats: [
      { base_stat: 10, stat: { name: 'hp', url: '' } },
      { base_stat: 10, stat: { name: 'attack', url: '' } },
      { base_stat: 10, stat: { name: 'defense', url: '' } },
      { base_stat: 10, stat: { name: 'special-attack', url: '' } },
      { base_stat: 10, stat: { name: 'special-defense', url: '' } },
      { base_stat: 10, stat: { name: 'speed', url: '' } },
    ],
    types: types.map((t: string, i: number) => ({
      slot: i + 1,
      type: { name: t, url: '' },
    })),
    weight: 100,
  }) as unknown as PokemonDetail;

const viewerSeed = (
  id: number,
  name = `p${id}`,
  types: string[] = ['electric']
): PokedexEntry => ({
  id,
  name,
  sprite: 's',
  types,
  hp: 10,
  attack: 10,
  defense: 10,
  specialAttack: 10,
  specialDefense: 10,
  speed: 10,
  isCaught: true,
  height: 4,
  weight: 60,
  caughtAt: 't0',
});

describe('usePokedexStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('loads from persistence and sets status', async () => {
    const seed: Record<PokedexId, PokedexEntry> = {
      25: viewerSeed(25, 'pikachu', ['electric']),
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

  it('catchOne with entry stamps caughtAt and persists (requires API)', async () => {
    const mem = new MemoryStore();
    const api = makeApi({
      getPokemonById: async (id: number) =>
        detail(id, 'bulbasaur', 7, ['grass']),
    });
    const dex = usePokedexStore();
    dex.setDependencies({ store: mem, api: api as any });

    const nowBefore = Date.now();
    const entry = await dex.catchOne({
      entry: { id: 1, name: 'bulbasaur' } as any,
    });
    const nowAfter = Date.now();

    expect(entry).toBeTruthy();
    expect(entry!.id).toBe(1);
    expect(new Date(entry!.caughtAt!).getTime()).toBeGreaterThanOrEqual(
      nowBefore
    );
    expect(new Date(entry!.caughtAt!).getTime()).toBeLessThanOrEqual(nowAfter);
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
    dex.setDependencies({ api: api as any, store: mem });

    const e = await dex.catchOne({ id: 4 });
    expect(api.getPokemonById).toHaveBeenCalledWith(4);
    expect(e).toBeTruthy();
    expect(e!.name).toBe('charmander');
    expect(e!.height).toBe(6);
    expect(e!.types).toEqual(['fire']);
  });

  it('catchOne by id returns undefined when API fails', async () => {
    const mem = new MemoryStore();
    const api = makeApi({
      getPokemonById: async () => {
        throw new Error('network');
      },
    });
    const dex = usePokedexStore();
    dex.setDependencies({ api: api as any, store: mem });

    const e = await dex.catchOne({ id: 99 });
    expect(e).toBeUndefined();
    expect(dex.isCaught(99)).toBe(false);
  });

  it('release removes one or many ids and persists', async () => {
    const mem = new MemoryStore();
    const api = makeApi({
      getPokemonById: async (id: number) => detail(id, `p${id}`, 1, []),
    });
    const dex = usePokedexStore();
    dex.setDependencies({ store: mem, api: api as any });

    await dex.catchOne({ entry: { id: 1 } as any });
    await dex.catchOne({ entry: { id: 2 } as any });
    expect(dex.pokemons.map((p) => p.id)).toEqual([1, 2]);

    await dex.release(1);
    expect(dex.pokemons.map((p) => p.id)).toEqual([2]);

    await dex.release([2]);
    expect(dex.pokemons.length).toBe(0);
  });

  it('toggle releases if present, otherwise catches (API required for catch)', async () => {
    const mem = new MemoryStore();
    const api = makeApi({
      getPokemonById: async (id: number) => detail(id, `p${id}`, 1, []),
    });
    const dex = usePokedexStore();
    dex.setDependencies({ store: mem, api: api as any });

    await dex.toggle({ id: 5 });
    expect(dex.isCaught(5)).toBe(true);

    await dex.toggle({ id: 5 });
    expect(dex.isCaught(5)).toBe(false);
  });

  it('setNote delegates to store and mirrors in local map', async () => {
    const mem = new MemoryStore({
      7: viewerSeed(7, 'squirtle', ['water']),
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
