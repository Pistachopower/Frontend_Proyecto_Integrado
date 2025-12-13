import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import PerfilView from '../components/C_PerfilView.vue'
import Login from '../components/C_Login.vue'
import Registro from '../components/C_Registrar.vue'
import DetalleProducto from '../components/C_DetalleProducto.vue'
import Carrito from '../components/C_Carrito.vue'
import ProcesoPago from '../components/C_ProcesoPago.vue'
import SeleccionMetodoPago from '../components/C_SeleccionMetodoPago.vue'
import HistorialPedidos from '../components/C_HistorialPedidos.vue'
import ListaDeseos from '../components/C_ListaDeseos.vue'
import RecuperarContrasena from '../components/C_RecuperarPassword.vue'
import DashboardEmpleado from '@/components/C_DashboardEmpleado.vue';
import AprobarComentarrios from '@/components/C_AprobarComentarios.vue';



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

    {
    path: '/detalle-producto',
    name: 'detalle-producto',
    component: DetalleProducto,
  },

      {
    path: '/carrito',
    name: 'carrito',
    component: Carrito,
  },

        {
    path: '/proceso-pago',
    name: 'proceso-pago',
    component: ProcesoPago,
  },

          {
    path: '/seleccion-metodo-pago',
    name: 'seleccion-metodo-pago',
    component: SeleccionMetodoPago,
  },

            {
    path: '/historial-pedidos',
    name: 'historial-pedidos',
    component: HistorialPedidos,
  },

              {
    path: '/lista-deseos',
    name: 'lista-deseos',
    component: ListaDeseos,
  },

    {
    path: '/recuperar-contrasena',
    name: 'recuperar-contrasena',
    component: RecuperarContrasena,
  },

    {
    path: '/dashboard-empleado',
    name: 'dashboard-empleado',
    component: DashboardEmpleado,
  },

      {
    path: '/aprobar-comentarios',
    name: 'aprobar-comentarios',
    component: AprobarComentarrios,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
