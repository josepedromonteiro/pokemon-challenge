import { describe, it, expect } from 'vitest';
import { computed } from 'vue';

import { useSelection } from '@/composables/useSelection';

describe('useSelection', () => {
  it('selecting=false and empty set', () => {
    const sel = useSelection<number>();
    expect(sel.selecting.value).toBe(false);
    expect(sel.selected.value.size).toBe(0);
  });

  it('toggleSelect adds/removes ids (number generic)', () => {
    const sel = useSelection<number>();
    sel.toggleSelect(1);
    sel.toggleSelect(2);
    expect([...sel.selected.value]).toEqual([1, 2]);

    sel.toggleSelect(1);
    expect([...sel.selected.value]).toEqual([2]);
  });

  it('selectAll replaces the set', () => {
    const sel = useSelection<string>();
    sel.selectAll(['a', 'b', 'c']);
    expect(sel.selected.value.has('a')).toBe(true);
    expect(sel.selected.value.has('b')).toBe(true);
    expect(sel.selected.value.has('c')).toBe(true);
    expect(sel.selected.value.size).toBe(3);
  });

  it('clear empties and triggers reactivity', () => {
    const sel = useSelection<number>();
    const size = computed(() => sel.selected.value.size);

    sel.selectAll([1, 2, 3]);
    expect(size.value).toBe(3);

    sel.clear();
    expect(size.value).toBe(0);
  });

  it('toggleSelecting turns on/off and clears when turning off (reactive)', () => {
    const sel = useSelection<number>();
    const size = computed(() => sel.selected.value.size);

    sel.toggleSelecting();
    expect(sel.selecting.value).toBe(true);

    sel.selectAll([10, 20]);
    expect(size.value).toBe(2);

    sel.toggleSelecting();
    expect(sel.selecting.value).toBe(false);
    expect(size.value).toBe(0);
  });
});
