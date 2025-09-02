<template>
  <PaginationListItem
    data-slot="pagination-item"
    v-bind="delegatedProps"
    :class="
      cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        props.class
      )
    "
  >
    <slot />
  </PaginationListItem>
</template>

<script setup lang="ts">
import type { ButtonVariants } from '@/lib/ui/button';
import type { PaginationListItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

import { reactiveOmit } from '@vueuse/core';
import { PaginationListItem } from 'reka-ui';

import { buttonVariants } from '@/lib/ui/button';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<
    PaginationListItemProps & {
      size?: ButtonVariants['size'];
      class?: HTMLAttributes['class'];
      isActive?: boolean;
    }
  >(),
  {
    size: 'icon',
  }
);

const delegatedProps = reactiveOmit(props, 'class', 'size', 'isActive');
</script>
