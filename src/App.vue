<template>
  <Toaster class="pointer-events-auto" />
  <div class="flex min-h-screen flex-col">
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <NavigationBar disable-back-button :items="TABS" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';

import NavigationBar from '@/components/navigation-bar/NavigationBar.vue';
import { Toaster } from '@/components/ui/sonner';
import { TABS } from '@/configs/toolbar.config.ts';
import { usePokedexStore } from '@/stores/pokedex.store.ts';
import 'vue-sonner/style.css'; // vue-sonner v2 requires this import

const { load } = usePokedexStore();

onMounted(() => {
  load();
});
</script>
