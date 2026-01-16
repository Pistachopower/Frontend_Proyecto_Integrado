<script setup>
import { onMounted, computed } from 'vue';
import { usePiezasStore } from '@/stores/piezasStore';
import { storeToRefs } from 'pinia';

const store = usePiezasStore();

// Usamos storeToRefs para que 'listado', 'cargando' y 'error' sigan siendo reactivos
// Al desestructurar, renombramos 'listado' a 'piezas' para que sea más claro en el template
const { listado: piezas, cargando, error } = storeToRefs(store);

// Accedemos a las variables del store
// Asegúrate de que en tu store tengas un state o getter llamado 'imagenes'
const imagenes = computed(() => store.imagenes || []);

const obtenerImagen = (piezaId) => {
    return store.obtenerImagenPorPieza(piezaId);
};


// --- HELPER: Formato de Moneda ---
const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: 'EUR' 
    }).format(valor);
};      

// --- HELPER: Diccionario de Estados ---
const getEstadoInfo = (numEstado) => {
    const estados = {
        1: { texto: 'Nuevo', clase: 'bg-success' },
        2: { texto: 'Usado', clase: 'bg-warning text-dark' },
        3: { texto: 'Reacondicionado', clase: 'bg-info text-dark' }
    };
    return estados[numEstado] || { texto: 'Desconocido', clase: 'bg-secondary' };
};

onMounted(() => {
    store.fetchCatalogo(); //Se carga primero este
    store.fetchImagenesPieza(); //Luego se cargan las imagenes
    console.log(imagenes);
});
</script>

<template>
  <div class="container py-4">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-primary">Catálogo de Repuestos</h2>
        <span v-if="!cargando" class="badge bg-light text-dark border">
            {{ piezas.length }} productos encontrados
        </span>
    </div>

    <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
        {{ error }}
    </div>

    <div v-else-if="piezas.length === 0" class="text-center py-5 bg-light rounded">
        <i class="bi bi-box-seam display-1 text-muted opacity-25"></i>
        <h4 class="mt-3 text-muted">No hay piezas disponibles en este momento.</h4>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 animate-fade">
        
        <div class="col" v-for="pieza in piezas" :key="pieza.id">
            <div class="card h-100 border-0 shadow-sm hover-card">

                <!-- obtenerImagen(pieza.id) -->
                <div class="card-img-top bg-light d-flex align-items-center justify-content-center overflow-hidden" style="height: 200px;">
                    <img 
                        v-if="obtenerImagen(pieza.id)" 
                        :src="obtenerImagen(pieza.id)" 
                        :alt="pieza.nombre" 
                        class="img-fluid" 
                        style="max-height: 100%; width: 100%; object-fit: cover;"
                    >

                    <div v-else class="text-muted text-center">
                        <i class="bi bi-image fs-1"></i>
                        <p class="small mb-0">Sin imagen</p>
                    </div>
                </div>
                
                
                <div class="position-absolute top-0 end-0 m-2">
                    <span class="badge rounded-pill shadow-sm" :class="getEstadoInfo(pieza.estado).clase">
                        {{ getEstadoInfo(pieza.estado).texto }}
                    </span>
                </div>

                <div class="card-body d-flex flex-column">
                    <div class="text-uppercase small text-muted fw-bold mb-1">
                        {{ pieza.marca }} • {{ pieza.anio }}
                    </div>

                    <h5 class="card-title text-dark fw-bold mb-2 text-truncate">
                        {{ pieza.nombre }}
                    </h5>
                    
                    <p class="card-text small text-muted mb-3">
                        <i class="bi bi-upc-scan me-1"></i>Ref: {{ pieza.referencia }}
                    </p>

                    <p class="card-text small text-secondary flex-grow-1 line-clamp-2">
                        {{ pieza.descripcion }}
                    </p>

                    <hr class="my-3 opacity-25">

                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <div class="text-primary fw-bold fs-5">
                            {{ formatoMoneda(pieza.precio_base) }}
                        </div>
                        
                        <router-link 
                            :to="{ name: 'detalle-producto', params: { id: pieza.id } }" 
                            class="btn btn-outline-primary btn-sm rounded-pill px-3"
                        >
                            Ver Detalles
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade { animation: fadeIn 0.5s ease-in-out; }
@keyframes fadeIn { 
    from { opacity: 0; transform: translateY(20px); } 
    to { opacity: 1; transform: translateY(0); } 
}
.hover-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.hover-card:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; cursor: pointer; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>