<!--TODO - Create a single component for PokedexControls and ControlsBar-->
<template>
  <div class="toolbar controls">
    <h1 class="controls-title">Pokémon</h1>

    <div class="controls-right">
      <Input
        v-model.trim="modelValueLocal"
        type="search"
        placeholder="Search Pokémon"
        class="search-input"
        @input="emitUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Input } from '@/components/ui/input';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>();
const modelValueLocal = ref(props.modelValue);

const emitUpdate = () => {
  emit('update:modelValue', modelValueLocal.value);
};

watch(
  () => props.modelValue,
  (v) => (modelValueLocal.value = v)
);
</script>

<style scoped>
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
    @apply h-10 w-64 max-w-full rounded-md border border-border/60 bg-background/70 px-3 backdrop-blur outline-none;
  }
}
</style>
