import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import PerfilView from '../components/perfil_usuario/C_PerfilView.vue'
import Login from '../components/C_Login.vue'
import Registro from '../components/C_Registrar.vue'
import CatalogoProductos from '../components/C_Catalogo.vue'
import DetalleProducto from '../components/C_DetalleProducto.vue'
import Carrito from '../components/C_Carrito.vue'
import ProcesoPago from '../components/pago_cliente/C_Envio.vue'
import ListaDeseos from '../components/C_ListaDeseos.vue'
import RecuperarContrasena from '../components/C_RecuperarPassword.vue'
import AprobarComentarrios from '@/components/C_AprobarComentarios.vue';
import C_PerfilUsuarioPedidos from '@/components/perfil_usuario/C_PerfilUsuarioPedidos.vue';
import C_PerfilUsuarioDatos from '@/components/perfil_usuario/C_PerfilUsuarioDatos.vue';
import C_PerfilUsuarioComentarios from '@/components/perfil_usuario/C_PerfilUsuarioComentarios.vue';
import C_PerfilUsuarioMetodosPagos from '@/components/perfil_usuario/C_PerfilUsuarioMetodosPagos.vue';
import C_PerfilUsuarioDevoluciones from '@/components/perfil_usuario/C_PerfilUsuarioDevoluciones.vue';
import C_PerfilUsuarioListaDeseos from '@/components/perfil_usuario/C_PerfilUsuarioListaDeseos.vue';
import CategoriaDetalles from '@/components/C_CategoriaDetalles.vue';
import C_PagoExitoso from '@/components/pago_cliente/C_PagoExitoso.vue';

//componentes vendedor
import C_VendedorView from '@/components/perfil_vendedor/C_VendedorView.vue';
import C_VendedorPerfil from '@/components/perfil_vendedor/C_VendedorPerfil.vue';
import C_VendedorInicio from '@/components/perfil_vendedor/C_VendedorInicioDashBoard.vue';
import C_VendedorPedidos from '@/components/perfil_vendedor/C_VendedorPedidos.vue';
import C_VendedorProductos from '@/components/perfil_vendedor/C_VendedorProductos.vue';
import C_VendedorClientes from '@/components/perfil_vendedor/C_VendedorListaClientes.vue';
import C_VendedorDevoluciones from '@/components/perfil_vendedor/C_VendedorDevoluciones.vue';
import C_PagoCancelado from '@/components/pago_cliente/C_PagoCancelado.vue';
//guards
//import { requireVendedor, requireCliente, requireAuth } from './guards.js'

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

  // === RUTA PADRE DEL PERFIL CLIENTE y VENDEDOR (LAYOUT) ===
  {
    path: '/perfil-usuario', 
    name: 'perfil-usuario-layout',
    component: PerfilView,
    redirect: '/perfil-usuario/datos',

    children: [
      {
        path: 'datos',
        name: 'perfil-datos',
        component: C_PerfilUsuarioDatos,
      },
      {
        path: 'pedidos',
        name: 'perfil-pedidos',
        component: C_PerfilUsuarioPedidos,
      },
      {
        path: 'metodos-pago',
        name: 'metodos-pago',
        component: C_PerfilUsuarioMetodosPagos,
      },
      {
        path: 'comentarios',
        name: 'perfil-comentarios',
        component: C_PerfilUsuarioComentarios,
      },
      {
        path: 'devoluciones',
        name: 'perfil-devoluciones',
        component: C_PerfilUsuarioDevoluciones,
      },
      {
        path: 'lista-deseos',
        name: 'perfil-lista-deseos',
        component: C_PerfilUsuarioListaDeseos,
      },
    ]
  },
  // === FIN RUTAS PERFIL CLIENTE ===

  // ← NUEVO: RUTA PADRE DEL PERFIL VENDEDOR (LAYOUT)
  {
    path: '/perfil-vendedor',
    name: 'perfil-vendedor-layout',
    component: C_VendedorView,
    redirect: '/perfil-vendedor/inicio',
    children: [
      {
        path: 'inicio',
        name: 'vendedor-inicio',
        component: C_VendedorInicio,
      },
      {
        path: 'perfil',
        name: 'vendedor-perfil',
        component: C_VendedorPerfil,
      },
      {
        path: 'clientes',
        name: 'vendedor-clientes',
        component: C_VendedorClientes, 
      },
      {
        path: 'pedidos',
        name: 'vendedor-pedidos',
        component: C_VendedorPedidos,
      },
      {
        path: 'productos',
        name: 'vendedor-productos',
        component: C_VendedorProductos,
      },
      {
        path: 'devoluciones',
        name: 'vendedor-devoluciones',
        component: C_VendedorDevoluciones,
      },
    ]
  },
  // === FIN RUTAS PERFIL VENDEDOR ===

  {
    path: '/catalogo-productos',
    name: 'catalogo-productos',
    component: CatalogoProductos,
  },

  {
    path: '/detalle-producto/:id', 
    name: 'detalle-producto',
    component: DetalleProducto,
    props: true,
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
    path: '/lista-deseos',
    name: 'lista-deseos',
    component: ListaDeseos,
  },

  {
    path: '/pago/exito',
    name: 'pago-exito',
    component: C_PagoExitoso,
  },

  {
    path: '/pago/cancelado',
    name: 'pago-cancelado',
    component: C_PagoCancelado,
  },

  {
    path: '/recuperar-contrasena',
    name: 'recuperar-contrasena',
    component: RecuperarContrasena,
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