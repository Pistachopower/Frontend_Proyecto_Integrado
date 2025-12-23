<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/axiosRequest.js'; 
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';

const perfilStore = usePerfilStore();
const metodosPago = ref([]);
const cargando = ref(true);
const error = ref(null);

onMounted(() => {
  fetchMetodosPagos();
});

const fetchMetodosPagos = async () => {
  try {
    const response = await api.get('metodo_pago/?cliente_id=' + perfilStore.perfil.id);
    metodosPago.value = response.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div class="container py-4">
    <h1 class="mb-4">Mis Métodos de Pago</h1>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Cargando métodos de pago...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger shadow-sm">{{ error }}</div>

    <div v-else>
      <div v-for="metodo in metodosPago" :key="metodo.id" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">{{ metodo.tipo_metodo }}</h5>
          <p class="card-text">{{ metodo.es_predeterminado }}</p>
          <p class="card-text">{{ metodo.fecha_agregado }}</p>
        </div>
      </div>
    </div>
  </div>
</template>