import type { DeepPartial } from '@/types/deep-partial.ts';
import type { PokemonDetail } from '@/models/api/pokemon-detail.api.ts';
import type { GridItemData } from '@/models/poke-ui.ts';
import { generateSpritesWillFallback } from '@/models/api/poke.api.ts';

export const toGridItem = (
  pokemonData: DeepPartial<PokemonDetail>
): GridItemData => {
  const id = pokemonData.id!;
  return {
    id,
    name: pokemonData.name ?? String(id),
    image: generateSpritesWillFallback(pokemonData),
  };
};
