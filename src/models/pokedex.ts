export type PokedexId = number;

export interface PokedexEntryData {
  id: PokedexId;
  name: string;
  image: string;
  height: number;
  types: string[];
  note?: string;
}

export interface PokedexEntry extends PokedexEntryData {
  caughtAt: string;
}

export type PokedexSnapshot = Record<PokedexId, PokedexEntry>;
