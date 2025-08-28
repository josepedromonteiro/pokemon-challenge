import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useUI } from '@/stores/ui.store';

const STORAGE_KEY = 'ui:viewMode';

describe('useUI store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('defaults to "grid" when localStorage empty', () => {
    const ui = useUI();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(ui.viewMode).toBe('grid');
  });

  it('hydrates from localStorage when present', () => {
    localStorage.setItem(STORAGE_KEY, 'table');
    const ui = useUI();
    expect(ui.viewMode).toBe('table');
  });

  it('setViewMode updates state and persists to localStorage', () => {
    const ui = useUI();
    expect(ui.viewMode).toBe('grid');

    ui.setViewMode('table');
    expect(ui.viewMode).toBe('table');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('table');

    ui.setViewMode('grid');
    expect(ui.viewMode).toBe('grid');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('grid');
  });
});
