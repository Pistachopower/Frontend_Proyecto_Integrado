<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/axiosRequest.js'; 
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';

const perfilStore = usePerfilStore();
const comentarios = ref([]);
const cargando = ref(true);
const error = ref(null);

onMounted(() => {
  fetchComentarios();
});

const fetchComentarios = async () => {
  try {
    const response = await api.get('valoracion/?cliente_id=' + perfilStore.perfil.id);
    comentarios.value = response.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div class="container py-4">
    <h1 class="mb-4">Mis Comentarios</h1>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Cargando comentarios...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger shadow-sm">{{ error }}</div>

    <div v-else>
      <div v-for="comentario in comentarios" :key="comentario.id" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">{{ comentario.pieza.nombre }}</h5>
          <p class="card-text">{{ comentario.comentario }}</p>
          <p class="text-muted">Puntuación: {{ comentario.puntuacion }}/5</p>
        </div>
      </div>
    </div>
  </div>
</template>