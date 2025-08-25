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
        @share="share"
    />
  </section>
</template>

<script setup lang="ts">
import {computed, type ComputedRef, onMounted, reactive, type Ref, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import PokemonDetailLayout from "@/layouts/PokemonDetailLayout.vue";
import {pokeApiService} from "@/services/pokeapi.ts";
import type {PokemonDetail} from "@/models/api/pokemon-detail.api.ts";
import {usePokedex} from "@/composables/usePokedex.ts";
import {mapPokemonDetailsToPokedexEntry, type PokedexEntry} from "@/models/pokedex.ts";
import {normalizeDate} from "@vueuse/core";

const route = useRoute()
const {isCaught, setNote, pokemonById, toggle, load} = usePokedex();

const caught: ComputedRef<boolean> = computed(() => currentId.value != null ? isCaught.value(currentId.value) : false);
const pokemonInDex: ComputedRef<PokedexEntry | undefined> = computed(() =>
    currentId.value ? pokemonById(currentId.value).value : undefined
);
const caughtAt: ComputedRef<Date | null> = computed(() => pokemonInDex.value?.caughtAt ? normalizeDate(pokemonInDex.value?.caughtAt) : null);
const currentId: ComputedRef<number | null> = computed(() => {
  const raw = String(route.params.idOrName ?? '')
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
})

const state = reactive<{
  loading: boolean;
  error: boolean
}>({
  loading: false,
  error: false
});
const note = ref(pokemonInDex.value?.note ?? '');
const pokemon: Ref<PokemonDetail | undefined> = ref<PokemonDetail | undefined>();


function saveNote() {
  if (currentId.value != null) {
    setNote(currentId.value, note.value);
  }
}

function toggleCaught() {
  if (pokemon.value) {
    toggle({entry: mapPokemonDetailsToPokedexEntry(pokemon.value)});
  }
}

async function share() {
  try {
    const url = location.href
    const title = currentId.value != null ? `#${currentId.value} Pokémon` : 'Pokémon'
    if (navigator.share) await navigator.share({title, text: 'Check out this Pokémon!', url})
    else {
      await navigator.clipboard.writeText(url);
    }
  } catch {
  }
}

const setupPokemon = async () => {
  state.error = false;
  if (!!currentId.value) {
    state.loading = true;
    pokeApiService.getPokemonById(currentId.value!).then((pokemonData) => {
      pokemon.value = pokemonData;
    })
        .catch(() => {
          state.error = true;
        })
        .finally(() => {
          state.loading = false;
        });
  }
}

watch(() => pokemonInDex.value?.note,
    (v) => {
      note.value = v ?? "";
    }, {
      immediate: true
    });

onMounted(() => {
  load();
  setupPokemon();
})
</script>
