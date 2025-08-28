<template>
  <section class="mx-auto max-w-4xl px-4 py-6">
    <PokemonDetailLayout
      v-model:note="note"
      :loading="state.loading"
      :error="state.error"
      :pokemon="pokemon"
      :caught="caught"
      :caught-at="caughtAt"
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
import { Clipboard, Send, Share2 } from 'lucide-vue-next';
import { onMounted, watch } from 'vue';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { usePokemonDetailView } from '@/composables/usePokemonDetailView.ts';
import PokemonDetailLayout from '@/layouts/PokemonDetailLayout.vue';

const {
  caught,
  caughtAt,
  currentId,
  loadPokemon,
  note,
  pokemon,
  saveNote,
  shareUsingClipBoard,
  shareUsingWebApi,
  state,
  toggleCaught,
} = usePokemonDetailView();

onMounted(() => {
  loadPokemon();
});

watch(currentId, () => {
  loadPokemon();
});
</script>
