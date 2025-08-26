import type {
  PokemonPagedResponse,
  PokemonSummary,
} from '@/models/api/poke.api.ts';
import type { PokemonDetail } from '@/models/api/pokemon-detail.api.ts';
import type { DeepPartial } from '@/types/deep-partial.ts';

export interface PokemonService {
  getAllPokemon(
    limit?: number,
    offset?: number
  ): Promise<PokemonPagedResponse<PokemonSummary>>;

  getPokemonCount(): Promise<number>;

  getPokemonById(id: number): Promise<DeepPartial<PokemonDetail>>;

  getPokemonTypes(): Promise<any>;

  getPokemonPageWithDetails(
    limit?: number,
    offset?: number,
    opts?: { concurrency?: number; ignoreErrors?: boolean }
  ): Promise<PokemonPagedResponse<DeepPartial<PokemonDetail>>>;
}
