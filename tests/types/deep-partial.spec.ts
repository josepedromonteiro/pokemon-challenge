import type { PokemonDetail } from '@/models/api/pokemon-detail.api';
import type { DeepPartial } from '@/types/deep-partial';

import { describe, it, expectTypeOf } from 'vitest';

describe('DeepPartial', () => {
  it('allows partial nested objects and arrays of objects', () => {
    const partial: DeepPartial<PokemonDetail> = {
      id: 25,
      name: 'pikachu',
      sprites: {
        other: { 'official-artwork': { front_default: 'art.png' } },
      },
      stats: [{ base_stat: 35, stat: { name: 'hp' } }, {}],
      types: [{ type: { name: 'electric' } }, {}],
    };
    expectTypeOf<DeepPartial<PokemonDetail>>().toEqualTypeOf(partial);
  });
});
