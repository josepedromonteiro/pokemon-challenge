import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PokemonLayoutSwitcher, {
  type PokemonLayoutSwitcherProps,
} from '@/layouts/PokemonLayoutSwitcher.vue';

// Create simple stubs that re-emit load-more and show their name
const GridStub = {
  name: 'PokemonGrid',
  props: ['items', 'loading'],
  template: `
      <div data-testid="grid" @click="$emit('load-more')">grid</div>`,
};
const TableStub = {
  name: 'PokemonTable',
  props: ['items', 'pushing'],
  template: `
      <div data-testid="table" @click="$emit('load-more')">table</div>`,
};

describe('PokemonListWrapper', () => {
  const baseProps: PokemonLayoutSwitcherProps = {
    viewMode: 'grid' as const,
    gridItems: [{ id: 1, name: 'pikachu', image: 'x' }],
    tableRows: [
      {
        id: 1,
        name: 'pikachu',
        height: 4,
        weight: 60,
        hp: 10,
        attack: 10,
        defense: 10,
        specialAttack: 10,
        specialDefense: 10,
        speed: 10,
        types: ['electric'],
        caughtAt: new Date().toISOString(),
        isCaught: true,
      },
    ],
    loading: false,
    error: null as string | null,
  };

  it('renders Grid when viewMode = grid', () => {
    const wrapper = mount(PokemonLayoutSwitcher, {
      props: baseProps,
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
    });
    expect(wrapper.find('[data-testid="grid"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="table"]').exists()).toBe(false);
  });

  it('renders Table when viewMode != grid', () => {
    const wrapper = mount(PokemonLayoutSwitcher, {
      props: { ...baseProps, viewMode: 'table' },
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
    });
    expect(wrapper.find('[data-testid="table"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="grid"]').exists()).toBe(false);
  });

  it('passes loading to Grid and pushing to Table', async () => {
    // Grid case
    const w1 = mount(PokemonLayoutSwitcher, {
      props: { ...baseProps, loading: true, viewMode: 'grid' },
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
    });
    expect(w1.getComponent(GridStub).props('loading')).toBe(true);

    // Table case
    const w2 = mount(PokemonLayoutSwitcher, {
      props: { ...baseProps, loading: true, viewMode: 'table' },
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
    });
    expect(w2.getComponent(TableStub).props('pushing')).toBe(true);
  });

  it('emits load-more with correct mode from Grid', async () => {
    const wrapper = mount(PokemonLayoutSwitcher, {
      props: { ...baseProps, viewMode: 'grid' },
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
    });
    await wrapper.get('[data-testid="grid"]').trigger('click');
    expect(wrapper.emitted('load-more')?.[0]).toEqual(['grid']);
  });

  it('emits load-more with correct mode from Table', async () => {
    const wrapper = mount(PokemonLayoutSwitcher, {
      props: { ...baseProps, viewMode: 'table' },
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
    });
    await wrapper.get('[data-testid="table"]').trigger('click');
    expect(wrapper.emitted('load-more')?.[0]).toEqual(['table']);
  });

  it('renders error when provided', () => {
    const wrapper = mount(PokemonLayoutSwitcher, {
      props: { ...baseProps, error: 'Noooooo' },
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
    });
    expect(wrapper.text()).toContain('Noooooo');
  });
});
