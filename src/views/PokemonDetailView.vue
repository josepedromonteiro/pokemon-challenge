<template>
  <section class="mx-auto max-w-4xl px-4 py-6">
    <PokemonDetailLayout
      :loading="state.loading"
      :error="state.error"
      :pokemon="pokemon"
      :caught="caught"
      :caughtAt="caughtAt"
      v-model:note="note"
      @toggle-caught="toggleCaught"
      @save-note="saveNote"
      @share="shareUsingWebApi"
    >
      <template #share>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="secondary"
              size="sm"
              class="flex items-center gap-2"
            >
              <Share2 class="h-4 w-4" />
              <span>Share</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-44">
            <DropdownMenuItem @click="shareUsingWebApi">
              <Send class="mr-2 h-4 w-4" />
              <span>Share Link</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="shareUsingClipBoard">
              <Clipboard class="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </PokemonDetailLayout>
  </section>
</template>

<script setup lang="ts">
import {
  computed,
  type ComputedRef,
  onMounted,
  reactive,
  type Ref,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import PokemonDetailLayout from '@/layouts/PokemonDetailLayout.vue';
import { pokeApiService } from '@/services/pokemon-api-service.ts';
import type { PokemonDetail } from '@/models/api/pokemon-detail.api.ts';
import { normalizeDate } from '@vueuse/core';
import { mapPokemonDetailsToPokedexEntry } from '@/utils/pokedex.util.ts';
import type { PokedexEntry } from '@/models/pokedex.ts';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Clipboard, Send, Share2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner'
import { usePokedexStore } from '@/stores/pokedex.store.ts';

const route = useRoute();
const { isCaught, setNote, pokemonById, toggle, load } = usePokedexStore();

const caught: ComputedRef<boolean> = computed(() =>
  currentId.value != null ? isCaught(currentId.value) : false
);
const pokemonInDex: ComputedRef<PokedexEntry | undefined> = computed(() =>
  currentId.value ? pokemonById(currentId.value) : undefined
);
const caughtAt: ComputedRef<Date | undefined> = computed(() =>
  pokemonInDex.value?.caughtAt
    ? normalizeDate(pokemonInDex.value?.caughtAt)
    : undefined
);
const currentId: ComputedRef<number | null> = computed(() => {
  const raw = String(route.params.id ?? '');
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
});

const state = reactive<{
  loading: boolean;
  error: boolean;
}>({
  loading: false,
  error: false,
});

const note = ref(pokemonInDex.value?.note ?? '');
const pokemon: Ref<PokemonDetail | undefined> = ref<
  PokemonDetail | undefined
>();

const saveNote = () => {
  if (currentId.value != null) {
    setNote(currentId.value, note.value);
  }
};

const toggleCaught = () => {
  if (pokemon.value) {
    toggle({ entry: mapPokemonDetailsToPokedexEntry(pokemon.value) });
  }
};

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
    const title =
      currentId.value != null ? `#${currentId.value} Pokémon` : 'Pokémon';
    if (navigator.share) {
      await navigator.share({ title, text: 'Check out this Pokémon!', url });
      toast.success('Link successfully shared!');
    } else {
      shareUsingClipBoard();
    }
  } catch {
    // toast.error('We found an issue sharing the link. Please try again.')
  }
};

const setupPokemon = async () => {
  state.error = false;
  if (!!currentId.value) {
    state.loading = true;
    pokeApiService
      .getPokemonById(currentId.value!)
      .then((pokemonData) => {
        pokemon.value = pokemonData;
      })
      .catch(() => {
        state.error = true;
      })
      .finally(() => {
        state.loading = false;
      });
  }
};

watch(
  () => pokemonInDex.value?.note,
  (v) => {
    note.value = v ?? '';
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  load();
  setupPokemon();
});
</script>
