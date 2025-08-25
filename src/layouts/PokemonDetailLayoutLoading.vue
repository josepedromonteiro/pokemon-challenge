<template>
  <div class="content">
    <!-- top section -->
    <div class="info">
      <!-- image placeholder -->
      <div class="skel skel-img"/>

      <!-- meta -->
      <div class="info__meta">
        <div class="skel skel-line w-56 h-7"/>
        <div class="flex items-center gap-2 mt-2">
          <div class="skel skel-line w-20 h-5"/>
          <div class="skel skel-line w-10 h-5"/>
        </div>

        <div class="info__types mt-3 flex flex-wrap gap-2">
          <span class="skel skel-chip w-14 h-6"/>
          <span class="skel skel-chip w-16 h-6"/>
          <span class="skel skel-chip w-12 h-6"/>
        </div>

        <dl class="facts mt-4 grid grid-cols-2 gap-2">
          <div>
            <div class="skel skel-line w-16 h-4 mb-1"/>
            <div class="skel skel-line w-20 h-5"/>
          </div>
          <div>
            <div class="skel skel-line w-16 h-4 mb-1"/>
            <div class="skel skel-line w-20 h-5"/>
          </div>
          <div class="col-span-2">
            <div class="skel skel-line w-20 h-4 mb-1"/>
            <div class="skel skel-line w-40 h-5"/>
          </div>
        </dl>
      </div>
    </div>

    <!-- stats -->
    <div class="stats mt-6 grid gap-3 sm:grid-cols-2">
      <div v-for="i in 6" :key="i" class="space-y-1">
        <div class="flex items-baseline justify-between">
          <div class="skel skel-line w-24 h-4"/>
          <div class="skel skel-line w-10 h-4"/>
        </div>
        <div class="skel skel-bar h-2"/>
      </div>
    </div>

    <!-- note -->
    <div class="note mt-6 space-y-2">
      <div class="skel skel-line w-16 h-4"/>
      <div class="skel skel-block h-24"/>
      <div class="skel skel-line w-40 h-3"/>
    </div>
  </div>
</template>

<script setup lang="ts">
// purely presentational skeleton; no script needed
</script>

<style scoped>
@reference "@/index.css";

/* Base skeleton surface */
.skel {
  @apply animate-pulse rounded-md bg-muted/60;
}

/* Variants */
.skel-line {
  @apply bg-muted;
}

.skel-chip {
  @apply bg-muted rounded-md;
}

.skel-bar {
  @apply bg-muted rounded;
}

.skel-block {
  @apply bg-muted;
}

/* Matches your final layout sizes */
.skel-img {
  @apply h-40 w-40 rounded-lg bg-muted self-center md:self-start;
}
</style>
