import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import PerfilView from '../components/perfil_usuario/C_PerfilView.vue'
import Login from '../components/C_Login.vue'
import Registro from '../components/C_Registrar.vue'
import CatalogoProductos from '../components/C_Catalogo.vue'
import DetalleProducto from '../components/C_DetalleProducto.vue'
import Carrito from '../components/C_Carrito.vue'
import ProcesoPago from '../components/C_ProcesoPago.vue'
import SeleccionMetodoPago from '../components/C_SeleccionMetodoPago.vue'
import ListaDeseos from '../components/C_ListaDeseos.vue'
import RecuperarContrasena from '../components/C_RecuperarPassword.vue'
import DashboardEmpleado from '@/components/C_DashboardEmpleado.vue';
import AprobarComentarrios from '@/components/C_AprobarComentarios.vue';
import C_PerfilUsuarioPedidos from '@/components/perfil_usuario/C_PerfilUsuarioPedidos.vue';
import C_PerfilUsuarioDatos from '@/components/perfil_usuario/C_PerfilUsuarioDatos.vue';
import C_PerfilUsuarioComentarios from '@/components/perfil_usuario/C_PerfilUsuarioComentarios.vue';
import C_PerfilUsuarioMetodosPagos from '@/components/perfil_usuario/C_PerfilUsuarioMetodosPagos.vue';
import CategoriaDetalles from '@/components/C_CategoriaDetalles.vue';



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

  // === RUTA PADRE DEL PERFIL (LAYOUT) ===
  {
    // Usamos '/perfil-usuario' como base para que coincida con tus router-link
    path: '/perfil-usuario', 
    name: 'perfil-usuario-layout',
    component: PerfilView, // Este componente tiene el Sidebar y <RouterView />
    
    // Agregamos un redirect para que al entrar a /perfil-usuario vaya directamente a /datos
    redirect: '/perfil-usuario/datos', 
    
    children: [
      // Las rutas anidadas NO llevan / inicial
      {
        path: 'datos', // Ruta completa: /perfil-usuario/datos
        name: 'perfil-datos',
        component: C_PerfilUsuarioDatos,
      },
      {
        path: 'pedidos', // Ruta completa: /perfil-usuario/pedidos
        name: 'perfil-pedidos',
        component: C_PerfilUsuarioPedidos,
      },
      {
        path: 'metodos-pago', // Ruta completa: /perfil-usuario/metodos-pago
        name: 'metodos-pago',
        component: C_PerfilUsuarioMetodosPagos,
      },
      {
        path: 'comentarios', // Ruta completa: /perfil-usuario/comentarios
        name: 'perfil-comentarios',
        component: C_PerfilUsuarioComentarios,
      },


    ]
  },
  // === FIN RUTAS PERFIL ===


  // Las rutas que ya tenía (sin cambios)
  {
    path: '/catalogo-productos',
    name: 'catalogo-productos',
    component: CatalogoProductos,
  },

  {
      // Agregamos /:id para decirle a Vue que capture el número del producto
      path: '/detalle-producto/:id', 
      name: 'detalle-producto',
      component: DetalleProducto,
      props: true, // Recomendado para pasar params como props
  },
  
  {
    path: '/carrito',
    name: 'carrito',
    component: Carrito,
  },

   {
    path: '/categoria/:id',
    name: 'categoria-detalle',
    component: CategoriaDetalles,
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