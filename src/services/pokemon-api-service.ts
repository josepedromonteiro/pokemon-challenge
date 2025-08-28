import type { PokemonTypesResponse } from '@/models/api/poke-type.api.ts';
import type {
  PokemonPagedResponse,
  PokemonSummary,
} from '@/models/api/poke.api.ts';
import type { PokemonDetail } from '@/models/api/pokemon-detail.api.ts';
import type { PokemonService } from '@/services/pokemon-service.interface.ts';
import type { DeepPartial } from '@/types/deep-partial.ts';
import type { HttpClient } from '@/types/http.ts';

import { createHttpClient } from '@/services/http-client.ts';

export class PokemonApiService implements PokemonService {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getPokemonCount(): Promise<number> {
    // Will only fetch 1 item but the response contains the total count
    const response =
      await this.httpClient.get<PokemonPagedResponse<PokemonSummary>>(
        `/pokemon?limit=1`
      );

    return response.data.count;
  }

  async getAllPokemon(limit = 50, offset = 0) {
    const response = await this.httpClient.get<
      PokemonPagedResponse<PokemonSummary>
    >(`/pokemon?limit=${limit}&offset=${offset}`);
    return response.data;
  }

  async getPokemonById(id: number): Promise<DeepPartial<PokemonDetail>> {
    const response = await this.httpClient.get<DeepPartial<PokemonDetail>>(
      `/pokemon/${id}`
    );
    return response.data;
  }

  // Improve to support pagination
  async getPokemonTypes(): Promise<PokemonTypesResponse> {
    const response = await this.httpClient.get<PokemonTypesResponse>(
      `/type?limit=100&offset=0`
    );
    return response.data;
  }

  /**
   * Fetches a paginated list of Pokémon with their full details.
   *
   * Steps:
   *  1. Calls `getAllPokemon` to get a summary list for the given page.
   *  2. For each Pokémon in the list, resolves its detailed data
   *     by calling `getPokemonById`.
   *  3. If `ignoreErrors` is true (default), failed requests are replaced
   *     with a minimal `{ id, name }` object instead of throwing.
   *
   * @param limit - Number of Pokémon to fetch (default 50).
   * @param offset - Starting index for pagination (default 0).
   * @param opts.concurrency - Maximum number of concurrent requests (default 8).
   * @param opts.ignoreErrors - Whether to continue on errors (default true).
   * @returns A `PokemonPagedResponse` containing count, pagination info,
   *          and an array of detailed or partial Pokémon entries.
   */
  async getPokemonPageWithDetails(
    limit = 50,
    offset = 0,
    opts: { concurrency?: number; ignoreErrors?: boolean } = {}
  ): Promise<PokemonPagedResponse<DeepPartial<PokemonDetail>>> {
    const { concurrency = 8, ignoreErrors = true } = opts;

    const page = await this.getAllPokemon(limit, offset);

    const queue: Promise<void>[] = [];
    const results: DeepPartial<PokemonDetail>[] = new Array(
      page.results.length
    );

    const run = async (i: number) => {
      const summary = page.results[i]; // { name, url }
      try {
        const id = Number(summary.url.replace(/\/+$/, '').split('/').pop()!);
        const detail = await this.getPokemonById(id);
        results[i] = detail;
      } catch (err) {
        if (!ignoreErrors) throw err;
        results[i] = {
          id: Number(summary.url.replace(/\/+$/, '').split('/').pop()!),
          name: summary.name,
        } as DeepPartial<PokemonDetail>;
      }
    };

    for (let i = 0; i < (page.results?.length ?? 0); i++) {
      const p = (async () => {
        while (queue.length >= concurrency) {
          await Promise.race(queue);
          for (let j = queue.length - 1; j >= 0; j--) {
            if (
              await Promise.resolve(queue[j]).then(
                () => true,
                () => true
              )
            )
              queue.splice(j, 1);
          }
        }
        const task = run(i);
        queue.push(task);
        try {
          await task;
        } finally {
          const idx = queue.indexOf(task);
          if (idx >= 0) queue.splice(idx, 1);
        }
      })();
      await p; // ensures the queue maintenance works predictably
    }

    await Promise.allSettled(queue);

    return {
      count: page.count,
      next: page.next,
      previous: page.previous,
      results,
    };
  }
}

const client: HttpClient = createHttpClient({
  baseURL: import.meta.env.VITE_POKE_API_BASE_URL,
});

export const pokeApiService = new PokemonApiService(client);
