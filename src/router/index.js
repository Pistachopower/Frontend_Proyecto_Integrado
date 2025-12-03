import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../components/HomeView.vue'
import PerfilView from '../components/PerfilView.vue'

const routes = [
{
    path: '/',
    name: 'Home',
    component: HomeView,
  },

  {
    path: '/perfil',
    name: 'perfil',
    component: PerfilView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
