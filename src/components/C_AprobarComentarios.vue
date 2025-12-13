<script setup>
import { ref, computed } from 'vue';

// --- ESTADO ---
const filtroActivo = ref('pendientes'); // 'pendientes', 'historial'

// Datos Simulados
const comentarios = ref([
  {
    id: 1,
    usuario: 'Pedro Pérez',
    avatar: 'https://placehold.co/50x50/png?text=P',
    producto: 'Alternador Bosch 12V',
    titulo: 'Funciona perfecto',
    texto: 'La pieza llegó rápido y en buen estado. Mi coche arrancó a la primera.',
    estrellas: 5,
    estado: 'pendiente' // pendiente, aprobado, rechazado
  },
  {
    id: 2,
    usuario: 'Usuario Anónimo',
    avatar: 'https://placehold.co/50x50/png?text=?',
    producto: 'Batería 60Ah',
    titulo: 'Mala experiencia',
    texto: 'Llegó golpeada y no me devuelven el dinero. Estafadores!!!',
    estrellas: 1,
    estado: 'pendiente'
  },
  {
    id: 3,
    usuario: 'María García',
    avatar: 'https://placehold.co/50x50/png?text=M',
    producto: 'Filtro Aceite',
    titulo: 'Todo correcto',
    texto: 'Buena relación calidad-precio.',
    estrellas: 4,
    estado: 'pendiente'
  }
]);

// --- COMPUTED ---
const listaVisible = computed(() => {
  if (filtroActivo.value === 'pendientes') {
    return comentarios.value.filter(c => c.estado === 'pendiente');
  } else {
    // Historial: mostramos los que YA no son pendientes
    return comentarios.value.filter(c => c.estado !== 'pendiente');
  }
});

// --- FUNCIONES ---
const moderar = (id, decision) => {
  // decision: 'aprobado' o 'rechazado'
  const index = comentarios.value.findIndex(c => c.id === id);
  if (index !== -1) {
    comentarios.value[index].estado = decision;
    
    // Feedback visual (opcional: toast o alert)
    const accion = decision === 'aprobado' ? 'Aprobado' : 'Rechazado';
    console.log(`Comentario #${id} ${accion}`);
  }
};

const deshacer = (id) => {
  const index = comentarios.value.findIndex(c => c.id === id);
  if (index !== -1) {
    comentarios.value[index].estado = 'pendiente';
  }
};
</script>

<template>
  <div class="container py-5 fade-in">
    
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
      <div>
        <h2 class="fw-bold mb-1">Moderación de Comentarios</h2>
        <p class="text-muted mb-0">Revisa las opiniones de los usuarios antes de publicarlas.</p>
      </div>

      <div class="bg-light p-1 rounded-pill d-inline-flex border">
        <button 
          class="btn btn-sm rounded-pill px-4 fw-bold transition-all"
          :class="filtroActivo === 'pendientes' ? 'btn-white shadow-sm text-primary' : 'text-muted'"
          @click="filtroActivo = 'pendientes'"
        >
          Pendientes <span class="badge bg-danger ms-1" v-if="comentarios.filter(c => c.estado === 'pendiente').length > 0">{{ comentarios.filter(c => c.estado === 'pendiente').length }}</span>
        </button>
        <button 
          class="btn btn-sm rounded-pill px-4 fw-bold transition-all"
          :class="filtroActivo === 'historial' ? 'btn-white shadow-sm text-primary' : 'text-muted'"
          @click="filtroActivo = 'historial'"
        >
          Historial
        </button>
      </div>
    </div>

    <div v-if="listaVisible.length > 0" class="row g-4">
      <div v-for="comentario in listaVisible" :key="comentario.id" class="col-12">
        
        <div class="card border-0 shadow-sm animate-item">
          <div class="card-body p-4">
            <div class="row align-items-center g-4">
              
              <div class="col-12 col-md-3 border-end-md">
                <div class="d-flex align-items-center mb-3">
                  <img :src="comentario.avatar" class="rounded-circle me-3" width="45" height="45">
                  <div>
                    <h6 class="fw-bold mb-0 text-truncate" style="max-width: 140px;">{{ comentario.usuario }}</h6>
                    <small class="text-muted">Cliente verificado</small>
                  </div>
                </div>
                <div class="bg-light p-2 rounded small text-muted">
                  <i class="bi bi-box-seam me-1"></i> {{ comentario.producto }}
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <div class="text-warning small">
                    <i v-for="n in 5" :key="n" class="bi" :class="n <= comentario.estrellas ? 'bi-star-fill' : 'bi-star'"></i>
                  </div>
                  <span class="fw-bold">{{ comentario.titulo }}</span>
                </div>
                <p class="text-muted mb-0">
                  "{{ comentario.texto }}"
                </p>
              </div>

              <div class="col-12 col-md-3 text-end">
                
                <div v-if="comentario.estado === 'pendiente'" class="d-flex gap-2 justify-content-end">
                  <button 
                    class="btn btn-outline-danger btn-sm px-3 fw-bold action-btn"
                    @click="moderar(comentario.id, 'rechazado')"
                  >
                    <i class="bi bi-x-lg d-md-none me-1"></i> Rechazar
                  </button>
                  <button 
                    class="btn btn-success btn-sm px-4 fw-bold text-white shadow-sm action-btn"
                    @click="moderar(comentario.id, 'aprobado')"
                  >
                    <i class="bi bi-check-lg d-md-none me-1"></i> Aprobar
                  </button>
                </div>

                <div v-else class="d-flex flex-column align-items-end">
                  <span 
                    class="badge rounded-pill mb-2 px-3 py-2"
                    :class="comentario.estado === 'aprobado' ? 'bg-success' : 'bg-danger'"
                  >
                    {{ comentario.estado === 'aprobado' ? 'Publicado' : 'Rechazado' }}
                  </span>
                  <button class="btn btn-link btn-sm text-muted p-0 text-decoration-none" @click="deshacer(comentario.id)">
                    <i class="bi bi-arrow-counterclockwise"></i> Deshacer
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-else class="text-center py-5 fade-in">
      <div class="mb-3 text-muted opacity-25">
        <i class="bi bi-chat-square-quote display-1"></i>
      </div>
      <h4 class="fw-bold">No hay comentarios {{ filtroActivo }}</h4>
      <p class="text-muted">¡Buen trabajo! Has revisado todo por ahora.</p>
    </div>

  </div>
</template>

<style scoped>
/* Animación de entrada */
.fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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