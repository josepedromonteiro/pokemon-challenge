import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { usePokemonViewer } from '@/composables/usePokemonViewer';

const flush = () => new Promise((r) => setTimeout(r, 0));

const mountWith = (
  fetchTableData?: () => Promise<any[]>,
  fetchGridData?: () => Promise<any[]>
) =>
  mount(
    defineComponent({
      setup(_, { expose }) {
        const api = usePokemonViewer(fetchTableData, fetchGridData);
        expose(api);
        return () => null;
      },
    })
  );

describe('usePokemonViewer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loads grid items by default when fetchGridData is provided', async () => {
    const data = [{ id: 1 }, { id: 2 }];
    const fetchGrid = vi.fn().mockResolvedValue(data);
    const wrapper = mountWith(undefined, fetchGrid);
    await flush();
    expect(fetchGrid).toHaveBeenCalledTimes(1);
    expect((wrapper.vm as any).gridItems).toEqual(data);
    expect((wrapper.vm as any).loading).toBe(false);
    expect((wrapper.vm as any).error).toBeUndefined();
  });

  it('loads table rows when switching to table view', async () => {
    const gridData = [{ id: 1 }];
    const tableData = [{ id: 'a' }];
    const fetchGrid = vi.fn().mockResolvedValue(gridData);
    const fetchTable = vi.fn().mockResolvedValue(tableData);
    const wrapper = mountWith(fetchTable, fetchGrid);
    await flush();
    expect(fetchGrid).toHaveBeenCalledTimes(1);
    (wrapper.vm as any).viewMode = 'table';
    await flush();
    expect(fetchTable).toHaveBeenCalledTimes(1);
    expect((wrapper.vm as any).tableRows).toEqual(tableData);
    expect((wrapper.vm as any).loading).toBe(false);
  });

  it('does not call grid fetch when in table view and vice versa', async () => {
    const fetchGrid = vi.fn().mockResolvedValue([{ id: 1 }]);
    const fetchTable = vi.fn().mockResolvedValue([{ id: 2 }]);
    const wrapper = mountWith(fetchTable, fetchGrid);
    await flush();
    expect(fetchGrid).toHaveBeenCalledTimes(1);
    (wrapper.vm as any).viewMode = 'table';
    await flush();
    expect(fetchTable).toHaveBeenCalledTimes(1);
    (wrapper.vm as any).viewMode = 'grid';
    await flush();
    expect(fetchGrid).toHaveBeenCalledTimes(2);
  });

  it('setData sets both gridItems and tableRows and clears loading', async () => {
    const wrapper = mountWith();
    (wrapper.vm as any).loading = true;
    const items = [{ id: 10 }, { id: 11 }];
    (wrapper.vm as any).setData(items);
    expect((wrapper.vm as any).gridItems).toEqual(items);
    expect((wrapper.vm as any).tableRows).toEqual(items);
    expect((wrapper.vm as any).loading).toBe(false);
  });

  it('handles fetch errors and sets error message', async () => {
    const fetchGrid = vi.fn().mockRejectedValue(new Error('fail'));
    const wrapper = mountWith(undefined, fetchGrid);
    await flush();
    expect(fetchGrid).toHaveBeenCalledTimes(1);
    expect((wrapper.vm as any).error).toBe('Error loading items');
    expect((wrapper.vm as any).loading).toBe(false);
  });

  it('loadItems does nothing when no fetch functions are provided', async () => {
    const wrapper = mountWith();
    await (wrapper.vm as any).loadItems();
    expect((wrapper.vm as any).gridItems).toEqual([]);
    expect((wrapper.vm as any).tableRows).toEqual([]);
    expect((wrapper.vm as any).loading).toBe(false);
    expect((wrapper.vm as any).error).toBeUndefined();
  });
});
