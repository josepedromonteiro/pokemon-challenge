import type {PokemonDetail, PokemonType} from "@/models/api/pokemon-detail.api.ts";

export type PokedexId = number


export interface PokedexEntryData {
    id: PokedexId;
    name: string;
    image: string;
    height: number;
    types: string[];
    note?: string;
}

export interface PokedexEntry extends PokedexEntryData {
    caughtAt: string;
}

export function mapPokemonDetailsToPokedexEntry(details: PokemonDetail): PokedexEntryData {
    return {
        id: details.id,
        name: details.name,
        image: details.sprites.other?.['official-artwork'].front_default || details.sprites.front_default || '',
        height: details.height,
        types: mapPokemonTypeToString(details.types),
    }
}

export function mapPokemonTypeToString(types: PokemonType[]) {
    return types.map((entry)=> entry.type.name);
}

// Snapshot is just the map (kept minimal)
export type PokedexSnapshot = Record<PokedexId, PokedexEntry>

export interface PokedexStore {
    load(): Promise<PokedexSnapshot>
    save(snapshot: PokedexSnapshot): Promise<void>
    catch(entry: PokedexEntry): Promise<void>
    release(ids: PokedexId | PokedexId[]): Promise<void>
    setNote(id: PokedexId, note: string): Promise<void>
}



export class LocalStoragePokedexStore implements PokedexStore {
    private key = 'pokedex'

    private read(): PokedexSnapshot {
        try {
            const raw = localStorage.getItem(this.key)
            return raw ? (JSON.parse(raw) as PokedexSnapshot) : {}
        } catch { return {} }
    }

    private write(data: PokedexSnapshot) {
        localStorage.setItem(this.key, JSON.stringify(data))
    }

    async load(): Promise<PokedexSnapshot> {
        return this.read()
    }

    async save(snapshot: PokedexSnapshot): Promise<void> {
        this.write(snapshot)
    }

    async catch(entry: PokedexEntry): Promise<void> {
        const data = this.read()
        data[entry.id] = entry
        this.write(data)
    }

    async release(ids: PokedexId | PokedexId[]): Promise<void> {
        const data = this.read()
        const list = Array.isArray(ids) ? ids : [ids]
        for (const id of new Set(list)) delete data[id]
        this.write(data)
    }

    async setNote(id: PokedexId, note: string): Promise<void> {
        const data = this.read()
        const existing = data[id]
        if (!existing) return
        data[id] = { ...existing, note }
        this.write(data)
    }
}
