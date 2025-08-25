<template>
  <div v-if="isLoading" class="panel">
    <PokemonDetailLayoutLoading/>
  </div>

  <div v-else class="panel">
    <!-- Header -->
    <div class="header">
      <div></div>
      <div class="header-right">
        <Button variant="secondary" @click="$emit('share')">Share</Button>
        <Button :class="caught && 'btn--primary'" @click="$emit('toggle-caught')">
          {{ caught ? 'Release' : 'Catch' }}
        </Button>
      </div>
    </div>

    <div v-if="localError" class="panel panel--error">
      <p class="text-sm">Failed to load Pokémon.</p>
    </div>

    <!-- Content -->
    <div v-else class="content">
      <div class="info">
        <img :src="image" :alt="data?.name" class="info-img" @error="onImgError"/>
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
        <div v-for="s in statList" :key="s.key" class="stat">
          <div class="stat-label">
            <span class="capitalize">{{ s.key }}</span>
            <span class="stat-value">{{ s.value }}</span>
          </div>
          <div class="stat-bar">
            <div class="stat-fill" :style="{ width: s.pct + '%' }"/>
          </div>
        </div>
      </div>

      <div v-if="caught" class="note">
        <label class="note-label" for="note">Note</label>
        <textarea
            id="note"
            :value="note"
            @input="$emit('update:note', ($event.target as HTMLTextAreaElement).value)"
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
import {computed, ref, watch} from 'vue'
import {Button} from "@/components/ui/button";
import type {PokemonDetail} from "@/models/api/pokemon-detail.api.ts";
import PokemonDetailLayoutLoading from "@/layouts/PokemonDetailLayoutLoading.vue";

const props = withDefaults(defineProps<{
  pokemon?: PokemonDetail
  loading?: boolean
  error?: boolean
  caught?: boolean
  caughtAt?: Date | null
  note?: string
}>(), {
  idOrName: null,
  loading: undefined,
  error: false,
  caught: false,
  caughtAt: null,
  note: '',
})

defineEmits<{
  (e: 'close'): void
  (e: 'share'): void
  (e: 'toggle-caught'): void
  (e: 'update:note', v: string): void
  (e: 'save-note'): void
}>()


const data = ref<PokemonDetail | null>(props.pokemon ?? null)

const isLoading = computed(() => (props.loading))
const localError = computed(() => props.error)
const caughtAtPretty = computed(() => (props.caughtAt ? props.caughtAt.toLocaleString() : ''))

watch(() => props.pokemon, v => {
  data.value = v ?? data.value
})

const image = computed(() => {
  const d = data.value
  if (!d) return ''
  return d.sprites?.other?.['official-artwork']?.front_default
      ?? d.sprites?.front_default
      ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${d.id}.png`
})

const types = computed(() =>
    (data.value?.types ?? [])
        .slice()
        .sort((a, b) => a.slot - b.slot)
        .map(t => t.type.name)
)

const statList = computed(() => {
  const map = new Map<string, number>()
  for (const s of (data.value?.stats ?? [])) map.set(s.stat.name, s.base_stat)
  const mk = (k: string, v: number, max = 200) => ({key: k, value: v, pct: Math.round(Math.min(100, (v / max) * 100))})
  return [
    mk('hp', map.get('hp') ?? 0),
    mk('attack', map.get('attack') ?? 0),
    mk('defense', map.get('defense') ?? 0),
    mk('special-attack', map.get('special-attack') ?? 0),
    mk('special-defense', map.get('special-defense') ?? 0),
    mk('speed', map.get('speed') ?? 0),
  ]
})

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  const d = data.value
  if (!d) return
  el.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${d.id}.png`
}
</script>

<style>
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

  .btn {
    @apply rounded-md border border-border/60 bg-background/70 px-3 py-2 backdrop-blur;
  }

  .btn--primary {
    @apply bg-primary text-primary-foreground border-transparent;
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

  .stat-bar {
    @apply h-2 rounded bg-muted/60 overflow-hidden;
  }

  .stat-fill {
    @apply h-full bg-primary;
  }

  .note {
    @apply space-y-2;
  }

  .note-label {
    @apply text-sm font-medium;
  }

  .note-textarea {
    @apply w-full resize-y rounded-md border border-border/60 bg-background/70 p-3 outline-none backdrop-blur;
  }

  .note-hint {
    @apply text-xs text-foreground/60;
  }
}
</style>
