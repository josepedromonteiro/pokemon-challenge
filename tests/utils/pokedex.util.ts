import type { PokemonDetail } from '@/models/api/pokemon-detail.api';
import type { DeepPartial } from '@/types/deep-partial.ts';

import { describe, it, expect } from 'vitest';

import { artwork, mapPokemonTypeToString } from '@/utils/pokedex.util.ts';
import { generateSpritesWillFallback } from '@/models/api/poke.api.ts';
import { mapToViewerItem } from '@/models/poke-ui.ts';

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

describe('image selection via generateSpritesWillFallback', () => {
  it('prefers official-artwork, then front_default, then empty', () => {
    const withArt = {
      id: 4,
      name: 'charmander',
      height: 6,
      sprites: {
        front_default: 'front.png',
        other: { 'official-artwork': { front_default: 'art.png' } },
      },
      types: [{ slot: 1, type: { name: 'fire', url: '' } }],
    } as unknown as DeepPartial<PokemonDetail>;

    expect(generateSpritesWillFallback(withArt)).toBe('art.png');

    const withFront = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      sprites: { front_default: 'front-only.png', other: {} as any },
      types: [],
    } as unknown as DeepPartial<PokemonDetail>;

    expect(generateSpritesWillFallback(withFront)).toBe('front-only.png');

    const noSprites = {
      id: 2,
      name: 'ivysaur',
      height: 10,
      sprites: {} as any,
      types: [],
    } as unknown as DeepPartial<PokemonDetail>;

    expect(generateSpritesWillFallback(noSprites)).toBe('');
  });
});

describe('mapToViewerItem', () => {
  it('maps detail and capture to ViewerItem fields', () => {
    const details = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: {
        front_default: 'f.png',
        other: { 'official-artwork': { front_default: 'a.png' } },
      },
      types: [{ slot: 1, type: { name: 'electric', url: '' } }],
      stats: [
        { base_stat: 35, stat: { name: 'hp', url: '' } },
        { base_stat: 55, stat: { name: 'attack', url: '' } },
        { base_stat: 40, stat: { name: 'defense', url: '' } },
        { base_stat: 50, stat: { name: 'special-attack', url: '' } },
        { base_stat: 50, stat: { name: 'special-defense', url: '' } },
        { base_stat: 90, stat: { name: 'speed', url: '' } },
      ],
    } as unknown as DeepPartial<PokemonDetail>;

    const capture = { isCaught: true, caughtAt: 't0' as const };
    const v = mapToViewerItem(details, capture);

    expect(v.id).toBe(25);
    expect(v.name).toBe('pikachu');
    expect(v.height).toBe(4);
    expect(v.weight).toBe(60);
    expect(v.types).toEqual(['electric']);
    expect(v.isCaught).toBe(true);
    expect(v.caughtAt).toBe('t0');
    expect(v.sprite).toBe('a.png');
    expect(v.hp).toBe(35);
    expect(v.attack).toBe(55);
    expect(v.defense).toBe(40);
    expect(v.specialAttack).toBe(50);
    expect(v.specialDefense).toBe(50);
    expect(v.speed).toBe(90);
  });

  it('defaults missing fields to safe values', () => {
    const minimal = { id: 7 } as unknown as DeepPartial<PokemonDetail>;
    const v = mapToViewerItem(minimal);

    expect(v.id).toBe(7);
    expect(v.name).toBe('');
    expect(v.sprite).toBe('');
    expect(v.types).toEqual([]);
    expect(v.isCaught).toBe(false);
    expect(v.caughtAt).toBeUndefined();
    expect(v.hp).toBe(0);
    expect(v.attack).toBe(0);
    expect(v.defense).toBe(0);
    expect(v.specialAttack).toBe(0);
    expect(v.specialDefense).toBe(0);
    expect(v.speed).toBe(0);
    expect(v.height).toBe(0);
    expect(v.weight).toBe(0);
  });
});
