import type { PokemonDetail } from '@/models/api/pokemon-detail.api';
import type { DeepPartial } from '@/types/deep-partial';

import { describe, it, expect } from 'vitest';

import { toGridItem } from '@/utils/pokeui.utils.ts';

describe('toGridItem', () => {
  it('uses official-artwork when available', () => {
    const d: DeepPartial<PokemonDetail> = {
      id: 6,
      name: 'charizard',
      sprites: {
        other: { 'official-artwork': { front_default: 'art.png' } },
      } as any,
    };
    const item = toGridItem(d);
    expect(item).toEqual({ id: 6, image: 'art.png', name: 'charizard' });
  });

  it('falls back to front_default when official-artwork is missing', () => {
    const d: DeepPartial<PokemonDetail> = {
      id: 7,
      name: 'squirtle',
      sprites: { front_default: 'front.png' } as any,
    };
    const item = toGridItem(d);
    expect(item.image).toBe('front.png');
  });

  it('falls back to github by id and uses id as name when name is missing', () => {
    const d: DeepPartial<PokemonDetail> = { id: 99 };
    const item = toGridItem(d);
    expect(item.name).toBe('99');
    expect(item.image).toMatch(/official-artwork\/99\.png$/);
  });
});
