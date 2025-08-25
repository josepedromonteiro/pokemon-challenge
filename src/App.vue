<script setup lang="ts">
import {RouterView} from 'vue-router'
import type {Item} from "@/models/toolbar.ts";
import Toolbar from "@/components/toolbar/Toolbar.vue";
import {onMounted} from "vue";


const tabs: Item[] = [
  {
    key: 'home', label: 'Home', icon: {
      type: 'image',
      src: 'images/pokemon.png',
      alt: 'Pokeball'
    }, to: '/'
  }, {
    key: 'pokedex', label: 'Pokédex', icon: {
      type: 'image',
      src: 'images/pokedex.png',
      alt: 'Pokeball'
    }, to: '/pokedex'
  }
]


// const setupTheme = () => {
//   const root = document.documentElement
//   const mq = window.matchMedia("(prefers-color-scheme: dark)")
//
//   function applyTheme(e: MediaQueryList | MediaQueryListEvent) {
//     if (e.matches) {
//       root.classList.add("dark")
//     } else {
//       root.classList.remove("dark")
//     }
//   }
//
//   // Apply on mount
//   applyTheme(mq)
//
//   // React to changes
//   mq.addEventListener("change", applyTheme)
// }

onMounted(() => {
  // setupTheme();
})

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-1 p-4 pb-[5.5rem] md:pb-4">
      <RouterView/>
    </main>
    <Toolbar disable-back-button :items="tabs"/>
  </div>
</template>
