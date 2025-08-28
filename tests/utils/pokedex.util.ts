import type { PokemonDetail } from '@/models/api/pokemon-detail.api';
import type { DeepPartial } from '@/types/deep-partial.ts';

import { describe, it, expect } from 'vitest';

import {
  artwork,
  mapPokemonDetailsToPokedexEntry,
  mapPokemonTypeToString,
} from '@/utils/pokedex.util.ts';

describe('artwork()', () => {
  it('builds the official-artwork CDN URL by id', () => {
    expect(artwork(99)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/99.png'
    );
  });
});

describe('mapPokemonTypeToString', () => {
  it('maps type objects to names', () => {
    const types = [
      { slot: 1, type: { name: 'fire', url: '' } },
      { slot: 2, type: { name: 'flying', url: '' } },
    ] as any;
    expect(mapPokemonTypeToString(types)).toEqual(['fire', 'flying']);
  });
});

describe('mapPokemonDetailsToPokedexEntry', () => {
  it('prefers official-artwork, then front_default, then empty', () => {
    const withArt = {
      height: 6,
      id: 4,
      name: 'charmander',
      sprites: {
        front_default: 'front.png',
        other: { 'official-artwork': { front_default: 'art.png' } },
      },
      types: [{ slot: 1, type: { name: 'fire', url: '' } }],
    } as unknown as DeepPartial<PokemonDetail>;

    const e1 = mapPokemonDetailsToPokedexEntry(withArt);
    expect(e1).toEqual({
      height: 6,
      id: 4,
      image: 'art.png',
      name: 'charmander',
      types: ['fire'],
    });

    const withFront = {
      height: 7,
      id: 1,
      name: 'bulbasaur',
      sprites: { front_default: 'front-only.png', other: {} as any },
      types: [],
    } as unknown as DeepPartial<PokemonDetail>;

    expect(mapPokemonDetailsToPokedexEntry(withFront).image).toBe(
      'front-only.png'
    );

    const noSprites = {
      height: 10,
      id: 2,
      name: 'ivysaur',
      sprites: {} as any,
      types: [],
    } as unknown as DeepPartial<PokemonDetail>;

    expect(mapPokemonDetailsToPokedexEntry(noSprites).image).toBe('');
  });
});
