<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useValoracionesStore } from '@/stores/valoracionesStore';
import { storeToRefs } from 'pinia';

const route = useRoute();
const store = useValoracionesStore();
//const { pieza, promedioPuntuacion, totalValoraciones, valoraciones, cargando, error } = storeToRefs(store);
const {promedioPuntuacion, totalValoraciones, valoraciones, cargando, error } = storeToRefs(store);


const piezaId = ref(null);

onMounted(() => {
    piezaId.value = route.params.id;
    if (piezaId.value) {
        store.fetchValoracionesPorPieza(Number(piezaId.value));
    }
});

// Observa cambios en la ruta
watch(() => route.params.id, (nuevoId) => {
    console.log('Nuevo ID de ruta:', nuevoId);
    if (nuevoId) {
        piezaId.value = nuevoId;
        store.fetchValoracionesPorPieza(Number(nuevoId));
    }
});

onUnmounted(() => {
    store.limpiar();
});

// --- HELPER: Renderizar estrellas ---
//const renderizarEstrellas = (puntuacion) => {
//    return Array.from({ length: 5 }, (_, i) => i < puntuacion ? '★' : '☆').join('');
//};

// --- HELPER: Formato de Fecha ---
const formatoFecha = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};
</script>

<template>
    <div class="mb-5">
        <h4 class="fw-bold mb-4">Opiniones del producto</h4>
        
        <div v-if="cargando" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <div v-else>
            <!-- RESUMEN DE VALORACIONES -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-3 text-center border-end">
                            <div class="display-4 fw-bold text-primary mb-2">
                                {{ promedioPuntuacion.toFixed(1) }}
                            </div>
                            <div class="text-warning mb-2">
                                <i v-for="n in Math.round(promedioPuntuacion)" :key="n" class="bi bi-star-fill"></i>
                                <i v-for="n in (5 - Math.round(promedioPuntuacion))" :key="'empty-' + n" class="bi bi-star"></i>
                            </div>
                            <p class="text-muted small mb-0">
                                {{ totalValoraciones }} {{ totalValoraciones === 1 ? 'valoración' : 'valoraciones' }}
                            </p>
                        </div>
                        <div class="col-md-9">
                            <!-- Desglose por puntuación (opcional pero recomendado) -->
                            <div class="d-flex align-items-center mb-2">
                                <small class="text-muted" style="width: 50px;">5 ⭐</small>
                                <div class="progress flex-grow-1 ms-2" style="height: 8px;">
                                    <div class="progress-bar bg-success" role="progressbar" 
                                        :style="{ width: totalValoraciones > 0 ? ((valoraciones.filter(v => v.puntuacion === 5).length / totalValoraciones) * 100) + '%' : '0%' }">
                                    </div>
                                </div>
                                <small class="text-muted ms-2">{{ valoraciones.filter(v => v.puntuacion === 5).length }}</small>
                            </div>

                            <div class="d-flex align-items-center mb-2">
                                <small class="text-muted" style="width: 50px;">4 ⭐</small>
                                <div class="progress flex-grow-1 ms-2" style="height: 8px;">
                                    <div class="progress-bar bg-info" role="progressbar" 
                                        :style="{ width: totalValoraciones > 0 ? ((valoraciones.filter(v => v.puntuacion === 4).length / totalValoraciones) * 100) + '%' : '0%' }">
                                    </div>
                                </div>
                                <small class="text-muted ms-2">{{ valoraciones.filter(v => v.puntuacion === 4).length }}</small>
                            </div>

                            <div class="d-flex align-items-center mb-2">
                                <small class="text-muted" style="width: 50px;">3 ⭐</small>
                                <div class="progress flex-grow-1 ms-2" style="height: 8px;">
                                    <div class="progress-bar bg-warning" role="progressbar" 
                                        :style="{ width: totalValoraciones > 0 ? ((valoraciones.filter(v => v.puntuacion === 3).length / totalValoraciones) * 100) + '%' : '0%' }">
                                    </div>
                                </div>
                                <small class="text-muted ms-2">{{ valoraciones.filter(v => v.puntuacion === 3).length }}</small>
                            </div>

                            <div class="d-flex align-items-center mb-2">
                                <small class="text-muted" style="width: 50px;">2 ⭐</small>
                                <div class="progress flex-grow-1 ms-2" style="height: 8px;">
                                    <div class="progress-bar bg-danger" role="progressbar" 
                                        :style="{ width: totalValoraciones > 0 ? ((valoraciones.filter(v => v.puntuacion === 2).length / totalValoraciones) * 100) + '%' : '0%' }">
                                    </div>
                                </div>
                                <small class="text-muted ms-2">{{ valoraciones.filter(v => v.puntuacion === 2).length }}</small>
                            </div>

                            <div class="d-flex align-items-center">
                                <small class="text-muted" style="width: 50px;">1 ⭐</small>
                                <div class="progress flex-grow-1 ms-2" style="height: 8px;">
                                    <div class="progress-bar bg-danger" role="progressbar" 
                                        :style="{ width: totalValoraciones > 0 ? ((valoraciones.filter(v => v.puntuacion === 1).length / totalValoraciones) * 100) + '%' : '0%' }">
                                    </div>
                                </div>
                                <small class="text-muted ms-2">{{ valoraciones.filter(v => v.puntuacion === 1).length }}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LISTADO DE VALORACIONES -->
            <div v-if="valoraciones.length > 0" class="card border-0 shadow-sm">
                <div class="list-group list-group-flush">
                    <div v-for="valoracion in valoraciones" :key="valoracion.url" class="list-group-item p-4 border-bottom">
                        <div class="d-flex align-items-start">
                            <!-- Avatar del cliente -->
                            <div class="bg-primary rounded-circle me-3 d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0" 
                                style="width: 50px; height: 50px; font-size: 20px;">
                                {{ valoracion.nombre_cliente.charAt(0).toUpperCase() }}
                            </div>

                            <div class="flex-grow-1">
                                <!-- Nombre y fecha -->
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h6 class="mb-0 fw-bold">{{ valoracion.nombre_cliente }}</h6>
                                    <small class="text-muted">{{ formatoFecha(valoracion.fecha_valoracion) }}</small>
                                </div>

                                <!-- Puntuación con estrellas -->
                                <div class="text-warning mb-2">
                                    <i v-for="n in valoracion.puntuacion" :key="n" class="bi bi-star-fill"></i>
                                    <i v-for="n in (5 - valoracion.puntuacion)" :key="'empty-' + n" class="bi bi-star"></i>
                                </div>

                                <!-- Título del comentario -->
                                <h6 class="mb-2 text-dark">{{ valoracion.titulo }}</h6>

                                <!-- Comentario -->
                                <p class="text-muted mb-0 small">{{ valoracion.comentario }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MENSAJE CUANDO NO HAY VALORACIONES -->
            <div v-else class="alert alert-info text-center py-4">
                <i class="bi bi-info-circle me-2"></i>
                Este producto aún no tiene valoraciones. ¡Sé el primero en valorarlo!
            </div>
        </div>
    </div>
</template>

<style scoped>
.progress { border-radius: 4px; }
.list-group-item:hover { background-color: #f8f9fa; }
</style>