
import { defineStore } from 'pinia';
import api from '@/services/axiosRequest.js';

export const useDashboardVendedorStore = defineStore('dashboardVendedor', {
  state: () => ({
    dashboard: null,
    cargando: false,
    error: null,
    cargandoFoto: false,
    mensajeFotoExito: '',
    mensajeFotoError: '',
    fotoPerfilUrl: '',
  }),
  actions: {
    async fetchDashboardVendedor() {
      this.cargando = true;
      this.error = null;
      try {
        const response = await api.get('dashboard-vendedor/');
        this.dashboard = response.data;
        
        // Si el backend devuelve la URL de la foto, actualízala
        if (response.data && response.data.fotoPerfilUrl) {
          this.fotoPerfilUrl = response.data.fotoPerfilUrl;
        }
      } catch (error) {
        this.error = 'Error al obtener dashboard vendedor';
        this.dashboard = null;
      } finally {
        this.cargando = false;
      }
    },

    async subirFotoPerfilVendedor(vendedorId, archivo) {
      this.cargandoFoto = true;
      this.mensajeFotoError = '';
      this.mensajeFotoExito = '';
      try {
        const formData = new FormData();
        formData.append('foto_perfil_vendedor', archivo);
        
        //usamos la ruta relativa
        await api.post(`vendedor/${vendedorId}/subir_foto_perfil/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Actualiza la URL de la foto de perfil localmente (puede requerir recargar desde backend)
        this.fotoPerfilUrl = URL.createObjectURL(archivo);
        this.mensajeFotoExito = '¡Foto de perfil actualizada!';
        
      } catch (error) {
        this.mensajeFotoError = 'Error al subir la foto de perfil.';
      } finally {
        this.cargandoFoto = false;
      }
    },
  },
});
