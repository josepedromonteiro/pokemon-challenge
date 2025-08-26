import type {
  PokedexEntry,
  PokedexId,
  PokedexSnapshot,
} from '@/models/pokedex.ts';
import type { PokedexStore } from '@/services/pokedex-store.interface.ts';

export class LocalStoragePokedexStore implements PokedexStore {
  private key = 'pokedex';

  private read(): PokedexSnapshot {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? (JSON.parse(raw) as PokedexSnapshot) : {};
    } catch {
      return {};
    }
  }

  private write(data: PokedexSnapshot) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  async load(): Promise<PokedexSnapshot> {
    return this.read();
  }

  async save(snapshot: PokedexSnapshot): Promise<void> {
    this.write(snapshot);
  }

  async catch(entry: PokedexEntry): Promise<void> {
    const data = this.read();
    data[entry.id] = entry;
    this.write(data);
  }

  async release(ids: PokedexId | PokedexId[]): Promise<void> {
    const data = this.read();
    const list = Array.isArray(ids) ? ids : [ids];
    for (const id of new Set(list)) delete data[id];
    this.write(data);
  }

  async setNote(id: PokedexId, note: string): Promise<void> {
    const data = this.read();
    const existing = data[id];
    if (!existing) return;
    data[id] = { ...existing, note };
    this.write(data);
  }
}
