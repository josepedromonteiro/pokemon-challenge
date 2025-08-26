import type { DeepPartial } from '@/types/deep-partial.ts';
import type { PokemonDetail } from '@/models/api/pokemon-detail.api.ts';

export type PokemonId = number;
export type PokemonSummary = { name: string; url: string };

export interface PokemonPagedResponse<T = unknown> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export const generateSpritesWillFallback = (
  pokemonDetail: DeepPartial<PokemonDetail>
) => {
  return (
    pokemonDetail.sprites?.other?.['official-artwork']?.front_default ??
    pokemonDetail.sprites?.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonDetail.id}.png`
  );
};
