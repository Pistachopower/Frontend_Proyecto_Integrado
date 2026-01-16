<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useProductosRelacionadosStore } from '@/stores/productosRelacionadosStore';
import { storeToRefs } from 'pinia';

const route = useRoute();
const store = useProductosRelacionadosStore();
const { productos: productosRelacionados, cargando, error } = storeToRefs(store);

// Obtén el ID directamente de la ruta
const piezaId = ref(null);

onMounted(() => {
    piezaId.value = route.params.id;
    if (piezaId.value) {
        store.fetchProductosPorMarca(Number(piezaId.value));
    }
});

// Observa cambios en la ruta (por si navegan a otro producto)
watch(() => route.params.id, (nuevoId) => {
    console.log('Nuevo ID de ruta:', nuevoId);
    if (nuevoId) {
        piezaId.value = nuevoId;
        store.fetchProductosPorMarca(Number(nuevoId));
    }
});

onUnmounted(() => {
    store.limpiar();
});
</script>

<template>
    <div class="mb-5">
        <h4 class="fw-bold mb-4">También podría interesarte</h4>
        
        <div v-if="cargando" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <div v-else class="row g-3">
            <div v-for="producto in productosRelacionados" :key="producto.id" class="col-12 col-sm-6 col-lg-3">
                <div class="card product-card h-100 border-0 shadow-sm">
                    <img :src="producto.imagen" class="card-img-top" :alt="producto.nombre">
                    <div class="card-body">
                        <h6 class="card-title fw-bold">{{ producto.nombre }}</h6>
                        <p class="text-muted small mb-2">{{ producto.marca }}</p>
                        <p class="text-primary fw-bold">{{ producto.precio_base }}€</p>
                        <router-link :to="`/detalle-producto/${producto.id}`" class="btn btn-sm btn-outline-primary w-100">
                            Ver detalles
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-card { transition: transform 0.2s; }
.product-card:hover { transform: translateY(-5px); }
</style>