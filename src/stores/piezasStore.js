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

        //Para la subida de archivos del perfil vendedor
        bulkUploadLoading: false,
        bulkUploadResult: null, // {detalle, errores, ids}
        bulkUploadError: null,
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
                    //console.log(`🚀 Producto ${id} encontrado en memoria local. Ahorrando petición.`);
                    this.piezaSeleccionada = encontradoEnLocal;
                }
                // B) SEGUNDO: Si no está (ej: recargó página con F5), pedimos a API
                else {
                    //console.log(`🌐 Producto ${id} no encontrado localmente. Pidiendo a API...`);
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
        },
        //CRUD Perfil Vendedor
        async actualizarPieza(id, datosActualizados) {
            this.cargando = true;
            this.error = null;
            try {
                //Preparamos los datos
                let payload = datosActualizados;

                // Verificar si hay una imagen nueva (tipo File)
                if (datosActualizados.imagen instanceof File) {
                    //Si hay archivo nuevo, usamos FormData
                    const formData = new FormData();

                    // AgregaMOS los datos al FormData
                    Object.keys(datosActualizados).forEach(key => {
                        if (key !== 'imagenPreview') { // Excluir imagenPreview
                            formData.append(key, datosActualizados[key]);
                        }
                    });

                    payload = formData; // Usamos FormData como payload
                } else {
                    // Si NO hay archivo nuevo, eliminar el campo imagen
                    const { imagen, imagenPreview, ...datosLimpios } = datosActualizados;
                    payload = datosLimpios; //Enviamos JSON sin imagen
                }

                //Enviamos la petición al backend
                const response = await api.put(`pieza/${id}/`, payload);

                // Actualizamos el listado local
                const index = this.listado.findIndex(p => p.id == id);
                if (index !== -1) {
                    this.listado[index] = response.data; //Actualizamos la pieza en el listado
                }

                // Actualizamos la pieza seleccionada
                this.piezaSeleccionada = response.data;

                return response.data; // Devolvemos la pieza actualizada
            } catch (err) {
                //console.error('Error al actualizar pieza:', err);
                this.error = 'Error al guardar los cambios';
                throw err;
            } finally {
                //Limpiamos estado de carga
                this.cargando = false;
            }
        },

        async crearPieza(datosNuevos) {
            this.cargando = true;
            this.error = null;
            try {
                let payload = datosNuevos;

                // Verificar si hay imagen
                if (datosNuevos.imagen instanceof File) {
                    const formData = new FormData();

                    Object.keys(datosNuevos).forEach(key => {
                        if (key !== 'imagenPreview') {
                            formData.append(key, datosNuevos[key]);
                        }
                    });

                    payload = formData;
                } else {
                    // Eliminar campos de imagen si no hay archivo
                    const { imagen, imagenPreview, ...datosLimpios } = datosNuevos;
                    payload = datosLimpios;
                }

                const response = await api.post('pieza/', payload);

                // Agregar la nueva pieza al listado
                this.listado.push(response.data);

                return response.data;
            } catch (err) {
                console.error('Error al crear pieza:', err);
                this.error = 'Error al crear el producto';
                throw err;
            } finally {
                this.cargando = false;
            }
        },

        async eliminarPieza(id) {
            this.cargando = true;
            this.error = null;
            try {
                await api.delete(`pieza/${id}/`);

                // Eliminar la pieza del listado local
                const index = this.listado.findIndex(p => p.id == id);
                if (index !== -1) {
                    this.listado.splice(index, 1); // Elimina el elemento
                }

                // Si la pieza eliminada era la seleccionada, limpiarla
                if (this.piezaSeleccionada?.id == id) {
                    this.piezaSeleccionada = null;
                }

                return true;
            } catch (err) {
                console.error('Error al eliminar pieza:', err);
                this.error = 'Error al eliminar el producto';
                throw err;
            } finally {
                this.cargando = false;
            }
        },

        async bulkUploadArchivo(file) {
                this.bulkUploadLoading = true;
                this.bulkUploadResult = null;
                this.bulkUploadError = null;
                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await api.post('pieza/bulk_upload/', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    this.bulkUploadResult = response.data;
                } catch (error) {
                    if (error.response && error.response.data) {
                        this.bulkUploadError = error.response.data.detalle || 'Error desconocido';
                        this.bulkUploadResult = error.response.data;
                    } else {
                        this.bulkUploadError = 'Error de red o del servidor';
                    }
                } finally {
                    this.bulkUploadLoading = false;
                }
            },
            clearBulkUploadResult() {
                this.bulkUploadResult = null;
                this.bulkUploadError = null;
            }

    }
});
