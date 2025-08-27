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
            <Button variant="secondary" size="sm" class="flex items-center gap-2">
              <Share2 class="h-4 w-4"/>
              <span>Share</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-44">
            <DropdownMenuItem @click="shareUsingWebApi">
              <Send class="mr-2 h-4 w-4"/>
              <span>Share Link</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="shareUsingClipBoard">
              <Clipboard class="mr-2 h-4 w-4"/>
              <span>Copy Link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </PokemonDetailLayout>
  </section>
</template>

<script setup lang="ts">
import {onMounted, watch} from 'vue';
import PokemonDetailLayout from '@/layouts/PokemonDetailLayout.vue';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {Clipboard, Send, Share2} from 'lucide-vue-next';
import {usePokemonDetailView} from "@/composables/usePokemonDetailView.ts";


const {
  state,
  pokemon,
  note,
  currentId,
  caught,
  caughtAt,
  saveNote,
  toggleCaught,
  shareUsingClipBoard,
  shareUsingWebApi,
  loadPokemon,
} = usePokemonDetailView();

onMounted(() => {
  loadPokemon();
});

watch(currentId, () => {
  loadPokemon();
});
</script>
