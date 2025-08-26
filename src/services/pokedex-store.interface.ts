import type {
  PokedexEntry,
  PokedexId,
  PokedexSnapshot,
} from '@/models/pokedex.ts';

export interface PokedexStore {
  load(): Promise<PokedexSnapshot>;
  save(snapshot: PokedexSnapshot): Promise<void>;
  catch(entry: PokedexEntry): Promise<void>;
  release(ids: PokedexId | PokedexId[]): Promise<void>;
  setNote(id: PokedexId, note: string): Promise<void>;
}
