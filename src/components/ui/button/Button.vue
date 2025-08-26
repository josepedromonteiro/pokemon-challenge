<script setup lang="ts">
import { computed } from 'vue';
import { Primitive, type PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '.';
import { cn } from '@/lib/utils';
import { buttonVariants } from '.';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];

  to?: RouteLocationRaw;
  replace?: boolean;
  activeClass?: string;
  exactActiveClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
});

const Comp = computed(() => (props.to ? RouterLink : props.as));

const linkBind = computed(() =>
  props.to
    ? {
        to: props.to,
        replace: props.replace,
        activeClass: props.activeClass,
        exactActiveClass: props.exactActiveClass,
      }
    : {}
);
</script>

<template>
  <Primitive
    data-slot="button"
    :as="Comp"
    :as-child="asChild"
    v-bind="linkBind"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
