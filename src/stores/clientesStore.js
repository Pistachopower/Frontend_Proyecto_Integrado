import {defineStore} from 'pinia';
import api from '@/services/axiosRequest.js';

export const useClientesStore = defineStore('listarClientes', {
    state: () => ({
        listado: [],
        cargando: false,
        error: null,
    }),
    getters: {
        totalClientes: (state) => state.listado.length,
    },
    actions: {
        async fetchClientes(vendedor_id) {
            this.cargando = true;
            this.error = null;
            try {
                const response = await api.get(`cliente/clientes_vendedor/?vendedor_id=${vendedor_id}`);
                if (response.data) {
                    this.listado = response.data;
                }
            } catch (err) {
                console.error('❌ Error al cargar clientes:', err);
            } finally {
                this.cargando = false;
            }
        },
    }
});