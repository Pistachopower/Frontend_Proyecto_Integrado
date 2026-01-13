import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/axiosRequest';

export const useProductosRelacionadosStore = defineStore('productosRelacionados', () => {
    const productos = ref([]);
    const cargando = ref(false);
    const error = ref(null);

    // --- OBTENER PRODUCTOS POR MARCA ---
    const fetchProductosPorMarca = async (piezaId) => {
        cargando.value = true;
        error.value = null;
        try {
            const response = await api.get(`/pieza/por_marca/?pieza_id=${piezaId}`);
            productos.value = response.data;
            console.log('Productos relacionados cargados:', productos.value);
        } catch (err) {
            error.value = err.message || 'Error al cargar productos relacionados';
            console.error('Error fetchProductosPorMarca:', err);
        } finally {
            cargando.value = false;
        }
    };

    // --- Limpiar funciona para limpiar los productos relacionados ---
    const limpiar = () => {
        productos.value = [];
        error.value = null;
    };

    return {
        productos,
        cargando,
        error,
        fetchProductosPorMarca,
        limpiar
    };
});