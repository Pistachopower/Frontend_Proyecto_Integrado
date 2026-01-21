<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/axiosRequest.js';
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';

const perfilStore = usePerfilStore();
const comentarios = ref([]);
const cargando = ref(true);
const error = ref(null);
const erroresValidacion = ref({});
const comentarioEditando = ref(null);
const formularioEdicion = ref({
  titulo: '',
  comentario: '',
  puntuacion: 5
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

onMounted(() => {
  fetchComentarios();
});

const abrirEdicion = (comentario) => {
  comentarioEditando.value = comentario.id; //Marca cuál comentario se está editando
  
  formularioEdicion.value = { //crea una copia del comentario para editar
    titulo: comentario.titulo, //copia titulo actual
    comentario: comentario.comentario, 
    puntuacion: comentario.puntuacion
  };
};

const cancelarEdicion = () => {
  comentarioEditando.value = null; //Limpiar el estado de edición
};

const guardarCambios = async (comentarioId) => {
  try {
    await api.put(`valoracion/${comentarioId}/`, {
      titulo: formularioEdicion.value.titulo,
      comentario: formularioEdicion.value.comentario,
      puntuacion: formularioEdicion.value.puntuacion
    });
    
    //Busca el indice sino existe  devuelve -1
    const index = comentarios.value.findIndex(c => c.id === comentarioId);
    if (index !== -1) {

      //Hace una copia del comentario y actualiza los campos editados
      comentarios.value[index] = {
        ...comentarios.value[index],
        ...formularioEdicion.value
      };
    }
    
    //Desactiva la edición
    comentarioEditando.value = null;
  } catch (err) {
    if (err.response?.status === 400 && err.response?.data) {
      erroresValidacion.value = err.response.data;
    } else {  
      error.value = 'Error al actualizar el comentario: ' + err.message;
    }

    
  }
};
</script>

<template>
  <div class="container py-4">
    <h1 class="mb-4">Mis Valoraciones y Comentarios</h1>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Cargando comentarios...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger shadow-sm">{{ error }}</div>

    <div v-else>
      <div v-for="comentario in comentarios" :key="comentario.id" class="card mb-3">
        <div v-if="comentarioEditando === comentario.id" class="card-body">
          <div class="mb-3">
            <label class="form-label">Nombre de la pieza</label>
            <p class="form-control-plaintext">{{ comentario.nombre_pieza }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label">Título</label>
            <input v-model="formularioEdicion.titulo" type="text" class="form-control">
            <div v-if="erroresValidacion.titulo" class="invalid-feedback d-block">
              {{ erroresValidacion.titulo[0] }}
            </div>
          </div>


          <div class="mb-3">
            <label class="form-label">Comentario</label>
            <textarea v-model="formularioEdicion.comentario" class="form-control" rows="4"></textarea>
            <div v-if="erroresValidacion.comentario" class="invalid-feedback d-block">
              {{ erroresValidacion.comentario[0] }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Puntuación</label>
            <select v-model.number="formularioEdicion.puntuacion" class="form-select">
              <option value="1">1 - Muy malo</option>
              <option value="2">2 - Malo</option>
              <option value="3">3 - Normal</option>
              <option value="4">4 - Bueno</option>
              <option value="5">5 - Excelente</option>
            </select>
          </div>
          <div class="mb-3">
            <p class="text-muted">Fecha: {{ comentario.fecha_valoracion }}</p>
          </div>
        </div>

        <router-link v-else :to="`/detalle-producto/${comentario.pieza_id}`" class="list-group-item list-group-item-action border-0 px-4 py-3">
          <div class="card-body">
            <h5 class="card-title">{{ comentario.nombre_pieza }}</h5>
            <p class="card-text">{{ comentario.titulo }}</p>
            <p class="card-text">{{ comentario.fecha_valoracion }}</p>
            <p class="card-text">{{ comentario.comentario }}</p>
            <p class="text-muted">Puntuación: {{ comentario.puntuacion }}/5</p>
          </div>
        </router-link>

        <div class="card-footer bg-transparent">
          <button v-if="comentarioEditando === comentario.id" class="btn btn-success btn-sm me-2" @click="guardarCambios(comentario.id)">Guardar</button>
          <button v-if="comentarioEditando === comentario.id" class="btn btn-secondary btn-sm me-2" @click="cancelarEdicion">Cancelar</button>
          <button v-else class="btn btn-primary btn-sm me-2" @click="abrirEdicion(comentario)">Editar</button>
          <button class="btn btn-danger btn-sm">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>