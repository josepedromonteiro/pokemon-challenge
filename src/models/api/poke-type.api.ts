export interface PokemonTypesResponse {
  count: number;
  next?: string;
  previous?: string;
  results: PokeTypeResults[];
}

export interface PokeTypeResults {
  name: string;
  url: string;
}
