import { describe, it, expect } from 'vitest';
import type { PokedexEntry } from '@/models/pokedex';
import {
  type OrderByFields,
  PokedexFilterService,
} from '@/services/pokedex-filter-service.ts';

const sample = (override: Partial<PokedexEntry>): PokedexEntry => ({
  id: 1,
  name: 'bulbasaur',
  image: '',
  height: 7,
  types: ['grass'],
  caughtAt: '2020-01-02T00:00:00Z',
  ...override,
});

describe('PokedexFilterService', () => {
  const data: PokedexEntry[] = [
    sample({
      id: 1,
      name: 'Bulbasaur',
      height: 7,
      caughtAt: '2020-01-02T00:00:00Z',
    }),
    sample({
      id: 2,
      name: 'Ivysaur',
      height: 10,
      caughtAt: '2020-01-03T00:00:00Z',
    }),
    sample({
      id: 3,
      name: 'Venusaur',
      height: 20,
      caughtAt: '2020-01-01T00:00:00Z',
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
      sample({ id: 1, name: 'A', height: 3 }),
      sample({ id: 2, name: 'B', height: NaN }),
    ]);
    const res = await svc3.list({ filter: {}, orderBy: 'height-asc' });
    expect(res.data.map((p) => p.id)).toEqual([2, 1]);
  });
});
