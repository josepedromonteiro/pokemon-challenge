import { describe, it, expect } from 'vitest';
import type { PokemonDetail } from '@/models/api/pokemon-detail.api';
import {
  artwork,
  mapPokemonDetailsToPokedexEntry,
  mapPokemonTypeToString,
} from '@/utils/pokedex.util.ts';
import type {DeepPartial} from "@/types/deep-partial.ts";

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
      id: 4,
      name: 'charmander',
      height: 6,
      types: [{ slot: 1, type: { name: 'fire', url: '' } }],
      sprites: {
        front_default: 'front.png',
        other: { 'official-artwork': { front_default: 'art.png' } },
      },
    } as unknown as DeepPartial<PokemonDetail>;

    const e1 = mapPokemonDetailsToPokedexEntry(withArt);
    expect(e1).toEqual({
      id: 4,
      name: 'charmander',
      image: 'art.png',
      height: 6,
      types: ['fire'],
    });

    const withFront = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      types: [],
      sprites: { front_default: 'front-only.png', other: {} as any },
    } as unknown as DeepPartial<PokemonDetail>;

    expect(mapPokemonDetailsToPokedexEntry(withFront).image).toBe(
      'front-only.png'
    );

    const noSprites = {
      id: 2,
      name: 'ivysaur',
      height: 10,
      types: [],
      sprites: {} as any,
    } as unknown as DeepPartial<PokemonDetail>;

    expect(mapPokemonDetailsToPokedexEntry(noSprites).image).toBe('');
  });
});
