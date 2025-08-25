import type {FilterService} from "@/services/filter-service.interface.ts";
import type {PokedexEntry} from "@/models/pokedex.ts";
import type {Query} from "@/composables/useListQuery.ts";
import {usePokedex} from "@/composables/usePokedex.ts";
import {normalizeDate} from "@vueuse/core";

export type Filters = "name";
export type OrderByFields = "height-asc" | "height-desc" | "oldest" | "newest";

interface PokedexFilterResult {
    data: PokedexEntry[];
    // meta?: { total: number; page: number; limit: number; pages: number; hasNext: boolean; hasPrev: boolean };
}

function timeFrom(value: unknown): number {
    const d = normalizeDate(value as any);     // VueUse returns Date | null
    if (d) return d.getTime();
    if (value instanceof Date) return value.getTime();
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const ts = Date.parse(String(value ?? ""));
    return Number.isFinite(ts) ? ts : 0;
}

export class PokedexFilterService implements FilterService<PokedexFilterResult> {
    async list(query: Query<Filters, OrderByFields>): Promise<PokedexFilterResult> {
        const {pokemons} = usePokedex();
        const all: PokedexEntry[] = Array.isArray(pokemons.value) ? pokemons.value : [];

        const filter = (query?.filter ?? {}) as Record<string, string>;
        const orderToken = (query?.orderBy ?? "") as OrderByFields | "";

        // ---- filtering ----
        const name = (filter.name ?? "").toString().trim().toLowerCase();

        let filtered = all.filter((p) => {
            if (name) {
                const n = (p as any).name?.toString().toLowerCase() ?? "";
                if (!n.includes(name)) return false;
            }
            return true;
        });

        // ---- sorting by token ----
        if (orderToken) {
            filtered = [...filtered].sort((a, b) => {
                switch (orderToken) {
                    case "height-asc": {
                        const av = Number((a as any).height) || 0;
                        const bv = Number((b as any).height) || 0;
                        return av - bv;
                    }
                    case "height-desc": {
                        const av = Number((a as any).height) || 0;
                        const bv = Number((b as any).height) || 0;
                        return bv - av;
                    }
                    case "oldest": {
                        const ats = timeFrom((a as any).caughtAt ?? (a as any).addedAt ?? (a as any).createdAt);
                        const bts = timeFrom((b as any).caughtAt ?? (b as any).addedAt ?? (b as any).createdAt);
                        return ats - bts; // oldest first
                    }
                    case "newest": {
                        const ats = timeFrom((a as any).caughtAt ?? (a as any).addedAt ?? (a as any).createdAt);
                        const bts = timeFrom((b as any).caughtAt ?? (b as any).addedAt ?? (b as any).createdAt);
                        return bts - ats; // newest first
                    }
                    default:
                        return 0;
                }
            });
        }

        return {data: filtered};
    }
}
