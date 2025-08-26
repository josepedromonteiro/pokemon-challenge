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
    <div class="navigation-bar">
      <div class="navigation-bar-main">
        <slot name="main">
          <ul class="flex items-center gap-1">
            <li v-if="canGoBack" key="back">
              <button class="tab" @click="goBack">
                <NavigationBarIcon
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
                <NavigationBarIcon
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

    <!-- Safe Area support-->
    <div
      v-if="position !== 'top'"
      class="block h-[env(safe-area-inset-bottom)] md:hidden"
    ></div>
  </nav>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue';
import NavigationBarIcon from '@/components/navigation-bar/NavigationBarIcon.vue';
import type { Item } from '@/models/toolbar.ts';
import { ArrowLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

defineComponent({ name: 'NavigationBar' });

const props = withDefaults(
  defineProps<{
    items?: Item[];
    position?: 'top' | 'bottom';
    disableBackButton?: boolean;
  }>(),
  {
    items: () => [],
    position: 'bottom',
    disableBackButton: true,
  }
);

const router = useRouter();

const items = computed(() =>
  (props.items ?? []).map((i) => ({
    ...i,
    componentTag: i.to ? 'router-link' : i.href ? 'a' : 'button',
  }))
);
const canGoBack = computed(() => {
  return !props.disableBackButton && !!window.history.state.back;
});

const goBack = () => {
  router.back();
};
</script>

<style scoped>
@reference "@/index.css";

@layer components {
  nav {
    position: relative; /* important so ::before anchors to nav */

    &::before {
      @apply pointer-events-none fixed bottom-0 left-0 -z-10 block h-32 w-full;
      content: '';
      background: linear-gradient(
        to top,
        var(--background) 0%,
        color-mix(in oklch, var(--background) 0%, transparent) 100%
      );
    }
  }

  .navigation-bar {
    @apply flex items-center justify-between gap-1 rounded-[100px] border border-border bg-background/50 p-1 shadow-2xl backdrop-blur;
  }

  .navigation-bar-main {
    @apply min-w-0 flex-1;
  }

  .tab {
    @apply inline-flex h-9 cursor-pointer items-center gap-2 rounded-[100px] border border-transparent px-3 text-foreground/90 transition-all hover:bg-primary/15 hover:text-primary;
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
