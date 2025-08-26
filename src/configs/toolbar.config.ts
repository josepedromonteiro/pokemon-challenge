import type { Item } from '@/models/toolbar.ts';

export const TABS: Item[] = [
  {
    key: 'home',
    label: 'Home',
    icon: {
      type: 'image',
      src: 'images/pokemon.png',
      alt: 'Pokeball',
    },
    to: '/',
  },
  {
    key: 'pokedex',
    label: 'Pokédex',
    icon: {
      type: 'image',
      src: 'images/pokedex.png',
      alt: 'Pokeball',
    },
    to: '/pokedex',
  },
];
