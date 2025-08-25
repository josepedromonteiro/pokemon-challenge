import type {PokemonDetail} from "@/models/api/pokemon-detail.api.ts";
import type {DeepPartial} from "@/models/utils/deep-partial.ts";

export type ViewMode = 'grid' | 'table';

export interface GridItemData {
    id: number;
    name: string;
    image: string;
}


export function toGridItem(d: DeepPartial<PokemonDetail>): GridItemData {
    const id = d.id!
    return {
        id,
        name: d.name ?? String(id),
        image:
            d.sprites?.other?.['official-artwork']?.front_default ??
            d.sprites?.front_default ??
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        // types: (d.types ?? []).map(t => t.type!.name),
    }
}


// Height, Weight, Health (HP), Speed, Attack, Defense, Special Attack, Special Defense and its types, Name, Image, caughtAt?, caught?
export interface TableRowData {
    id: number
    name: string
    sprite?: string
    types?: string[]
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
    isCaught: boolean
    height: number
    weight: number
    caughtAt?: string // ISO string (or Date if you prefer)
}

export function mapToTableRowData(
    p: DeepPartial<PokemonDetail>,
    capture: { isCaught: boolean, caughtAt?: string }
): TableRowData {
    // map stats safely
    const statsByName: Record<string, number> = {}
    for (const s of p.stats ?? []) {
        statsByName[s.stat?.name ?? ''] = s.base_stat ?? 0
    }

    // pick a good sprite (fallbacks)
    const sprite =
        p.sprites?.other?.['official-artwork']?.front_default ??
        p.sprites?.front_default ??
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`;

    return {
        id: p.id!,
        name: p.name ?? '',
        sprite,
        types: (p.types ?? []).map(t => t.type?.name ?? '') ?? [],
        hp: statsByName['hp'] ?? 0,
        attack: statsByName['attack'] ?? 0,
        defense: statsByName['defense'] ?? 0,
        specialAttack: statsByName['special-attack'] ?? 0,
        specialDefense: statsByName['special-defense'] ?? 0,
        speed: statsByName['speed'] ?? 0,
        isCaught: capture.isCaught,
        height: p.height ?? 0,
        weight: p.weight ?? 0,
        caughtAt: capture.caughtAt
    }
}
