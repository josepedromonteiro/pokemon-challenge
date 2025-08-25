

// src/domain/pokedex/filters.types.ts
export type SortKey = 'id' | 'name' | 'caughtAt' | 'height'
export type SortDir = 'asc' | 'desc'

export type PokedexFilterParams = {
    q?: string                 // search (name contains or exact id)
    types?: string[]           // AND logic (all must match); optional
    heightMin?: number         // optional (PokéAPI height = decimeters)
    heightMax?: number
    sortKey?: SortKey          // default 'id'
    sortDir?: SortDir          // default 'asc'
}

// Generic interface so we can swap implementation later (e.g. API)
export interface PokedexFilters<T> {
    run(params: PokedexFilterParams): T
}
