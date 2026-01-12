import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosRequest from '@/services/axiosRequest';

export const useProductosRelacionadosStore = defineStore('productosRelacionados', () => {
    const productos = ref([]);
    const cargando = ref(false);
    const error = ref(null);

    // --- OBTENER PRODUCTOS ALEATORIOS ---
    const fetchProductosAleatorios = async () => {
        cargando.value = true;
        error.value = null;
        try {
            const response = await axiosRequest.get('/pieza/piezas_aleatorias/');
            productos.value = response.data;
        } catch (err) {
            error.value = err.message || 'Error al cargar productos relacionados';
            console.error('Error fetchProductosAleatorios:', err);
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
        fetchProductosAleatorios,
        limpiar
    };
});