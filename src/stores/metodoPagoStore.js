import { defineStore } from 'pinia';
import api from '@/services/axiosRequest.js';
import { usePerfilStore } from './usuarioPerfilStore.js'; 

export const useMetodoPagoStore = defineStore('metodoPago', {
  // 1. STATE
  state: () => ({
    metodos: [],      
    cargando: false,  
    error: null,      
  }),

  // 2. ACTIONS (Aquí es donde debe estar fetchMetodos)
  actions: {
    
    // --- ACCIÓN 1: TRAER LOS MÉTODOS (GET) ---
    async fetchMetodos() {
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
        // Hacemos la petición GET filtrando por el cliente
        //const response = await api.get(`metodo_pago_cliente/?cliente_id=${perfilStore.perfil.id}`);
        const response = await api.get(`metodo_pago_cliente/?cliente_id=${perfilStore.perfil.id}`);

        this.metodos = response.data;
        
      } catch (error) {
        console.error('Error al cargar métodos:', error);
        this.error = 'No se pudieron cargar tus métodos de pago.';
      } finally {
        this.cargando = false;
      }
    },

    // --- ACCIÓN 2: CREAR MÉTODO (POST) ---
    async crearMetodo(datosFormulario) {
      this.cargando = true;
      this.error = null;
      const perfilStore = usePerfilStore();

      try {
        // Construimos el JSON base
        const payload = {
          "tipo_metodo": parseInt(datosFormulario.tipo_metodo),
          "es_predeterminado": datosFormulario.es_predeterminado,
          "fecha_agregado": null,
          "cliente": perfilStore.perfil.id
        };

        // Adjuntar detalles según el tipo seleccionado
        if (payload.tipo_metodo === 1 && datosFormulario.detalles_tarjeta) {
          payload.detalles_tarjeta = { ...datosFormulario.detalles_tarjeta };
        } else if (payload.tipo_metodo === 2 && datosFormulario.detalles_cuenta) {
          payload.detalles_cuenta = { ...datosFormulario.detalles_cuenta };
        } else if (payload.tipo_metodo === 3 && datosFormulario.detalles_billetera) {
          payload.detalles_billetera = { ...datosFormulario.detalles_billetera };
        }

        //console.log("📤 Enviando al backend:", payload);

        const response = await api.post('metodo_pago_cliente/', payload);
        this.metodos.push(response.data);
        return true;

      } catch (error) {
        //console.error('Error al crear método:', error);
        this.error = error.response?.data?.detail || 'Error al guardar.';
        return false;
      } finally {
        this.cargando = false;
      }
    },

    // --- ACCIÓN 3: BORRAR (DELETE) ---
    async borrarMetodo(idMetodo) {
      try {
         await api.delete(`metodo_pago_cliente/${idMetodo}/`);
         this.metodos = this.metodos.filter(m => m.id !== idMetodo);
      } catch (error) {
        console.error(error);
      }
    },

        // --- ACCIÓN 4: EDITAR MÉTODO (PUT) ---
        async editarMetodo(idMetodo, datosFormulario) {
          this.cargando = true;
          this.error = null;
          const perfilStore = usePerfilStore();

          try {
            // Construimos el JSON base
            const payload = {
              "tipo_metodo": parseInt(datosFormulario.tipo_metodo),
              "es_predeterminado": datosFormulario.es_predeterminado,
              "fecha_agregado": datosFormulario.fecha_agregado || null,
              "cliente": perfilStore.perfil.id
            };

            // Adjuntar detalles según el tipo seleccionado
            if (payload.tipo_metodo === 1 && datosFormulario.detalles_tarjeta) {
              payload.detalles_tarjeta = { ...datosFormulario.detalles_tarjeta };
            } else if (payload.tipo_metodo === 2 && datosFormulario.detalles_cuenta) {
              payload.detalles_cuenta = { ...datosFormulario.detalles_cuenta };
            } else if (payload.tipo_metodo === 3 && datosFormulario.detalles_billetera) {
              payload.detalles_billetera = { ...datosFormulario.detalles_billetera };
            }

            const response = await api.put(`metodo_pago_cliente/${idMetodo}/`, payload);
            // Actualizar el método en el array local
            const idx = this.metodos.findIndex(m => m.id === idMetodo);
            if (idx !== -1) {
              this.metodos[idx] = response.data;
            }
            return true;
          } catch (error) {
            this.error = error.response?.data?.detail || 'Parece que el formato de tus datos no son correcto. Intenta de nuevo.';
            return false;
          } finally {
            this.cargando = false;
          }
        },
    async crearOrdenPayPal(pedidoId) {
      try {
        const response = await api.post('paypal/crear-orden/', { pedido_id: pedidoId });
        return response.data;
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Error al crear la orden PayPal.' };
      }
    },

    // --- ACCIÓN PAYPAL: Capturar pago ---
    async capturarPagoPayPal(paymentId, payerId) {
      try {
        const response = await api.post('paypal/capturar-pago/', { payment_id: paymentId, payer_id: payerId });
        return response.data;
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Error al capturar el pago PayPal.' };
      }
    },

    // --- ACCIÓN PAYPAL: Cancelar pago ---
    async cancelarPagoPayPal(paymentId) {
      try {
        const response = await api.post('paypal/cancelar-pago/', { payment_id: paymentId });
        return response.data;
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Error al cancelar el pago PayPal.' };
      }
    }
  },
});