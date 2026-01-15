import { defineStore } from 'pinia';
import api from '@/services/axiosRequest.js';

export const useCategoriasStore = defineStore('categorias', {
    state: () => ({
        listado: [],
        categoriaSeleccionada: null, // NUEVA: guardar categoría seleccionada
        cargando: false,
        error: null,
    }),

    getters: {
        totalCategorias: (state) => state.listado.length,
    },

    actions: {
        async fetchCategorias() {
            console.log("📂 Cargando categorías...");
            
            this.cargando = true;
            this.error = null;
            try {
                const response = await api.get('categoria/');
                
                if (response.data.results) {
                    this.listado = response.data.results;
                } else {
                    this.listado = response.data;
                }
                
                console.log('✅ Categorías cargadas:', this.listado);
            } catch (err) {
                console.error('❌ Error al cargar categorías:', err);
                this.error = 'Error al cargar las categorías';
            } finally {
                this.cargando = false;
            }
        },

        // NUEVA: Guardar la categoría seleccionada
        seleccionarCategoria(categoria) {
            console.log('📌 Categoría seleccionada:', categoria);
            this.categoriaSeleccionada = categoria;
        },

        // Limpiar selección
        limpiarSeleccion() {
            this.categoriaSeleccionada = null;
        }
    }
});