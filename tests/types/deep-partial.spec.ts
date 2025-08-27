import { describe, it, expectTypeOf } from 'vitest';
import type { DeepPartial } from '@/types/deep-partial';
import type { PokemonDetail } from '@/models/api/pokemon-detail.api';

describe('DeepPartial', () => {
  it('allows partial nested objects and arrays of objects', () => {
    const partial: DeepPartial<PokemonDetail> = {
      id: 25,
      name: 'pikachu',
      sprites: {
        other: { 'official-artwork': { front_default: 'art.png' } },
      },
      types: [{ type: { name: 'electric' } }, {}],
      stats: [{ base_stat: 35, stat: { name: 'hp' } }, {}],
    };
    expectTypeOf<DeepPartial<PokemonDetail>>().toEqualTypeOf(partial);
  });
});
