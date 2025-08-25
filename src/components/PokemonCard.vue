<template>
  <RouterLink class="card" :to="'pokemon/' + id">
    <div class="card__row">
      <img
          :src="image"
          :alt="name"
          class="card__img"
          loading="lazy"
          @error="onImgError"
      />
      <div class="card__meta">
        <h2 class="card__name">{{ name }}</h2>
        <p class="card__id">#{{ id }}</p>
      </div>

      <Button
          v-if="!selecting"
          size="xs"
          class="chip"
          :variant="caught ? 'default' : 'outline'"
          @click.stop.prevent="emit('toggle-caught', id)"
      >
        {{ caught ? 'Release' : 'Catch' }}
      </Button>

      <div v-else class="flex justify-end flex-1">
        <Checkbox :model-value="selected" @click.stop.prevent="emit('onSelect')"/>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";

const props = defineProps<{
  id: number
  name: string
  image: string
  caught: boolean;
  selecting?: boolean;
  selected?: boolean;
}>()

const emit = defineEmits<{
  (e: 'onSelect'): void,
  (e: 'toggle-caught', id: number): void
}>()

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.id}.png`
}
</script>

<style>
@reference "@/index.css";

@layer components {
  .card {
    @apply rounded-lg border border-border/50 bg-card/70 p-3 backdrop-blur shadow-lg shadow-foreground/[2%] transition hover:bg-card;
  }

  .card__row {
    @apply flex items-center gap-2;
  }

  .card__img {
    @apply h-14 w-14 object-contain;
  }

  .card__meta {
    @apply min-w-0;
  }

  .card__name {
    @apply truncate font-medium capitalize;
  }

  .card__id {
    @apply text-xs text-foreground/60;
  }

  .chip {
    @apply ml-auto rounded-md border border-border/60 px-2 py-1 text-xs
    hover:bg-muted/60;
  }

  .chip--on {
    @apply bg-primary text-primary-foreground border-transparent;
  }
}
</style>
