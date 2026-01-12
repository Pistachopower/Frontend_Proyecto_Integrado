<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductosRelacionadosStore } from '@/stores/productosRelacionadosStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const store = useProductosRelacionadosStore();
const { productos, cargando, error } = storeToRefs(store);

// --- HELPER ---
const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(valor);
};

// --- NAVEGACIÓN ---
const irAlProducto = (id) => {
    router.push(`/detalle-producto/${id}`); 
};

// --- LIFECYCLE ---
onMounted(() => {
    store.fetchProductosAleatorios();
});

onUnmounted(() => {
    store.limpiar();
});
</script>

<template>
    <div class="mb-5" v-if="!error">
        <h4 class="fw-bold mb-4">También podría interesarte</h4>
        
        <div v-if="cargando" class="text-center py-4">
            <div class="spinner-border text-primary spinner-sm" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>

        <div v-else class="row g-3">
            <!-- ✅ AGREGAR @click="irAlProducto(producto.id)" -->
            <div class="col-6 col-md-4 col-lg-4" v-for="producto in productos" :key="producto.id">
                <div class="card h-100 border-0 shadow-sm product-card cursor-pointer" 
                     @click="irAlProducto(producto.id)">
                    <div class="card-img-top bg-light ratio ratio-4x3">
                        <img :src="`https://placehold.co/400x300?text=${producto.nombre}`" 
                             class="object-fit-cover rounded-top" 
                             :alt="producto.nombre">
                    </div>
                    <div class="card-body">
                        <h6 class="card-title text-truncate">{{ producto.nombre }}</h6>
                        <p class="text-muted small mb-2">{{ producto.marca }} - {{ producto.anio }}</p>
                        <p class="card-text text-primary fw-bold">{{ formatoMoneda(producto.precio_base) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-card { 
    transition: transform 0.2s, box-shadow 0.2s;
}
.product-card:hover { 
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}
.cursor-pointer { 
    cursor: pointer; 
}
.spinner-sm {
    width: 1.5rem;
    height: 1.5rem;
}
</style>