<template>
  <nav
      role="navigation"
      aria-label="Primary"
      :class="[
      'navbar z-50 px-3',
      position === 'top' && 'sticky top-3 mx-auto max-w-5xl',
      position === 'bottom' && 'sticky inset-x-0 bottom-3 mx-auto w-fit',
    ]"
  >
    <!-- BAR -->
    <div class="toolbar">
      <!-- MAIN slot -->
      <div class="toolbar-main">
        <slot name="main">
          <ul class="flex items-center gap-1">

            <li v-if="canGoBack" key="back">
              <button class="tab" @click="goBack">
                <ToolbarIcon
                    class="tab__icon"
                    aria-hidden="true"
                    :icon="ArrowLeft"
                />
              </button>
            </li>
            <li v-for="item in items" :key="item.key">
              <component
                  :is="item.componentTag"
                  :href="item.href"
                  :to="item.to"
                  class="tab"
                  active-class="tab-active"
                  exact-active-class="tab-active"
                  @click="item.onClick?.()"
              >
                <ToolbarIcon
                    v-if="item.icon"
                    class="tab-icon"
                    aria-hidden="true"
                    :icon="item.icon"
                />
                <span class="tab-label">{{ item.label }}</span>
              </component>
            </li>
          </ul>
        </slot>
      </div>
    </div>

    <!-- Safe-area for iOS -->
    <div
        v-if="position !== 'top'"
        class="block md:hidden h-[env(safe-area-inset-bottom)]"
    ></div>
  </nav>
</template>

<script setup lang="ts">
import {computed, defineComponent} from 'vue'
import ToolbarIcon from '@/components/toolbar/ToolbarIcon.vue'
import type {Item} from "@/models/toolbar.ts";
import {ArrowLeft} from "lucide-vue-next";
import {useRouter} from "vue-router";

defineComponent({name: 'Toolbar'})

const props = withDefaults(
    defineProps<{
      items?: Item[]
      position?: 'top' | 'bottom',
      disableBackButton?: boolean
    }>(),
    {
      items: () => [],
      position: 'bottom',
      disableBackButton: true
    }
)

const router = useRouter()

const items = computed(() =>
    (props.items ?? []).map(i => ({
      ...i,
      componentTag: i.to ? 'router-link' : i.href ? 'a' : 'button',
    }))
)


// true if there is something to go back to
const canGoBack = computed(() => {
  return !props.disableBackButton && !!window.history.state.back
})

const goBack = () => {
  router.back()
};
</script>

<style>
@reference "@/index.css";

@layer components {

  nav {
    position: relative; /* important so ::before anchors to nav */

    &::before {
      @apply fixed left-0 bottom-0 -z-10 w-full h-32 block pointer-events-none;
      content: '';
      background: linear-gradient(
          to top,
          var(--background) 0%,
          color-mix(in oklch, var(--background) 0%, transparent) 100%
      );
    }
  }


  .toolbar {
    @apply flex items-center justify-between gap-1 rounded-[100px]
    p-1
    border border-border
    bg-background/50 backdrop-blur shadow-2xl;
  }

  .toolbar-main {
    @apply min-w-0 flex-1;
  }

  /* Tabs */
  .tab {
    @apply inline-flex items-center gap-2 rounded-[100px] px-3 h-9
    text-foreground/90 hover:text-primary
    hover:bg-primary/15 border border-transparent cursor-pointer transition-all;
  }

  .tab-icon {
    @apply text-base;
  }

  .tab-label {
    @apply text-sm font-medium;
  }

  .tab-active {
    @apply bg-primary/10 text-primary;
  }
}
</style>
