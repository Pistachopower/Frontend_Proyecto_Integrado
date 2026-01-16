<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '@/services/axiosRequest.js';

const route = useRoute();
const productos = ref([]);
const cargando = ref(false);
const error = ref(null);
const categoriaId = route.params.id;

onMounted(async () => {
    cargando.value = true;
    error.value = null;
    try {
        const response = await api.get(`pieza/?categoria=${categoriaId}`);
        
        console.log('📦 Productos:', response.data);
        
        if (response.data.results) {
            productos.value = response.data.results;
        } else if (Array.isArray(response.data)) {
            productos.value = response.data;
        }
        
        console.log(`✅ ${productos.value.length} productos cargados`);
        
    } catch (err) {
        console.error('❌ Error:', err);
        error.value = 'Error al cargar los productos';
    } finally {
        cargando.value = false;
    }
});
</script>

<template>
    <div class="container-fluid py-5">
        <!-- Encabezado -->
        <div class="mb-5">
            <h2 class="fw-bold mb-2">Productos de la Categoría</h2>
            <router-link to="/" class="btn btn-secondary btn-sm">← Volver</router-link>
        </div>

        <!-- Cargando -->
        <div v-if="cargando" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert alert-danger">
            ❌ {{ error }}
        </div>

        <!-- Sin productos -->
        <div v-if="!cargando && productos.length === 0" class="alert alert-info">
            ⚠️ No hay productos en esta categoría
        </div>

        <!-- Grid de productos -->
        <div v-if="productos.length > 0" class="row g-4">
            <div v-for="producto in productos" :key="producto.id" class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div class="card h-100">
                    <img :src="producto.imagen" :alt="producto.nombre" class="card-img-top" style="height: 250px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">{{ producto.nombre }}</h5>
                        <p class="card-text text-muted small">{{ producto.descripcion }}</p>
                        <p class="card-text fw-bold text-primary mt-auto">€ {{ producto.precio }}</p>
                        <router-link :to="`/producto/${producto.id}`" class="btn btn-primary btn-sm">Ver detalles</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>