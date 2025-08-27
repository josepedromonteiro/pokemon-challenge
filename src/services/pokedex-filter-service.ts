import type { FilterService } from '@/services/filter-service.interface.ts';
import type { PokedexEntry } from '@/models/pokedex.ts';
import { normalizeDate } from '@vueuse/core';
import type { Query } from '@/models/filters.ts';

export type Filters = 'name' | 'types';
export type OrderByFields = 'height-asc' | 'height-desc' | 'oldest' | 'newest';

interface PokedexFilterResult {
  data: PokedexEntry[];
}

/** Parse various date inputs to ms since epoch; fallback to 0 on invalid. */
const timeFrom = (value: string): number => {
  const d = normalizeDate(value);
  if (d) return d.getTime();
  const ts = Date.parse(String(value ?? ''));
  return Number.isFinite(ts) ? ts : 0;
};

/** Normalize types filter to a lowercase string array. Accepts array or comma string. */
const parseTypes = (v?: string | string[] | null): string[] => {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : String(v).split(',');
  return arr.map((s) => s.trim().toLowerCase()).filter(Boolean);
};

/** True if entry has at least one of the requested types in the pokemon types */
const hasTypeEntries = (entry: PokedexEntry, needles: string[]): boolean => {
  if (!needles.length) return true;
  const hay = new Set((entry.types ?? []).map((t) => t.toLowerCase()));
  return needles.some((n) => hay.has(n));
};

export class PokedexFilterService
  implements FilterService<PokedexFilterResult>
{
  /** Getter for the current dataset */
  private readonly getAll: () => PokedexEntry[];

  constructor(getAll: () => PokedexEntry[]) {
    this.getAll = getAll;
  }

  /**
   * Returns a filtered and sorted list of Pokédex entries.
   */
  async list(
    query: Query<Filters, OrderByFields>
  ): Promise<PokedexFilterResult> {
    const all: PokedexEntry[] = this.getAll();

    const filter = (query?.filter ?? {}) as Record<string, string>;
    const orderToken = (query?.orderBy ?? '') as OrderByFields | '';

    const nameNeedle = (filter.name ?? '').toString().trim().toLowerCase();
    const typeNeedles = parseTypes(filter.types);

    // Filtering
    let filtered = all.filter((p) => {
      if (nameNeedle) {
        const n = (p.name ?? '').toString().toLowerCase();
        if (!n.includes(nameNeedle)) return false;
      }
      return hasTypeEntries(p, typeNeedles);
    });

    // Sorting
    if (orderToken) {
      filtered = [...filtered].sort((a, b) => {
        switch (orderToken) {
          case 'height-asc': {
            const av = Number(a.height) || 0;
            const bv = Number(b.height) || 0;
            return av - bv;
          }
          case 'height-desc': {
            const av = Number(a.height) || 0;
            const bv = Number(b.height) || 0;
            return bv - av;
          }
          case 'oldest': {
            const ats = timeFrom(a.caughtAt);
            const bts = timeFrom(b.caughtAt);
            return ats - bts; // oldest first
          }
          case 'newest': {
            const ats = timeFrom(a.caughtAt);
            const bts = timeFrom(b.caughtAt);
            return bts - ats; // newest first
          }
          default:
            return 0;
        }
      });
    }

    return { data: filtered };
  }
}
