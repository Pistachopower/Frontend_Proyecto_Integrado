import { defineStore } from 'pinia';
import api from '@/services/axiosRequest.js'; 

export const usePiezasStore = defineStore('piezas', {
    state: () => ({
        listado: [],
        piezaSeleccionada: null,
        cargando: false,
        error: null,
        imagenes: [],
        marcas: [],
    }),

    getters: {
        totalPiezas: (state) => state.listado.length,
        
    },

    actions: {
        // 1. Cargar todo el catálogo
        async fetchCatalogo() {
            
            this.cargando = true;
            this.error = null;
            try {
                const response = await api.get('pieza/'); // O 'piezas/' según tu back
                
                // Obtener marcas únicas
                const marcasSet = new Set();
                response.data.forEach(pieza => {
                    if (pieza.marca) {
                        marcasSet.add(pieza.marca);
                    }
                });
                this.marcas = Array.from(marcasSet).sort();

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

        // 3. Cargar catálogo con filtros desde el backend
        async fetchCatalogoConFiltros(filtros) {
            this.cargando = true;
            this.error = null;
            try {
                // Construir query params
                const params = new URLSearchParams();
                
                if (filtros.busqueda) {
                    params.append('busqueda', filtros.busqueda);
                }
                
                if (filtros.marca) {
                    params.append('marca', filtros.marca);
                }
                
                if (filtros.estado && filtros.estado.length > 0) {
                    filtros.estado.forEach(e => {
                        params.append('estado', e);
                    });
                }
                
                if (filtros.soloEnStock !== undefined && filtros.soloEnStock !== null) {
                    params.append('stock', filtros.soloEnStock ? 'true' : 'false');
                }

                const queryString = params.toString();
                const url = queryString ? `pieza/otros_filtros/?${queryString}` : 'pieza/otros_filtros/';
                
                const response = await api.get(url);
                
                // Manejo de paginación vs lista plana
                if (response.data.results) {
                    this.listado = response.data.results;
                } else {
                    this.listado = response.data;
                }
            } catch (err) {
                console.error('Error store filtros:', err);
                this.error = 'Error al filtrar los productos';
            } finally {
                this.cargando = false;
            }
        }
}});
