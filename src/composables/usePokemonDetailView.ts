import {computed, reactive, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import type {ComputedRef} from 'vue';
import type {DeepPartial} from '@/types/deep-partial';
import type {PokemonDetail} from '@/models/api/pokemon-detail.api';
import type {PokedexEntry} from '@/models/pokedex';
import {normalizeDate} from '@vueuse/core';
import {pokeApiService} from '@/services/pokemon-api-service';
import {usePokedexStore} from '@/stores/pokedex.store';
import {mapPokemonDetailsToPokedexEntry} from '@/utils/pokedex.util';
import {toast} from 'vue-sonner';

type DetailState = {
    loading: boolean;
    error: boolean;
};

export function usePokemonDetailView() {
    const route = useRoute();
    const {isCaught, setNote, pokemonById, toggle} = usePokedexStore();

    /** Route-driven id */
    const currentId: ComputedRef<number | null> = computed(() => {
        const raw = String(route.params.id ?? '');
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
    });

    /** Local UI/data state */
    const state = reactive<DetailState>({loading: false, error: false});
    const pokemon = ref<DeepPartial<PokemonDetail> | undefined>(undefined);

    /** Dex-derived state */
    const pokemonInDex = computed<PokedexEntry | undefined>(() =>
        currentId.value ? pokemonById(currentId.value) : undefined
    );
    const caught = computed<boolean>(() =>
        currentId.value != null ? isCaught(currentId.value) : false
    );
    const caughtAt = computed<Date | undefined>(() =>
        pokemonInDex.value?.caughtAt ? normalizeDate(pokemonInDex.value.caughtAt) : undefined
    );

    /** Note binding */
    const note = ref<string>(pokemonInDex.value?.note ?? '');
    const saveNote = () => {
        if (currentId.value != null) setNote(currentId.value, note.value);
    };

    /** Toggle caught */
    const toggleCaught = () => {
        if (pokemon.value) {
            const entry = mapPokemonDetailsToPokedexEntry(pokemon.value);
            toggle({entry});
        }
    };

    /** Share helpers */
    const shareUsingClipBoard = async () => {
        try {
            await navigator.clipboard.writeText(location.href);
            toast.success('Link copied to clipboard!');
        } catch {
            toast.error('We found an issue copying the link. Please try again.');
        }
    };

    const shareUsingWebApi = async () => {
        try {
            const url = location.href;
            const title = currentId.value != null ? `#${currentId.value} Pokémon` : 'Pokémon';
            if (typeof navigator !== 'undefined' && (navigator as any).share) {
                await (navigator as any).share({title, text: 'Check out this Pokémon!', url});
                toast.success('Link successfully shared!');
            } else {
                await shareUsingClipBoard();
            }
        } catch {
            // user cancelled share; ignore
        }
    };

    /** Fetch detail */
    const loadPokemon = async () => {
        state.error = false;
        if (!currentId.value) return;
        state.loading = true;
        try {
            const data = await pokeApiService.getPokemonById(currentId.value);
            pokemon.value = data;
        } catch {
            state.error = true;
        } finally {
            state.loading = false;
        }
    };

    /** Keep note in sync with store */
    watch(
        () => pokemonInDex.value?.note,
        (v) => {
            note.value = v ?? '';
        },
        {immediate: true}
    );

    return {
        // raw state
        state,
        pokemon,
        note,
        // derived
        currentId,
        pokemonInDex,
        caught,
        caughtAt,
        // actions
        saveNote,
        toggleCaught,
        shareUsingClipBoard,
        shareUsingWebApi,
        loadPokemon,
    };
}
