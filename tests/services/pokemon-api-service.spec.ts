import { describe, it, expect, vi } from 'vitest';
import type { HttpClient } from '@/types/http';
import { PokemonApiService } from '@/services/pokemon-api-service.ts';

const mockHttp = (): HttpClient => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
});

describe('PokemonApiService', () => {
  it('calls correct endpoints', async () => {
    const http = mockHttp();
    (http.get as any).mockResolvedValueOnce({
      data: { count: 1, next: null, previous: null, results: [] },
    });
    const svc = new PokemonApiService(http);

    await svc.getAllPokemon(50, 100);
    expect(http.get).toHaveBeenCalledWith('/pokemon?limit=50&offset=100');
    (http.get as any).mockResolvedValueOnce({
      data: { id: 25, name: 'pikachu' },
    });
    await svc.getPokemonById(25);
    expect(http.get).toHaveBeenCalledWith('/pokemon/25');
    (http.get as any).mockResolvedValueOnce({ data: { results: [] } });
    await svc.getPokemonTypes();
    expect(http.get).toHaveBeenCalledWith('/type?limit=100&offset=0');
  });

  it('getPokemonPageWithDetails honors concurrency and ignoreErrors', async () => {
    const http = mockHttp();
    (http.get as any)
      .mockResolvedValueOnce({
        data: {
          count: 3,
          next: null,
          previous: null,
          results: [
            { name: 'a', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'b', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
            { name: 'c', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
          ],
        },
      })
      .mockResolvedValueOnce({ data: { id: 1, name: 'a' } })
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: { id: 3, name: 'c' } });

    const svc = new PokemonApiService(http);
    const page = await svc.getPokemonPageWithDetails(3, 0, {
      concurrency: 2,
      ignoreErrors: true,
    });

    expect(page.results.map((r: any) => r.id)).toEqual([1, 2, 3]);
    expect(page.results[1]).toMatchObject({ id: 2, name: 'b' });
  });

  it('throws when ignoreErrors=false', async () => {
    const http = mockHttp();
    (http.get as any)
      .mockResolvedValueOnce({
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [{ name: 'a', url: '.../pokemon/99/' }],
        },
      })
      .mockRejectedValueOnce(new Error('nope'));

    const svc = new PokemonApiService(http);
    await expect(
      svc.getPokemonPageWithDetails(1, 0, { ignoreErrors: false })
    ).rejects.toThrow();
  });
});
