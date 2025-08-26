<template>
  <RouterLink class="card" :to="'pokemon/' + id">
    <div class="card-row">
      <img
        :src="image"
        :alt="name"
        class="card-img"
        loading="lazy"
        @error="onImgError"
      />
      <div class="card-meta">
        <h2 class="card-name">{{ name }}</h2>
        <p class="card-id">#{{ id }}</p>
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

      <div v-else class="flex flex-1 justify-end">
        <Checkbox
          :model-value="selected"
          @click.stop.prevent="emit('onSelect')"
        />
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { onImgError } from '@/utils/image.ts';

defineProps<{
  id: number;
  name: string;
  image: string;
  caught: boolean;
  selecting?: boolean;
  selected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'onSelect'): void;
  (e: 'toggle-caught', id: number): void;
}>();
</script>

<style scoped>
@reference "@/index.css";

@layer components {
  .card {
    @apply rounded-lg border border-border/70 bg-card/70 p-3 shadow-lg shadow-foreground/[2%] backdrop-blur transition-all hover:bg-foreground/[5%] hover:shadow-none hover:shadow-xl;
  }

  .card-row {
    @apply flex items-center gap-2;
  }

  .card-img {
    @apply h-14 w-14 object-contain;
  }

  .card-meta {
    @apply min-w-0;
  }

  .card-name {
    @apply truncate font-medium capitalize;
  }

  .card-id {
    @apply text-xs text-foreground/60;
  }

  .chip {
    @apply ml-auto rounded-md border border-border/60 px-2 py-1 text-xs hover:bg-muted/60;
  }
}
</style>
