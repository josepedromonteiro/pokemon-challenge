import { createPinia } from 'pinia';

import './index.css';
import { createApp } from 'vue';

import router from '@/router';

import App from './App.vue';

const pinia = createPinia();

const pokeApp = createApp(App);

pokeApp.use(router);
pokeApp.use(pinia);
pokeApp.mount('#app');
