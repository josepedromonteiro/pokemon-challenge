import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DynamicTable from '@/components/DynamicTable.vue';

const Table = { template: '<table><slot /></table>' };
const TableHeader = { template: '<thead><slot /></thead>' };
const TableRow = { template: '<tr><slot /></tr>' };
const TableHead = { template: '<th><slot /></th>' };
const TableBody = { template: '<tbody><slot /></tbody>' };
const TableCell = { template: '<td><slot /></td>' };

const Checkbox = {
  props: ['checked', 'indeterminate'],
  emits: ['update:checked'],
  template: `
      <input
          type="checkbox"
          @change="$emit('update:checked', $event.target.checked)"
      />
    `,
};

describe('DynamicTable', () => {
  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'name', label: 'Name' },
    { key: 'caughtAt', label: 'Caught at' },
  ];
  const rows = [
    { id: 1, image: 'i1', name: 'Bulbasaur', caughtAt: '2020-01-01' },
    { id: 2, image: 'i2', name: 'Ivysaur', caughtAt: '2020-01-02' },
    { id: 3, image: 'i3', name: 'Venusaur', caughtAt: '2020-01-03' },
  ];

  // TODO - remove any
  const mountTable = (overrides: any = {}) =>
    mount(DynamicTable, {
      props: {
        rows,
        columns,
        ...overrides,
      },
      global: {
        stubs: {
          Table,
          TableHeader,
          TableRow,
          TableHead,
          TableBody,
          TableCell,
          Checkbox,
        },
      },
    });

  it('renders headers (with selection column when selecting=true)', () => {
    const wrapper = mountTable({ selecting: true });
    const heads = wrapper.findAll('th').map((h) => h.text());
    expect(heads.slice(1)).toEqual(['Image', 'Name', 'Caught at']);
  });

  it('renders rows and default cell content', () => {
    const wrapper = mountTable();
    const trs = wrapper.findAll('tbody tr');
    expect(trs.length).toBe(rows.length);
    expect(trs[0].text()).toContain('Bulbasaur');
    expect(trs[1].text()).toContain('Ivysaur');
  });

  it('emits `row-click` when a row is clicked', async () => {
    const wrapper = mountTable();
    const trs = wrapper.findAll('tbody tr');
    await trs[1].trigger('click');
    const emitted = wrapper.emitted<'row-click'[]>('row-click')!;
    expect(emitted).toBeTruthy();
    expect(emitted[0][0]).toMatchObject(rows[1]);
  });

  it('applies selected row styling when id is in `selected`', () => {
    const wrapper = mountTable({ selecting: true, selected: [2, 3] });
    const trs = wrapper.findAll('tbody tr');
    expect(trs[0].classes()).not.toContain('bg-muted/40');
    expect(trs[1].classes()).toContain('bg-muted/40');
    expect(trs[2].classes()).toContain('bg-muted/40');
  });

  it('shows skeleton rows when loading=true', () => {
    const wrapper = mountTable({ loading: true, rows: [] });
    const pulses = wrapper.findAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(0);
    expect(wrapper.text()).not.toContain('No items.');
  });

  it('shows "No items" when not loading and rows empty', () => {
    const wrapper = mountTable({ loading: false, rows: [] });
    expect(wrapper.text()).toContain('No items.');
  });

  it('computes colspan including selection column when selecting=true', () => {
    const wrapper = mountTable({ selecting: true });
    const tds = wrapper.find('tbody tr').findAll('td');
    expect(tds.length).toBe(columns.length + 1);
  });
});
