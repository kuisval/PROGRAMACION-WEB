import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import BoardgamesView from '../views/BoardgamesView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Inicio - Favoritos'
    }
  },
  {
    path: '/boardgames',
    name: 'boardgames',
    component: BoardgamesView,
    meta: {
      title: 'Juegos de Mesa'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Board Games System';
  next();
});

export default router;