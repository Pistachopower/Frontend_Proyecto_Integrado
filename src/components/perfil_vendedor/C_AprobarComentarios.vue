<script setup>
import api from '../../services/axiosRequest.js';
import { ref, onMounted } from 'vue';

const comentariosPendientes = ref([]);
const cargando = ref(true);
const error = ref(null);

const obtenerComentariosPendientes = async () => {
  cargando.value = true;
  try {
    const response = await api.get('valoracion/pendientes/');
    comentariosPendientes.value = response.data;
    error.value = null;
  } catch (err) {
    error.value = 'Error al cargar comentarios pendientes';
  } finally {
    cargando.value = false;
  }
};


const aprobarComentario = async (id) => {
  if (!window.confirm('¿Estás seguro de que quieres aprobar este comentario?')) {
    return;
  }
  try {
    const response = await api.post(`valoracion/${id}/aprobar/`);
    // Muestra el mensaje recibido del backend
    if (response && response.data && response.data.mensaje) {
      window.alert(response.data.mensaje);
    }
    // Elimina el comentario aprobado de la lista
    comentariosPendientes.value.valoraciones = comentariosPendientes.value.valoraciones.filter(c => c.id !== id);

  } catch (err) {
    alert('Error al aprobar el comentario');
  }
};

const rechazarComentario = async (id) => {
  if (!window.confirm('¿Estás seguro de que quieres rechazar este comentario?')) {
    return;
  }
  try {
    const response = await api.post(`valoracion/${id}/rechazar/`);

    // Muestra el mensaje recibido del backend
    if (response && response.data && response.data.mensaje) {
      window.alert(response.data.mensaje);
    }

    comentariosPendientes.value.valoraciones = comentariosPendientes.value.valoraciones.filter(c => c.id !== id);
  
  } catch (err) {
    alert('Error al rechazar el comentario');
  }
};

onMounted(() => {
  obtenerComentariosPendientes();
});


</script>


<template>
  <div class="container py-5 fade-in">

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
      <div>
        <h2 class="fw-bold mb-1">Moderación de Comentarios</h2>
        <p class="text-muted mb-0">Revisa las opiniones de los usuarios antes de publicarlas.</p>
      </div>
    </div>

    <div v-if="cargando">Cargando comentarios...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else>
      <div v-if="comentariosPendientes.length === 0" class="alert alert-info">
        No hay comentarios pendientes.
      </div>
      <div v-else class="row g-4">
        <div class="col-12" v-for="comentario in comentariosPendientes.valoraciones" :key="comentario.id">
          <div class="card border-0 shadow-sm animate-item">
            <div class="card-body p-4">
              <div class="row align-items-center g-4">
                <div class="col-12 col-md-3 border-end-md">
                  <div class="d-flex flex-column align-items-center mb-3">
                    <img :src="comentario.imagen_pieza || 'https://placehold.co/80x80/png?text=Pieza'" class="img-thumbnail mb-2" width="80" height="80" alt="Imagen de pieza">
                    <span class="badge bg-primary mb-1">Pieza: {{ comentario.nombre_pieza }}</span>
                    <h6 class="fw-bold mb-0 text-truncate"><span class="badge bg-secondary me-1">Cliente</span>{{ comentario.nombre_cliente }}</h6>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="mb-2">
                    <span class="fw-bold">{{ comentario.titulo }}</span>
                  </div>
                  <div class="mb-2">
                    <span class="text-warning">
                      <i v-for="n in 5" :key="n" class="bi"
                        :class="n <= comentario.puntuacion ? 'bi-star-fill' : 'bi-star'"></i>
                    </span>
                  </div>
                  <p class="text-muted mb-0">
                    "{{ comentario.comentario }}"
                  </p>
                  <small class="text-muted">Valorado el {{ comentario.fecha_valoracion }}</small>
                </div>
                <div class="col-12 col-md-3 text-end">
                  <div class="d-flex flex-column align-items-end gap-2">
                    <button class="btn btn-outline-danger btn-sm w-100 mb-2" @click="rechazarComentario(comentario.id)">
                      <i class="bi bi-x-lg me-1"></i> Rechazar
                    </button>
                    <button class="btn btn-success btn-sm w-100" @click="aprobarComentario(comentario.id)">
                      <i class="bi bi-check-lg me-1"></i> Aprobar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Animación de entrada */
.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Botones del filtro Toggle */
.btn-white {
  background-color: white;
  border: 1px solid #e9ecef;
}

.transition-all {
  transition: all 0.2s ease;
}

/* Animación de la lista (opcional si usas transition-group) */
.animate-item {
  transition: transform 0.2s;
}

/* Separador vertical solo en desktop */
@media (min-width: 768px) {
  .border-end-md {
    border-right: 1px solid #e9ecef;
  }
}

/* Efecto hover botones acción */
.action-btn {
  transition: transform 0.1s;
}

.action-btn:active {
  transform: scale(0.95);
}
</style>