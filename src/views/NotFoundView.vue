<template>
  <section
    class="flex h-screen flex-col items-center justify-center gap-4 p-8 text-center"
  >
    <img
      src="/images/pokemon.png"
      alt="Broken Pokéball"
      class="h-48 w-48 animate-pulse"
    />
    <h1 class="mt-6 text-[72px] font-bold">404</h1>
    <p class="mt-2 text-lg text-muted-foreground">
      Oops! This Pokémon ran away…
    </p>
    <Button
      to="/"
      class="mt-6 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
    >
      Back to Home
    </Button>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/lib/ui/button';
</script>
