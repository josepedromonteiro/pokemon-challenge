<template>
  <div class="content">
    <div class="info">
      <div class="skel skel-img" />
      <div class="info__meta">
        <div class="skel skel-line h-7 w-56" />
        <div class="mt-2 flex items-center gap-2">
          <div class="skel skel-line h-5 w-20" />
          <div class="skel skel-line h-5 w-10" />
        </div>

        <div class="info__types mt-3 flex flex-wrap gap-2">
          <span class="skel skel-chip h-6 w-14" />
          <span class="skel skel-chip h-6 w-16" />
          <span class="skel skel-chip h-6 w-12" />
        </div>

        <dl class="facts mt-4 grid grid-cols-2 gap-2">
          <div>
            <div class="skel skel-line mb-1 h-4 w-16" />
            <div class="skel skel-line h-5 w-20" />
          </div>
          <div>
            <div class="skel skel-line mb-1 h-4 w-16" />
            <div class="skel skel-line h-5 w-20" />
          </div>
          <div class="col-span-2">
            <div class="skel skel-line mb-1 h-4 w-20" />
            <div class="skel skel-line h-5 w-40" />
          </div>
        </dl>
      </div>
    </div>

    <div class="stats mt-6 grid gap-3 sm:grid-cols-2">
      <div v-for="i in 6" :key="i" class="space-y-1">
        <div class="flex items-baseline justify-between">
          <div class="skel skel-line h-4 w-24" />
          <div class="skel skel-line h-4 w-10" />
        </div>
        <div class="skel skel-bar h-2" />
      </div>
    </div>

    <div class="note mt-6 space-y-2">
      <div class="skel skel-line h-4 w-16" />
      <div class="skel skel-block h-24" />
      <div class="skel skel-line h-3 w-40" />
    </div>
  </div>
</template>
<style scoped>
@reference "@/index.css";

.skel {
  @apply animate-pulse rounded-md bg-muted/60;
}

.skel-line {
  @apply bg-muted;
}

.skel-chip {
  @apply rounded-md bg-muted;
}

.skel-bar {
  @apply rounded bg-muted;
}

.skel-block {
  @apply bg-muted;
}

.skel-img {
  @apply h-40 w-40 self-center rounded-lg bg-muted md:self-start;
}
</style>
