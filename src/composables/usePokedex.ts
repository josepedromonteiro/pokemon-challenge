import {ref, computed, type Ref, type ComputedRef} from 'vue'
import {pokeApiService} from '@/services/pokeapi'
import {
    LocalStoragePokedexStore, mapPokemonTypeToString,
    type PokedexEntry, type PokedexEntryData, type PokedexId, type PokedexStore
} from '@/models/pokedex'
import {artwork} from '@/utils/pokedex'
import type {PokemonDetail} from "@/models/api/pokemon-detail.api.ts";

type Status = 'idle' | 'loading' | 'ready' | 'error';

type CatchEntry = { id: PokedexId; entry?: never } | { id?: never; entry: PokedexEntryData };

export function createUsePokedex(store: PokedexStore = new LocalStoragePokedexStore()) {
    const status = ref<Status>('idle')
    const error = ref<string | null>(null)
    const pokemonMap: Ref<Record<PokedexId, PokedexEntry>> = ref({})
    const pokemonById: (id: PokedexId) => ComputedRef<PokedexEntry | undefined> = (id: PokedexId) => computed(() => pokemonMap.value[id]);


    const pokemons: ComputedRef<PokedexEntry[]> = computed(() =>
        Object.values(pokemonMap.value).sort((a, b) => a.id - b.id)
    )
    const count = computed(() => pokemons.value.length);

    const isCaught = computed<(id: PokedexId) => boolean>(() => (id) => {
        return !!pokemonMap.value[id];
    });

    async function load() {
        status.value = 'loading'
        error.value = null
        try {
            pokemonMap.value = await store.load();
            status.value = 'ready'
        } catch (e: any) {
            error.value = e?.message ?? 'Failed to load Pokédex'
            status.value = 'error'
        }
    }

    async function save() {
        await store.save(pokemonMap.value)
    }

    async function catchOne(input: CatchEntry) {

        const now = new Date().toISOString();

        const hasEntry = "entry" in input && !!input.entry;

        const id: PokedexId = hasEntry ? input.entry!.id : input.id!;

        const existing = pokemonMap.value[id];
        if (existing) return existing;

        if (hasEntry) {
            const entry: PokedexEntry = {
                ...input.entry!,
                caughtAt: now,
            };
            pokemonMap.value = {...pokemonMap.value, [id]: entry};
            await store.catch(entry);
            return entry;
        }

        let detail: PokemonDetail | null = null;
        try {
            detail = await pokeApiService.getPokemonById(id);
        } catch {
        }

        const entry: PokedexEntry = {
            id,
            name: detail?.name ?? `#${id}`,
            image: artwork(id),
            caughtAt: now,
            height: detail?.height ?? 0,
            types: mapPokemonTypeToString(detail?.types ?? [])
        };

        pokemonMap.value = {...pokemonMap.value, [id]: entry};
        await store.catch(entry);
        return entry;
    }

    async function release(ids: PokedexId | PokedexId[]) {
        const list = Array.isArray(ids) ? ids : [ids]
        if (!list.length) return

        const next = {...pokemonMap.value}
        let changed = false
        for (const id of new Set(list)) {
            if (id in next) {
                delete next[id];
                changed = true
            }
        }
        if (!changed) return
        pokemonMap.value = next

        await store.release(list)
    }

    async function toggle(
        input: CatchEntry
    ): Promise<void | PokedexEntry> {
        const hasEntry = "entry" in input && !!input.entry;
        const id: PokedexId = hasEntry ? input.entry!.id : input.id!;

        if (isCaught.value(id)) {
            await release(id);
            return;
        }

        return catchOne(hasEntry ? {entry: input.entry} : {id});
    }

    async function setNote(id: PokedexId, note: string) {
        await store.setNote(id, note);
    }

    function toCSV(): string {
        const rows = pokemons.value.map(e => ({
            id: e.id, name: e.name, image: e.image, note: e.note ?? '', caughtAt: e.caughtAt
        }))
        if (!rows.length) return ''
        const headers = Object.keys(rows[0])
        const esc = (v: any) => /[",\n]/.test(String(v ?? ''))
            ? `"${String(v ?? '').replace(/"/g, '""')}"`
            : String(v ?? '')
        const body = rows.map(r => headers.map(h => esc((r as any)[h])).join(',')).join('\n')
        return [headers.join(','), body].join('\n')
    }

    return {
        status, error, pokemons, count, isCaught,
        load, save, catchOne, release, setNote,
        toCSV,
        toggle,
        pokemonById
    }
}

const defaultInstance = createUsePokedex()

export function usePokedex() {
    return defaultInstance
}
