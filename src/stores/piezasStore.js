import { defineStore } from 'pinia';
import api from '@/services/axiosRequest.js'; 

export const usePiezasStore = defineStore('piezas', {
    state: () => ({
        listado: [],
        piezaSeleccionada: null,
        cargando: false,
        error: null,
        imagenes: [],
    }),

    getters: {
        totalPiezas: (state) => state.listado.length,
        
        // NUEVO: Getter para obtener la imagen de una pieza
        obtenerImagenPorPieza: (state) => (piezaId) => {
            const imagen = state.imagenes.find(img => img.pieza.id === piezaId);
            return imagen ? imagen.url_imagen : null;
        }
    },

    actions: {
        // 1. Cargar todo el catálogo
        async fetchCatalogo() {
            console.log("📦 Cargando catálogo de piezas...");
            
            this.cargando = true;
            this.error = null;
            try {
                const response = await api.get('pieza/'); // O 'piezas/' según tu back
                
                // Manejo de paginación vs lista plana
                if (response.data.results) {
                    this.listado = response.data.results;

                } else {
                    this.listado = response.data;
                }
            } catch (err) {
                console.error('Error store catalogo:', err);
                this.error = 'Error al cargar el catálogo';
            } finally {
                this.cargando = false;
            }
        },

        // 2. Cargar detalle (Inteligente: Cache primero, API después)
        async fetchPiezaDetalle(id) {
            this.cargando = true;
            this.error = null;
            this.piezaSeleccionada = null; // Limpiamos anterior

            try {
                // A) PRIMERO: Buscamos en lo que ya tenemos descargado (Memoria)
                const encontradoEnLocal = this.listado.find(p => p.id == id);

                if (encontradoEnLocal) {
                    console.log(`🚀 Producto ${id} encontrado en memoria local. Ahorrando petición.`);
                    this.piezaSeleccionada = encontradoEnLocal;
                } 
                // B) SEGUNDO: Si no está (ej: recargó página con F5), pedimos a API
                else {
                    console.log(`🌐 Producto ${id} no encontrado localmente. Pidiendo a API...`);
                    const response = await api.get(`pieza/${id}/`);
                    this.piezaSeleccionada = response.data;
                }

            } catch (err) {
                console.error('Error store detalle:', err);
                this.error = 'No se pudo cargar el detalle del producto.';
            } finally {
                this.cargando = false;
            }
        },
        
        // Limpiar selección al salir
        limpiarSeleccion() {
            this.piezaSeleccionada = null;
        },
        async fetchImagenesPieza() {
            console.log("📷 Cargando imágenes de las piezas...");
            // Obtenemos todas las imagenes de las piezas
            return api.get('imagen_pieza/')
                .then(response => {
                    this.imagenes = response.data;
                })
                .catch(error => {
                    console.error('Error al cargar las imágenes de las piezas:', error);
                });

        } 

    }
});