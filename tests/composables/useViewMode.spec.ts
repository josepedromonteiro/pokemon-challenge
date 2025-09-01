import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { useViewMode } from '@/composables/useViewMode';

describe('useViewMode', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const mountWith = (opts?: Parameters<typeof useViewMode>[0]) => {
    return mount(
      defineComponent({
        setup(_, { expose }) {
          const viewMode = useViewMode(opts);
          expose(viewMode);
          return () => null;
        },
      })
    );
  };

  it('initializes with default and persists changes to localStorage', async () => {
    const storageKey = 'test:view:1';
    const wrapper = mountWith({ storageKey, defaultValue: 'grid' as any });
    expect((wrapper.vm as any).viewMode).toBe('grid');
    (wrapper.vm as any).setViewMode('table' as any);
    await nextTick();
    expect(localStorage.getItem(storageKey)).toBe('table');
  });

  it('reads initial value from localStorage on mount', () => {
    const storageKey = 'test:view:2';
    localStorage.setItem(storageKey, 'table');
    const wrapper = mountWith({ storageKey, defaultValue: 'grid' as any });
    expect((wrapper.vm as any).viewMode).toBe('table');
  });

  it('syncs across tabs via storage event when enabled', async () => {
    const storageKey = 'test:view:3';
    const wrapper = mountWith({
      storageKey,
      defaultValue: 'grid' as any,
      syncAcrossTabs: true,
    });
    expect((wrapper.vm as any).viewMode).toBe('grid');
    window.dispatchEvent(
      new StorageEvent('storage', { key: storageKey, newValue: 'table' })
    );
    await nextTick();
    expect((wrapper.vm as any).viewMode).toBe('table');
  });

  it('does not attach storage listener when syncAcrossTabs is false', () => {
    const spy = vi.spyOn(window, 'addEventListener');
    mountWith({ storageKey: 'test:view:4', syncAcrossTabs: false });
    expect(spy.mock.calls.filter((c) => c[0] === 'storage').length).toBe(0);
  });

  it('removes storage listener on unmount', () => {
    const spy = vi.spyOn(window, 'removeEventListener');
    const wrapper = mountWith({
      storageKey: 'test:view:5',
      syncAcrossTabs: true,
    });
    wrapper.unmount();
    expect(spy.mock.calls.some((c) => c[0] === 'storage')).toBe(true);
  });
});
