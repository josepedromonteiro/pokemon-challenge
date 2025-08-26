import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { usePokedexQuery } from '@/stores/pokedex-query.store';

function toParamMap(qs: string) {
  const m = new Map<string, string>();
  const s = qs.startsWith('?') ? qs.slice(1) : qs;
  const p = new URLSearchParams(s);
  for (const [k, v] of p.entries()) m.set(k, v);
  return m;
}

describe('usePokedexQuery', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initial state: empty query string and default filter', () => {
    const q = usePokedexQuery();
    expect(q.filter).toBeDefined();
    expect(q.filter.name).toBe('');
    expect(q.orderBy).toBeUndefined();
    expect(q.query.filter.name).toBe('');
    expect(q.query.orderBy).toBeUndefined();
    expect(q.queryString).toBe('');
  });

  it('setFilter(name,string) builds proper query string', () => {
    const q = usePokedexQuery();
    q.setFilter('name', 'pikachu');
    const params = toParamMap(q.queryString);
    expect(params.get('filter[name]')).toBe('pikachu');
  });

  it('setFilter(types,array) serializes as comma list', () => {
    const q = usePokedexQuery();
    q.setFilter('types', ['fire', 'water']);
    const params = toParamMap(q.queryString);
    expect(params.get('filter[types]')).toBe('fire,water');
  });

  it('setOrderBy adds orderBy to query string', () => {
    const q = usePokedexQuery();
    q.setFilter('name', 'bulbasaur');
    q.setOrderBy('newest');
    const params = toParamMap(q.queryString);
    expect(params.get('filter[name]')).toBe('bulbasaur');
    expect(params.get('orderBy')).toBe('newest');
  });

  it('removeFilter deletes a specific key', () => {
    const q = usePokedexQuery();
    q.setFilter('name', 'mew');
    expect(toParamMap(q.queryString).get('filter[name]')).toBe('mew');
    q.removeFilter('name');
    expect(toParamMap(q.queryString).get('filter[name]')).toBeUndefined();
  });

  it('clearFilters removes all filters but keeps orderBy', () => {
    const q = usePokedexQuery();
    q.setFilter('name', 'eevee');
    q.setFilter('types', ['normal']);
    q.setOrderBy('oldest');

    q.clearFilters();
    const params = toParamMap(q.queryString);
    expect(params.get('filter[name]')).toBeUndefined();
    expect(params.get('filter[types]')).toBeUndefined();
    expect(params.get('orderBy')).toBe('oldest');
    expect(Object.keys(q.query.filter)).toHaveLength(0);
  });

  it('reset clears filters and orderBy', () => {
    const q = usePokedexQuery();
    q.setFilter('name', 'snorlax');
    q.setOrderBy('height-desc');
    q.reset();
    expect(q.queryString).toBe('');
    expect(q.orderBy).toBeUndefined();
    expect(Object.keys(q.query.filter)).toHaveLength(0);
  });

  it('empty/null/[] values remove the filter key', () => {
    const q = usePokedexQuery();
    q.setFilter('name', 'abra');
    expect(toParamMap(q.queryString).get('filter[name]')).toBe('abra');

    q.setFilter('name', '');
    expect(toParamMap(q.queryString).get('filter[name]')).toBeUndefined();

    q.setFilter('types', ['psychic']);
    expect(toParamMap(q.queryString).get('filter[types]')).toBe('psychic');

    q.setFilter('types', []);
    expect(toParamMap(q.queryString).get('filter[types]')).toBeUndefined();

    q.setFilter('name', null);
    expect(toParamMap(q.queryString).get('filter[name]')).toBeUndefined();
  });

  it('changing filters updates queryString', () => {
    const q = usePokedexQuery();
    expect(q.queryString).toBe('');
    q.setFilter('name', 'onix');
    expect(toParamMap(q.queryString).get('filter[name]')).toBe('onix');
    q.setOrderBy('height-asc');
    expect(toParamMap(q.queryString).get('orderBy')).toBe('height-asc');
  });
});
