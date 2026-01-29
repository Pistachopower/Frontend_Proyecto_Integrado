import { defineStore } from "pinia";
import api from "@/services/axiosRequest.js";
import { usePerfilStore } from "./usuarioPerfilStore.js";

export const usePedidosVendedorStore = defineStore("pedidosVendedor", {
  // 1. STATE
  state: () => ({
    pedidos: [],
    cargando: false,
    error: null,
  }),

  // 2. ACTIONS
  actions: {
    // --- ACCIÓN 1: TRAER LOS PEDIDOS DEL VENDEDOR (GET) ---
    async fetchPedidosVendedor() {
      const perfilStore = usePerfilStore();

      // Si no tenemos el perfil cargado, intentamos cargarlo o paramos       
      if (!perfilStore.perfil?.id) {
        // Opcional: intentar cargarlo si no está
        // await perfilStore.fetchPerfil();
        // Si aun así no está, salimos
        if (!perfilStore.perfil?.id) return;
      }

      this.cargando = true;
      this.error = null;

      try {
        // Hacemos la petición GET filtrando por el vendedor
        const response = await api.get(
          `vendedor/pedidos_vendedor/?vendedor_id=${perfilStore.perfil.id}`
        );

        //console.log('Respuesta de API:', response.data);
        this.pedidos = response.data.pedidos || response.data;
        //console.log('Pedidos asignados:', this.pedidos);
      
      } catch (error) {
        console.error("Error al cargar pedidos del vendedor:", error);
        this.error = "No se pudieron cargar los pedidos del vendedor.";
      } finally {
        this.cargando = false;
      }
    },

    // --- ACCIÓN 2: CAMBIAR ESTADO DEL PEDIDO ---
    async cambiarEstadoPedido(pedidoId, nuevoEstado) {
      try {
        const response = await api.patch(`pedido/${pedidoId}/cambiar_estado_vendedor/`, {
          estado: nuevoEstado
        });
        
        // Actualizar el pedido localmente
        const pedido = this.pedidos.find(p => p.id === pedidoId);
        if (pedido) {
          pedido.estado = nuevoEstado;
        }
        
        return response.data;
      } catch (error) {
        console.error("Error al cambiar estado del pedido:", error);
        throw error;
      }
    },
  },
});