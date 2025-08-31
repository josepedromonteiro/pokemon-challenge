import type { DynamicRow } from '@/components/DynamicTable.vue';
import type { PokemonDetail, Stat } from '@/models/api/pokemon-detail.api.ts';
import type {
  DeepPartial,
  DeepPartialWithRequired,
} from '@/types/deep-partial.ts';

import { generateSpritesWillFallback } from '@/models/api/poke.api.ts';

export type ViewMode = 'grid' | 'table';

export interface ViewerItem extends TableRowData, GridItemData {}

export interface GridItemData {
  id: number;
  name: string;
  sprite: string;
}

export interface TableRowData extends DynamicRow {
  id: number;
  name: string;
  sprite: string;
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

interface Capture {
  isCaught: boolean;
  caughtAt?: string;
}
const statsByName = (stats: DeepPartial<Stat>[]) => {
  const statsByName: Record<string, number> = {};
  for (const s of stats ?? []) {
    statsByName[s.stat?.name ?? ''] = s.base_stat ?? 0;
  }
  return statsByName;
};

export const mapToTableRowData = (
  p: DeepPartial<PokemonDetail>,
  capture: Capture
): TableRowData => {
  const sprite = generateSpritesWillFallback(p);
  const stats = statsByName(p.stats ?? []);

  return {
    attack: stats['attack'] ?? 0,
    caughtAt: capture.caughtAt,
    defense: stats['defense'] ?? 0,
    height: p.height ?? 0,
    hp: stats['hp'] ?? 0,
    id: p.id!,
    isCaught: capture.isCaught,
    name: p.name ?? '',
    specialAttack: stats['special-attack'] ?? 0,
    specialDefense: stats['special-defense'] ?? 0,
    speed: stats['speed'] ?? 0,
    sprite,
    types: (p.types ?? []).map((t) => t.type?.name ?? '') ?? [],
    weight: p.weight ?? 0,
  };
};

export const mapToViewerItem = (
  p: DeepPartial<PokemonDetail>,
  capture?: Capture
): ViewerItem => {
  const sprite = generateSpritesWillFallback(p);
  const stats = statsByName(p.stats ?? []);

  return {
    attack: stats['attack'] ?? 0,
    caughtAt: capture?.caughtAt,
    defense: stats['defense'] ?? 0,
    height: p.height ?? 0,
    hp: stats['hp'] ?? 0,
    id: p.id!,
    isCaught: capture?.isCaught ?? false,
    name: p.name ?? '',
    specialAttack: stats['special-attack'] ?? 0,
    specialDefense: stats['special-defense'] ?? 0,
    speed: stats['speed'] ?? 0,
    sprite,
    types: (p.types ?? []).map((t) => t.type?.name ?? '') ?? [],
    weight: p.weight ?? 0,
  };
};

export type SecurePokemonDetail = DeepPartialWithRequired<PokemonDetail, 'id'>;
