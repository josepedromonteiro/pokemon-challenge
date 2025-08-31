import type { PokedexEntry } from '@/models/pokedex';

import { describe, it, expect } from 'vitest';

import {
  type OrderByFields,
  PokedexFilterService,
} from '@/services/pokedex-filter-service.ts';

const sample = (override: Partial<PokedexEntry>): PokedexEntry => ({
  id: 1,
  name: 'bulbasaur',
  sprite: '',
  types: ['grass'],
  hp: 10,
  attack: 10,
  defense: 10,
  specialAttack: 10,
  specialDefense: 10,
  speed: 10,
  isCaught: true,
  height: 7,
  weight: 69,
  caughtAt: '2020-01-02T00:00:00Z',
  ...override,
});

describe('PokedexFilterService', () => {
  const data: PokedexEntry[] = [
    sample({
      caughtAt: '2020-01-02T00:00:00Z',
      height: 7,
      id: 1,
      name: 'Bulbasaur',
    }),
    sample({
      caughtAt: '2020-01-03T00:00:00Z',
      height: 10,
      id: 2,
      name: 'Ivysaur',
    }),
    sample({
      caughtAt: '2020-01-01T00:00:00Z',
      height: 20,
      id: 3,
      name: 'Venusaur',
    }),
  ];
  const svc = new PokedexFilterService(() => data);

  it('filters by name (case/trim insensitive)', async () => {
    const res = await svc.list({
      filter: { name: '  saur  ' },
      orderBy: undefined,
    });
    expect(res.data.map((p) => p.name)).toEqual([
      'Bulbasaur',
      'Ivysaur',
      'Venusaur',
    ]);
    const res2 = await svc.list({
      filter: { name: 'ivy' },
      orderBy: undefined,
    });
    expect(res2.data.map((p) => p.name)).toEqual(['Ivysaur']);
  });

  it.each<OrderByFields>(['height-asc', 'height-desc', 'oldest', 'newest'])(
    'sorts by %s',
    async (orderBy) => {
      const res = await svc.list({ filter: {}, orderBy });
      const ids = res.data.map((p) => p.id);
      if (orderBy === 'height-asc') expect(ids).toEqual([1, 2, 3]);
      if (orderBy === 'height-desc') expect(ids).toEqual([3, 2, 1]);
      if (orderBy === 'oldest') expect(ids).toEqual([3, 1, 2]);
      if (orderBy === 'newest') expect(ids).toEqual([2, 1, 3]);
    }
  );

  it('handles missing/invalid fields', async () => {
    const svc3 = new PokedexFilterService(() => [
      sample({ height: 3, id: 1, name: 'A' }),
      sample({ height: Number.NaN, id: 2, name: 'B' }),
    ]);
    const res = await svc3.list({ filter: {}, orderBy: 'height-asc' });
    expect(res.data.map((p) => p.id)).toEqual([2, 1]);
  });
});
