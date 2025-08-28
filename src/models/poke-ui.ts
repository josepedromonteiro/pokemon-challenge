import type { DynamicRow } from '@/components/DynamicTable.vue';
import type { PokemonDetail } from '@/models/api/pokemon-detail.api.ts';
import type { DeepPartial } from '@/types/deep-partial.ts';

import { generateSpritesWillFallback } from '@/models/api/poke.api.ts';

export type ViewMode = 'grid' | 'table';

export interface GridItemData {
  id: number;
  name: string;
  image: string;
}

export interface TableRowData extends DynamicRow {
  id: number;
  name: string;
  sprite?: string;
  types?: string[];
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  isCaught: boolean;
  height: number;
  weight: number;
  caughtAt?: string;
}

export const mapToTableRowData = (
  p: DeepPartial<PokemonDetail>,
  capture: { isCaught: boolean; caughtAt?: string }
): TableRowData => {
  // map stats safely
  const statsByName: Record<string, number> = {};
  for (const s of p.stats ?? []) {
    statsByName[s.stat?.name ?? ''] = s.base_stat ?? 0;
  }

  const sprite = generateSpritesWillFallback(p);

  return {
    attack: statsByName['attack'] ?? 0,
    caughtAt: capture.caughtAt,
    defense: statsByName['defense'] ?? 0,
    height: p.height ?? 0,
    hp: statsByName['hp'] ?? 0,
    id: p.id!,
    isCaught: capture.isCaught,
    name: p.name ?? '',
    specialAttack: statsByName['special-attack'] ?? 0,
    specialDefense: statsByName['special-defense'] ?? 0,
    speed: statsByName['speed'] ?? 0,
    sprite,
    types: (p.types ?? []).map((t) => t.type?.name ?? '') ?? [],
    weight: p.weight ?? 0,
  };
};
