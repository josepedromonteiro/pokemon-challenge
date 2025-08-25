import {createRouter, createWebHistory} from 'vue-router'

// Import the views (pages)
import HomeView from '@/views/HomeView.vue'
import PokedexView from '@/views/PokedexView.vue'
// import ProfileView from '@/views/ProfileView.vue'

const routes = [
    {path: '/', name: 'home', component: HomeView},
    {path: '/pokedex', name: 'pokedex', component: PokedexView},
    {
        path: '/pokemon/:idOrName',
        name: 'pokemon-detail',
        component: () => import('@/views/PokemonDetailView.vue'),
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
