<script setup>
import { useCategoriasStore } from '@/stores/categoriasStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const categoriasStore = useCategoriasStore();
const { listado } = storeToRefs(categoriasStore);

onMounted(async () => {
  await categoriasStore.fetchCategorias();
});

// Mapeo de nombre de categoría a ícono de Bootstrap
const iconoCategoria = (nombre) => {
  switch (nombre.toLowerCase()) {
    case 'baterías':
      return 'bi-battery-full';
    case 'cajas de cambio':
      return 'bi-gear-fill';
    case 'pistones':
      return 'bi-circle-square';
    case 'turbinas':
      return 'bi-wind';
    case 'bielas':
      return 'bi-diagram-3-fill';
    default:
      return 'bi-box-seam';
  }
};
</script>

<template>
  <section class="categorias-section py-5 mx-4 mx-lg-5">
    <div class="container-fluid px-4 px-lg-5">
      <!-- Encabezado -->
      <div class="mb-5">
        <h2 class="fw-bold mb-2">Categorías de Productos</h2>
        <p class="text-muted">Descubre nuestras categorías disponibles</p>
      </div>

      <!-- Grid de categorías -->
      <div class="row g-5">
        <div v-for="categoria in listado" :key="categoria.id" class="col-12 col-md-6 col-xl-4">
          <a :href="`/categoria/${categoria.id}`" class="text-decoration-none">
            <div class="card h-100 border-0 shadow-sm position-relative">
              <div class="row g-0 align-items-center">
                <!-- Ícono y texto -->
                <div class="col-3 d-flex flex-column align-items-center justify-content-center py-3">
                  <i :class="['bi', iconoCategoria(categoria.nombre), 'display-5', 'text-danger']"></i>
                  <span class="fw-bold text-uppercase small mt-2 categoria-nombre-truncada">{{ categoria.nombre }}</span>
                </div>
                <!-- Imagen -->
                <div class="col-9">
                  <img :src="categoria.imagen_categoria" :alt="categoria.nombre" class="img-fluid rounded-end w-100" style="object-fit:cover; min-height:160px; max-height:180px;">
                </div>
              </div>
              <div class="card-body py-2 px-3">
                <div class="d-flex flex-wrap gap-2">
                  <span class="badge bg-dark-subtle text-dark">REF: {{ categoria.id }}</span>
                </div>
                <span class="stretched-link"></span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

.categoria-nombre-truncada {
  display: block;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.card.h-100 {
  margin-bottom: 24px;
  margin-top: 8px;
  padding-bottom: 8px;
}

.card-body {
  padding-top: 24px !important;
  padding-bottom: 24px !important;
}

</style>