export type PokemonId = number

// export type PokemonDetail =  {
//     id: PokemonId; name: string; image: string|null
//     height: number; weight: number;
//     types: string[];
//     stats: Record<'hp'|'attack'|'defense'|'special-attack'|'special-defense'|'speed', number>;
// }

export type PokemonSummary = { name: string; url: string}

export interface PokemonPagedResponse<T = unknown> {
    count: number;
    next?: string;
    previous?: string;
    results?: T[]
}
