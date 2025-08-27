<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        :disabled="disabled"
        variant="outline"
        class="w-56 justify-between"
      >
        <div class="flex min-w-0 flex-1 items-center gap-1">
          <template v-if="selectedLabels.length">
            <Badge
              v-for="(label, i) in visibleLabels"
              :key="label + i"
              variant="secondary"
              class="max-w-[8rem] truncate capitalize"
              :title="label"
            >
              {{ label }}
            </Badge>
            <Badge v-if="hiddenCount > 0" variant="outline"
              >+{{ hiddenCount }}</Badge
            >
          </template>

          <span v-else class="truncate text-foreground/60">
            {{ placeholder }}
          </span>
        </div>

        <div class="ml-2 flex items-center gap-1">
          <ChevronsUpDown class="h-4 w-4 opacity-60" />
        </div>
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-64 p-0" align="start">
      <Command>
        <CommandInput v-if="searchable" :placeholder="searchPlaceholder" />
        <CommandEmpty>No results</CommandEmpty>

        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="opt in filteredOptions"
              :key="opt.value"
              :value="opt.label"
              @select="toggle(opt.value)"
              class="flex items-center"
            >
              <Checkbox
                class="mr-2"
                :model-value="selected.has(opt.value)"
                @update:checked="() => toggle(opt.value)"
              />
              <span class="capitalize">{{ opt.label }}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>

      <div class="flex items-center justify-between border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          @click="clear"
          :disabled="!selected.size"
          >Clear</Button
        >
        <div class="flex items-center gap-2">
          <span class="text-xs text-foreground/60"
            >{{ selected.size }} selected</span
          >
          <Button size="sm" @click="done">Done</Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandItem,
  CommandGroup,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronsUpDown } from 'lucide-vue-next';

// TODO - Move type declarations to a separate file

type Option = { label: string; value: string };

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    options: Option[];
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    searchable?: boolean;
    maxTags?: number;
  }>(),
  {
    placeholder: 'Select…',
    searchPlaceholder: 'Search…',
    disabled: false,
    clearable: true,
    searchable: true,
    maxTags: 1,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: string[]): void;
  (e: 'change', v: string[]): void;
  (e: 'open-change', v: boolean): void;
  (e: 'done', v: string[]): void;
}>();

const open = ref(false);

const selected = computed(() => new Set(props.modelValue));
const byValue = computed<Record<string, string>>(() => {
  const m: Record<string, string> = {};
  for (const o of props.options) m[o.value] = o.label;
  return m;
});
const selectedLabels = computed(() =>
  props.modelValue.map((v) => byValue.value[v]).filter(Boolean)
);
const visibleLabels = computed(() =>
  selectedLabels.value.slice(0, props.maxTags)
);
const hiddenCount = computed(() =>
  Math.max(0, selectedLabels.value.length - props.maxTags)
);
const filteredOptions = computed(() => props.options);

const toggle = (value: string) => {
  const s = new Set(selected.value);
  s.has(value) ? s.delete(value) : s.add(value);
  const next = [...s];
  emit('update:modelValue', next);
  emit('change', next);
};

const clear = () => {
  if (!selected.value.size) return;
  emit('update:modelValue', []);
  emit('change', []);
};

const done = () => {
  open.value = false;
  emit('done', props.modelValue);
};

watch(open, (v) => emit('open-change', v));
</script>
