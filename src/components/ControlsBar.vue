<template>
  <div class="controls">
    <h1 class="controls-title">Pokémon</h1>

    <div class="controls-right">
      <input
          v-model.trim="modelValueLocal"
          type="search"
          placeholder="Search Pokémon"
          class="search-input"
          @input="emitUpdate"
      />

      <!--      <label class="checkbox">-->
      <!--        <input type="checkbox" :checked="onlyCaught" @change="emitToggle" />-->
      <!--        <span>Only caught</span>-->
      <!--      </label>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void; }>()
const modelValueLocal = ref(props.modelValue)

watch(() => props.modelValue, v => modelValueLocal.value = v)

function emitUpdate() {
  emit('update:modelValue', modelValueLocal.value)
}
</script>

<style>
@reference "@/index.css";

@layer components {
  .controls {
    @apply flex flex-col gap-3 md:flex-row md:items-center md:justify-between;
  }

  .controls-title {
    @apply text-xl font-semibold;
  }

  .controls-right {
    @apply flex items-center gap-2;
  }

  .search-input {
    @apply h-10 w-64 max-w-full rounded-md
    border border-border/60 bg-background/70 px-3 outline-none backdrop-blur;
  }

  .checkbox {
    @apply inline-flex items-center gap-2 text-sm;
  }
}
</style>
