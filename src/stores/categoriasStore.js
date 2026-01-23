import { defineStore } from 'pinia';
import api from '@/services/axiosRequest.js';

export const useCategoriasStore = defineStore('categorias', {
    state: () => ({
        listado: [],
        cargando: false,
        error: null,
    }),

    getters: {
        totalCategorias: (state) => state.listado.length,
    },

    actions: {
        async fetchCategorias() {
            
            this.cargando = true;
            this.error = null;
            try {
                const response = await api.get('categoria_pieza/');

                //console.log('📊 response.data:', response);

                
                
                if (response.data) {
                    this.listado = response.data;
                } 

                
            } catch (err) {
                console.error('❌ Error al cargar categorías:', err);

            } finally {
                this.cargando = false;
            }
        },



    }
});