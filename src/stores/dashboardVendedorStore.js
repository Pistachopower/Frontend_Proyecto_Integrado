
import { defineStore } from 'pinia';
import api from '@/services/axiosRequest.js';

export const useDashboardVendedorStore = defineStore('dashboardVendedor', {
  state: () => ({
    dashboard: null,
    cargando: false,
    error: null,
  }),
  actions: {
    async fetchDashboardVendedor() {
      this.cargando = true;
      this.error = null;
      try {
        const response = await api.get('dashboard-vendedor/');
        this.dashboard = response.data;
      } catch (error) {
        this.error = 'Error al obtener dashboard vendedor';
        this.dashboard = null;
      } finally {
        this.cargando = false;
      }
    },
  },
});
