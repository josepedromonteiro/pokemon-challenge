import { defineStore } from 'pinia';
import { ref, computed, type Ref } from 'vue';
import type { PokemonDetail } from '@/models/api/pokemon-detail.api';
import type {
  PokedexEntry,
  PokedexEntryData,
  PokedexId,
} from '@/models/pokedex';
import type { PokedexStore } from '@/services/pokedex-store.interface';
import { LocalStoragePokedexStore } from '@/services/pokedex-local-storage';
import { artwork, mapPokemonTypeToString } from '@/utils/pokedex.util';
import { pokeApiService } from '@/services/pokemon-api-service';
import type { PokemonService } from '@/services/pokemon-service.interface.ts';
import type { DeepPartial } from '@/types/deep-partial.ts';
import { toCSV } from '@/utils/csv.util.ts';

// TODO - Move types
type Status = 'idle' | 'loading' | 'ready' | 'error';

type CatchEntry =
  | { id: PokedexId; entry?: never }
  | { id?: never; entry: PokedexEntryData };

export interface PokedexDeps {
  store?: PokedexStore;
  api?: PokemonService;
}

export const usePokedexStore = defineStore('pokedex', () => {
  /** Dependencies with safe defaults (can be replaced via setDependencies). */
  let depStore: PokedexStore = new LocalStoragePokedexStore();
  let api: PokemonService = pokeApiService;

  const setDependencies = (deps: PokedexDeps) => {
    if (deps.store) depStore = deps.store;
    if (deps.api) api = deps.api;
  };

  const status = ref<Status>('idle');
  const error = ref<string | null>(null);
  /** In-memory index of caught entries by id. */
  const pokemonMap: Ref<Record<PokedexId, PokedexEntry>> = ref({});

  /** Sorted list view of entries. */
  const pokemons = computed<PokedexEntry[]>(() =>
    Object.values(pokemonMap.value).sort((a, b) => a.id - b.id)
  );
  const count = computed(() => pokemons.value.length);
  const isCaught = (id: PokedexId) => Boolean(pokemonMap.value[id]);
  const pokemonById = (id: PokedexId) => pokemonMap.value[id];

  /** Load snapshot from persistence. */
  const load = async () => {
    status.value = 'loading';
    error.value = null;
    try {
      pokemonMap.value = await depStore.load();
      status.value = 'ready';
    } catch {
      error.value = 'Failed to load Pokédex';
      status.value = 'error';
    }
  };

  /** Save current snapshot to persistence. */
  const save = async () => {
    await depStore.save(pokemonMap.value);
  };

  /**
   * Add a Pokémon to the dex:
   * - If `entry` provided, trust it and stamp `caughtAt`.
   * Then fetch  details from API (best-effort) and create entry.
   * Returns existing entry if already present.
   */
  const catchOne = async (input: CatchEntry) => {
    const now = new Date().toISOString();
    const hasEntry = 'entry' in input && !!input.entry;
    const id: PokedexId = hasEntry ? input.entry!.id : input.id!;

    const existing = pokemonMap.value[id];
    if (existing) return existing;

    if (hasEntry) {
      const entry: PokedexEntry = { ...input.entry!, caughtAt: now };
      pokemonMap.value = { ...pokemonMap.value, [id]: entry };
      await depStore.catch(entry);
      return entry;
    }

    let detail: DeepPartial<PokemonDetail> | undefined;
    try {
      detail = await api.getPokemonById(id);
    } catch {
      /* ignore; fallback below */
    }

    const entry: PokedexEntry = {
      id,
      name: detail?.name ?? `#${id}`,
      image: artwork(id),
      caughtAt: now,
      height: detail?.height ?? 0,
      types: mapPokemonTypeToString(detail?.types ?? []),
    };

    pokemonMap.value = { ...pokemonMap.value, [id]: entry };
    await depStore.catch(entry);
    return entry;
  };

  /** Remove one or many Pokémon from the Pokedex. */
  const release = async (ids: PokedexId | PokedexId[]) => {
    const list = Array.isArray(ids) ? ids : [ids];
    if (!list.length) return;

    const next = { ...pokemonMap.value };
    let changed = false;
    for (const id of new Set(list)) {
      if (id in next) {
        delete next[id];
        changed = true;
      }
    }
    if (!changed) return;
    pokemonMap.value = next;
    await depStore.release(list);
  };

  /** Toggle caught state: release if present, otherwise catch. */
  const toggle = async (input: CatchEntry) => {
    const hasEntry = 'entry' in input && !!input.entry;
    const id: PokedexId = hasEntry ? input.entry!.id : input.id!;
    if (isCaught(id)) {
      await release(id);
      return;
    }
    return catchOne(hasEntry ? { entry: input.entry } : { id });
  };

  /** Persist a note and mirror it in local state */
  const setNote = async (id: PokedexId, note: string) => {
    await depStore.setNote(id, note);
    const cur = pokemonMap.value[id];
    if (cur && cur.note !== note) {
      pokemonMap.value = { ...pokemonMap.value, [id]: { ...cur, note } };
    }
  };

  /**
   * Export current list as CSV
   */
  const exportCSV = (itemIds?: number[]) => {
    // TODO - Improve this instead of find use Set or Map
    const list =
      itemIds && itemIds.length
        ? itemIds
            .map((id) => pokemons.value.find((p) => p.id === id))
            .filter((p): p is (typeof pokemons.value)[number] => !!p)
        : pokemons.value;

    const rows = list.map((i) => ({
      id: i.id,
      name: i.name,
      caughtAt: i.caughtAt ?? '',
      note: i.note ?? '',
    }));

    toCSV(
      rows,
      (itemIds?.length ?? 0) > 0
        ? 'partial-pokedex-wallet.csv'
        : 'pokedex-wallet.csv'
    );
  };

  return {
    setDependencies,
    status,
    error,
    pokemonMap,
    pokemons,
    count,
    isCaught,
    pokemonById,
    load,
    save,
    catchOne,
    release,
    toggle,
    setNote,
    exportCSV,
  };
});
