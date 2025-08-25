import {createHttpClient, type HttpStatusMessage} from "@/services/http-client.ts";
import type {HttpClient} from "@/types/http.ts";
import type {PokemonPagedResponse, PokemonSummary} from "@/models/poke.api.ts";
import type {PokemonDetail, PokemonType} from "@/models/api/pokemon-detail.api.ts";
import type {DeepPartial} from "@/models/utils/deep-partial.ts";
import type {PokemonTypesResponse} from "@/models/api/poke-type.api.ts";

abstract class PokemonServiceContract {
    abstract getAllPokemon(limit?: number, offset?: number): Promise<PokemonPagedResponse<PokemonSummary>>;

    abstract getPokemonById(id: number): Promise<DeepPartial<PokemonDetail>>;

    abstract getPokemonTypes(): Promise<any>;

    abstract getPokemonPageWithDetails(
        limit?: number,
        offset?: number,
        opts?: { concurrency?: number; ignoreErrors?: boolean }
    ): Promise<PokemonPagedResponse<DeepPartial<PokemonDetail>>>;
}

export class PokemonService extends PokemonServiceContract {

    private readonly httpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        super();
        this.httpClient = httpClient
    }

    async getAllPokemon(limit = 50, offset = 0) {
        const response = await this.httpClient.get<PokemonPagedResponse<PokemonSummary>>(`/pokemon?limit=${limit}&offset=${offset}`);
        return response.data;
    }

    async getPokemonById(id: number): Promise<PokemonDetail> {
        const response = await this.httpClient.get<PokemonDetail>(`/pokemon/${id}`);
        return response.data;
    }

    // Improve to support pagination
    async getPokemonTypes(): Promise<PokemonTypesResponse> {
        const response = await this.httpClient.get<PokemonTypesResponse>(`/type?limit=100&offset=0`);
        return response.data;
    }


    async getPokemonPageWithDetails(
        limit = 50,
        offset = 0,
        opts: { concurrency?: number; ignoreErrors?: boolean } = {}
    ): Promise<PokemonPagedResponse<DeepPartial<PokemonDetail>>> {
        const { concurrency = 8, ignoreErrors = true } = opts;

        const page = await this.getAllPokemon(limit, offset);

        const queue: Promise<void>[] = [];
        const results: DeepPartial<PokemonDetail>[] = new Array(page.results.length);

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

        for (let i = 0; i < page.results.length; i++) {
            const p = (async () => {
                while (queue.length >= concurrency) {
                    await Promise.race(queue);
                    for (let j = queue.length - 1; j >= 0; j--) {
                        if (await Promise.resolve(queue[j]).then(() => true, () => true)) queue.splice(j, 1);
                    }
                }
                const task = run(i);
                queue.push(task);
                try { await task; } finally {
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
    baseURL: import.meta.env.VITE_POKE_API_BASE_URL
});

export const pokeApiService = new PokemonService(client);
