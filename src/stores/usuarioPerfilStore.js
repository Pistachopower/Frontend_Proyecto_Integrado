// stores/perfilStore.js

import { defineStore } from 'pinia';
import api from '@/services/axiosRequest.js'; // Asegúrate de que la ruta a tu API sea correcta

export const usePerfilStore = defineStore('perfil', {
  state: () => ({
    perfil: null,
    cargando: true,
    error: null,
  }),


  
  
  getters: {
    // Getter para determinar fácilmente si es empleado
    esEmpleado: (state) => state.perfil?.tipo_usuario === 'empleado',
    
    // Getter para obtener el nombre completo (opcional, por conveniencia)
    nombreCompleto: (state) => `${state.perfil?.nombre || ''} ${state.perfil?.apellido || ''}`,
  },

  actions: {
    async fetchPerfil() {
      this.cargando = true;
      this.error = null;
      try {
        const response = await api.get('mi-perfil/');
        this.perfil = response.data;
        console.log("👤 Perfil cargado:", this.perfil);

        
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        this.error = 'No se pudo cargar la información del perfil.';
      
      } finally {
        this.cargando = false;
      }
    },
  },
});