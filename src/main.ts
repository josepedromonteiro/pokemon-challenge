import { createApp } from 'vue';
import './index.css';
import App from './App.vue';
import router from '@/router';
import { createPinia } from 'pinia';

const pinia = createPinia();

const pokeApp = createApp(App);

pokeApp.use(router);
pokeApp.use(pinia);
pokeApp.mount('#app');
