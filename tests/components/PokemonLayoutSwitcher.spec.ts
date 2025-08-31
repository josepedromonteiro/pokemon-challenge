import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import PokemonLayoutSwitcher, {
  type PokemonLayoutSwitcherProps,
} from '@/layouts/PokemonLayoutSwitcher.vue';

const GridStub = {
  name: 'PokemonGrid',
  props: ['items', 'loading'],
  template: `<div data-testid="grid" @click="$emit('load-more')">grid</div>`,
};

const TableStub = {
  name: 'PokemonTable',
  props: ['items', 'pushing'],
  template: `<div data-testid="table" @click="$emit('load-more')">table</div>`,
};

describe('PokemonLayoutSwitcher', () => {
  const baseProps: PokemonLayoutSwitcherProps = {
    error: null as string | null,
    gridItems: [{ id: 1, sprite: 'x', name: 'pikachu' }],
    loading: false,
    tableRows: [
      {
        id: 1,
        name: 'pikachu',
        sprite: 'x',
        types: ['electric'],
        hp: 10,
        attack: 10,
        defense: 10,
        specialAttack: 10,
        specialDefense: 10,
        speed: 10,
        isCaught: true,
        height: 4,
        weight: 60,
        caughtAt: new Date().toISOString(),
      },
    ],
    viewMode: 'grid',
  };

  it('renders Grid when viewMode = grid', () => {
    const wrapper = mount(PokemonLayoutSwitcher, {
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
      props: baseProps,
    });
    expect(wrapper.find('[data-testid="grid"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="table"]').exists()).toBe(false);
  });

  it('renders Table when viewMode != grid', () => {
    const wrapper = mount(PokemonLayoutSwitcher, {
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
      props: { ...baseProps, viewMode: 'table' },
    });
    expect(wrapper.find('[data-testid="table"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="grid"]').exists()).toBe(false);
  });

  it('passes loading to Grid and pushing to Table', async () => {
    const w1 = mount(PokemonLayoutSwitcher, {
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
      props: { ...baseProps, loading: true, viewMode: 'grid' },
    });
    expect(w1.getComponent(GridStub).props('loading')).toBe(true);

    const w2 = mount(PokemonLayoutSwitcher, {
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
      props: { ...baseProps, loading: true, viewMode: 'table' },
    });
    expect(w2.getComponent(TableStub).props('pushing')).toBe(true);
  });

  it('emits load-more with correct mode from Grid', async () => {
    const wrapper = mount(PokemonLayoutSwitcher, {
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
      props: { ...baseProps, viewMode: 'grid' },
    });
    await wrapper.get('[data-testid="grid"]').trigger('click');
    expect(wrapper.emitted('load-more')?.[0]).toEqual(['grid']);
  });

  it('emits load-more with correct mode from Table', async () => {
    const wrapper = mount(PokemonLayoutSwitcher, {
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
      props: { ...baseProps, viewMode: 'table' },
    });
    await wrapper.get('[data-testid="table"]').trigger('click');
    expect(wrapper.emitted('load-more')?.[0]).toEqual(['table']);
  });

  it('renders error when provided', () => {
    const wrapper = mount(PokemonLayoutSwitcher, {
      global: { stubs: { PokemonGrid: GridStub, PokemonTable: TableStub } },
      props: { ...baseProps, error: 'Noooooo' },
    });
    expect(wrapper.text()).toContain('Noooooo');
  });
});
