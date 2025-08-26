<!-- TODO decompose this component, it's too big -->
<template>
  <div v-if="isLoading" class="panel">
    <PokemonDetailLayoutLoading />
  </div>
  <div v-else class="panel">
    <div class="header">
      <div></div>
      <div class="header-right">
        <slot name="share">
          <Button variant="secondary" @click="$emit('share')">Share</Button>
        </slot>
        <Button
          size="sm"
          :variant="caught ? 'outline' : 'default'"
          @click="$emit('toggle-caught')"
        >
          {{ caught ? 'Release' : 'Catch' }}
        </Button>
      </div>
    </div>

    <div v-if="localError" class="panel panel--error">
      <p class="text-sm">Failed to load Pokémon.</p>
    </div>
    <div v-else class="content">
      <div class="info">
        <img
          :src="imageSrc"
          :alt="data?.name"
          class="info-img"
          @error="onImgError"
        />
        <div class="info-meta">
          <h1 class="info-title">
            <span class="capitalize">{{ data?.name }}</span>
            <span class="info-id">#{{ data?.id }}</span>
          </h1>

          <div class="info-types">
            <span v-for="t in types" :key="t" class="type">{{ t }}</span>
          </div>

          <dl class="facts">
            <div>
              <dt>Height</dt>
              <dd>{{ data?.height }}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{{ data?.weight }}</dd>
            </div>
            <div v-if="caughtAt">
              <dt>Caught at</dt>
              <dd>{{ caughtAtPretty }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="stats">
        <div v-for="s in capabilitiesList" :key="s.key" class="stat">
          <div class="stat-label">
            <span class="capitalize">{{ s.key }}</span>
            <span class="stat-value">{{ s.value }}</span>
          </div>
          <ProgressBar :value="s.pct"></ProgressBar>
        </div>
      </div>

      <div v-if="caught" class="note">
        <label class="note-label" for="note">Note</label>
        <textarea
          id="note"
          :value="note"
          @input="
            $emit('update:note', ($event.target as HTMLTextAreaElement).value)
          "
          @blur="$emit('save-note')"
          class="note-textarea"
          rows="3"
          placeholder="Add a personal note…"
        />
        <div class="note-hint">Saved automatically on blur.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { Button } from '@/components/ui/button';
import type { PokemonDetail } from '@/models/api/pokemon-detail.api';
import PokemonDetailLayoutLoading from '@/layouts/PokemonDetailLayoutLoading.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import { onImgError } from '@/utils/image.ts';

// Based on https://bulbapedia.bulbagarden.net/wiki/Base_stats
const STAT_CAP = 255;

const props = withDefaults(
  defineProps<{
    pokemon?: PokemonDetail;
    loading?: boolean;
    error?: boolean;
    caught?: boolean;
    caughtAt?: Date;
    note?: string;
  }>(),
  {
    loading: undefined,
    error: false,
    caught: false,
    note: '',
  }
);

defineEmits<{
  (e: 'close'): void;
  (e: 'share'): void;
  (e: 'toggle-caught'): void;
  (e: 'update:note', v: string): void;
  (e: 'save-note'): void;
}>();

const data = ref<PokemonDetail | null>(props.pokemon ?? null);
const imageSrc = ref<string>('');
const types = ref<string[]>([]);
type Capability = { key: string; label: string; value: number; pct: number };
const capabilitiesList = ref<Capability[]>([]);

const isLoading = computed(() => props.loading);
const localError = computed(() => props.error);
const caughtAtPretty = computed(() =>
  props.caughtAt ? props.caughtAt.toLocaleString() : ''
);

const labelize = (name: string) =>
  name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const setupImage = () => {
  imageSrc.value = data.value
    ? (data.value.sprites?.other?.['official-artwork']?.front_default ??
      data.value.sprites?.front_default ??
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.value.id}.png`)
    : '';
};

const setupTypes = () => {
  types.value = data.value
    ? (data.value.types ?? [])
        .slice()
        .sort((a, b) => a.slot - b.slot)
        .map((t) => t.type.name)
    : [];
};

const setupCapabilities = () => {
  capabilitiesList.value =
    data.value?.stats.map((s) => {
      const value = s.base_stat ?? 0;
      return {
        key: s.stat.name,
        label: labelize(s.stat.name),
        value,
        pct: Math.round((value / STAT_CAP) * 100),
      };
    }) ?? [];
};
function setupPokemonData() {
  setupImage();
  setupTypes();
  setupCapabilities();
}

onMounted(() => {
  setupPokemonData();
});

watch(
  () => props.pokemon,
  (v) => {
    data.value = v ?? null;
    setupPokemonData();
  },
  { immediate: true }
);
</script>

<style scoped>
@reference "@/index.css";

@layer components {
  .panel {
    @apply rounded-xl border-border/60 bg-card/70 p-4;
  }

  .panel--error {
    @apply border-destructive/40 bg-destructive/10;
  }

  .header {
    @apply mb-4 flex items-center justify-between;
  }

  .header-right {
    @apply flex items-center gap-2;
  }

  .content {
    @apply space-y-6;
  }

  .info {
    @apply flex flex-col gap-4 md:flex-row md:items-start;
  }

  .info-img {
    @apply h-40 w-40 shrink-0 self-center object-contain md:self-start;
  }

  .info-meta {
    @apply min-w-0 flex-1 space-y-3;
  }

  .info-title {
    @apply flex items-baseline gap-2 text-2xl font-semibold;
  }

  .info-id {
    @apply text-base text-foreground/60;
  }

  .info-types {
    @apply flex flex-wrap gap-2;
  }

  .type {
    @apply inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-xs capitalize;
  }

  .facts {
    @apply grid grid-cols-2 gap-2 text-sm;
  }

  .facts dt {
    @apply text-foreground/70;
  }

  .facts dd {
    @apply font-medium;
  }

  .stats {
    @apply grid gap-3 sm:grid-cols-2;
  }

  .stat {
    @apply space-y-1;
  }

  .stat-label {
    @apply flex items-baseline justify-between text-sm;
  }

  .stat-value {
    @apply font-semibold;
  }

  .note {
    @apply space-y-2;
  }

  .note-label {
    @apply text-sm font-medium;
  }

  .note-textarea {
    @apply w-full resize-y rounded-md border border-border/60 bg-background/70 p-3 backdrop-blur outline-none;
  }

  .note-hint {
    @apply text-xs text-foreground/60;
  }
}
</style>
