import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import PerfilView from '../components/C_PerfilView.vue'
import Login from '../components/C_Login.vue'
import Registro from '../components/C_Registrar.vue'

const routes = [
{
    path: '/',
    name: 'Home',
    component: HomeView,
  },

    {
    path: '/login',
    name: 'login',
    component: Login,
  },

      {
    path: '/registro',
    name: 'registro',
    component: Registro,
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
