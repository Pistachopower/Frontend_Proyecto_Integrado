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
        const response = await api.get(`metodo_pago/?cliente_id=${perfilStore.perfil.id}`);
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
        // Construimos el JSON. 
        // IMPORTANTE: Aquí asignamos el cliente automáticamente desde el store de perfil
        const payload = {
          "tipo_metodo": parseInt(datosFormulario.tipo_metodo), 
          "es_predeterminado": datosFormulario.es_predeterminado, 
          "fecha_agregado": null, 
          "cliente": perfilStore.perfil.id // <--- ASIGNACIÓN AUTOMÁTICA DEL ID
        };

        console.log("📤 Enviando al backend:", payload);

        const response = await api.post('metodo_pago/', payload);
        
        // Agregamos el nuevo a la lista local
        this.metodos.push(response.data);
        return true; 

      } catch (error) {
        console.error('Error al crear método:', error);
        this.error = error.response?.data?.detail || 'Error al guardar.';
        return false; 
      } finally {
        this.cargando = false;
      }
    },

    // --- ACCIÓN 3: BORRAR (DELETE) ---
    async borrarMetodo(idMetodo) {
      try {
         await api.delete(`metodo_pago/${idMetodo}/`);
         this.metodos = this.metodos.filter(m => m.id !== idMetodo);
      } catch (error) {
        console.error(error);
      }
    }
  },
});