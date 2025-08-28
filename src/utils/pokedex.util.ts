import type {
  PokemonDetail,
  PokemonType,
} from '@/models/api/pokemon-detail.api.ts';
import type { PokedexEntryData } from '@/models/pokedex.ts';
import type { DeepPartial } from '@/types/deep-partial.ts';

export const artwork = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const mapPokemonDetailsToPokedexEntry = (
  details: DeepPartial<PokemonDetail>
): PokedexEntryData => {
  return {
    height: details.height ?? 0,
    id: details.id!,
    image:
      details.sprites?.other?.['official-artwork']?.front_default ||
      details.sprites?.front_default ||
      '',
    name: details.name ?? '',
    types: mapPokemonTypeToString(details.types ?? []),
  };
};

export const mapPokemonTypeToString = (types: DeepPartial<PokemonType>[]) => {
  return types.map((entry) => entry.type?.name ?? '');
};
