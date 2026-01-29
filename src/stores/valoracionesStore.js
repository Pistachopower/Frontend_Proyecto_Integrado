import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/axiosRequest';

export const useValoracionesStore = defineStore('valoraciones', () => {
    const pieza = ref(null);
    const promedioPuntuacion = ref(0);
    const totalValoraciones = ref(0);
    const valoraciones = ref([]);
    const cargando = ref(false);
    const error = ref(null);

    // --- OBTENER VALORACIONES POR PIEZA ---
    const fetchValoracionesPorPieza = async (piezaId) => {
        cargando.value = true;
        error.value = null;
        try {
            const response = await api.get(`/valoracion/por_pieza/?pieza_id=${piezaId}`);
            pieza.value = response.data.pieza;
            promedioPuntuacion.value = response.data.promedio_puntuacion;
            totalValoraciones.value = response.data.total_valoraciones;
            valoraciones.value = response.data.valoraciones;
            //console.log('Valoraciones cargadas:', response.data);
        } catch (err) {
            error.value = err.message || 'Error al cargar valoraciones';
            console.error('Error fetchValoracionesPorPieza:', err);
        } finally {
            cargando.value = false;
        }
    };

    // --- LIMPIAR ---
    const limpiar = () => {
        pieza.value = null;
        promedioPuntuacion.value = 0;
        totalValoraciones.value = 0;
        valoraciones.value = [];
        error.value = null;
    };

    return {
        pieza,
        promedioPuntuacion,
        totalValoraciones,
        valoraciones,
        cargando,
        error,
        fetchValoracionesPorPieza,
        limpiar
    };
});