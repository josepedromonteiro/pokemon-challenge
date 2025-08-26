import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

export const ROUTE_NAMES = {
  home: 'home',
  pokedex: 'pokedex',
  pokemonDetail: 'pokemon-detail',
  notFound: 'not-found',
} as const;

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.home,
    component: () => import('@/views/HomeView.vue'), // lazy
    meta: { title: 'Home' },
  },
  {
    path: '/pokedex',
    name: ROUTE_NAMES.pokedex,
    component: () => import('@/views/PokedexView.vue'), // lazy
    meta: { title: 'My Pokédex' },
  },
  {
    path: '/pokemon/:id',
    name: ROUTE_NAMES.pokemonDetail,
    component: () => import('@/views/PokemonDetailView.vue'), // lazy
    props: (route) => {
      const id = Number(route.params.id);
      return Number.isFinite(id) && id > 0 ? { id } : { id: undefined };
    },
    meta: { title: 'Pokémon Details' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.notFound,
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Not Found' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
