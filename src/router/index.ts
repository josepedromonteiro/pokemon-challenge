import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

export const ROUTE_NAMES = {
  home: 'home',
  notFound: 'not-found',
  pokedex: 'pokedex',
  pokemonDetail: 'pokemon-detail',
} as const;

const routes: RouteRecordRaw[] = [
  {
    component: () => import('@/views/HomeView.vue'), // lazy
    meta: { title: 'Home' },
    name: ROUTE_NAMES.home,
    path: '/',
  },
  {
    component: () => import('@/views/PokedexView.vue'), // lazy
    meta: { title: 'My Pokédex' },
    name: ROUTE_NAMES.pokedex,
    path: '/pokedex',
  },
  {
    component: () => import('@/views/PokemonDetailView.vue'), // lazy
    meta: { title: 'Pokémon Details' },
    name: ROUTE_NAMES.pokemonDetail,
    path: '/pokemon/:id',
    props: (route) => {
      const id = Number(route.params.id);
      return Number.isFinite(id) && id > 0 ? { id } : { id: undefined };
    },
  },
  {
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Not Found' },
    name: ROUTE_NAMES.notFound,
    path: '/:pathMatch(.*)*',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL ?? '/'),
  routes,
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  },
});

router.beforeEach((to) => {
  if (to.name === ROUTE_NAMES.pokemonDetail) {
    const id = Number(to.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return { name: ROUTE_NAMES.notFound, replace: true };
    }
  }
  return true;
});

router.afterEach((to) => {
  const base = 'Pokédex';
  document.title = to.meta?.title ? `${to.meta.title} • ${base}` : base;
});

export default router;
