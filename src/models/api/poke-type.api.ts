export interface PokemonTypesResponse {
    count: number
    next: string
    previous: any
    results: PokeTypeResults[]
}

export interface PokeTypeResults {
    name: string
    url: string
}
