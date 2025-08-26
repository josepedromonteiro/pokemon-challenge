import type {
    PokemonDetail,
    PokemonType,
} from '@/models/api/pokemon-detail.api.ts';
import type {PokedexEntryData} from '@/models/pokedex.ts';
import type {DeepPartial} from "@/types/deep-partial.ts";

export const artwork = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export function mapPokemonDetailsToPokedexEntry(
    details: PokemonDetail
): PokedexEntryData {
    return {
        id: details.id,
        name: details.name,
        image:
            details.sprites.other?.['official-artwork'].front_default ||
            details.sprites.front_default ||
            '',
        height: details.height,
        types: mapPokemonTypeToString(details.types),
    };
}

export function mapPokemonTypeToString(types: DeepPartial<PokemonType>[]) {
    return types.map((entry) => entry.type?.name ?? '');
}
