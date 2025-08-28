import type { Item } from '@/models/toolbar.ts';

export const TABS: Item[] = [
  {
    icon: {
      alt: 'Pokeball',
      src: 'images/pokemon.png',
      type: 'image',
    },
    key: 'home',
    label: 'Home',
    to: '/',
  },
  {
    icon: {
      alt: 'Pokeball',
      src: 'images/pokedex.png',
      type: 'image',
    },
    key: 'pokedex',
    label: 'Pokédex',
    to: '/pokedex',
  },
];
