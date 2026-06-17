import { defineStore } from 'pinia';
import api from '@/services/axiosRequest.js'; 

export const usePerfilStore = defineStore('perfil', {
  state: () => ({
    pedrfil: null,
    cargando: true,
    error: null,
  }),


  
  
  getters: {
    // Getter para determinar fácilmente si es empleado
    esEmpleado: (state) => {
      const tipo = (state.perfil?.tipo_usuario || state.perfil?.usuario?.tipo_usuario || '').toLowerCase();
      return ['empleado', 'administrador', 'admin'].includes(tipo);
    },

    esCliente: (state) =>
      (state.perfil?.tipo_usuario || state.perfil?.usuario?.tipo_usuario || '').toLowerCase() === 'cliente',
    
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
        // console.log("✅ DATA:", response.data);
        // console.log("✅ Perfil cargado:", this.perfil);
        // this.esCliente= response.data.tipo_usuario === 'cliente';
        // this.esEmpleado= response.data.tipo_usuario === 'empleado';

        //console.log(response.data.tipo_usuario);
        
      } catch (error) {
        //console.error('Error al cargar el perfil:', error);
        this.error = 'No se pudo cargar la información del perfil.';
      
      } finally {
        this.cargando = false;
      }
    },
    async actualizarPerfil(datosActualizados) {
      this.cargando = true;
      this.error = null;
      try {
        const response = await api.put('mi-perfil/', datosActualizados);
        this.perfil = response.data;
        //console.log("✅ Perfil actualizado:", this.perfil);
      
      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        this.error = 'No se pudo actualizar la información del perfil.';
      
      } finally {
        this.cargando = false;
      }
    }
  },
});