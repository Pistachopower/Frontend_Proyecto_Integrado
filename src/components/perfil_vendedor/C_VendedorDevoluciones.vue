<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/axiosRequest.js';

const devoluciones = ref([]);
const cargando = ref(true);
const error = ref(null);

const formatoFecha = (fechaString) => {
  if (!fechaString) return '';
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(valor);
};

const getEstadoClase = (estado) => {
  const clases = {
    1: 'bg-warning text-dark',   // Pendiente
    2: 'bg-success text-white',  // Aprobada
    3: 'bg-danger text-white'    // Rechazada
  };
  return clases[estado] || 'bg-secondary text-white';
};

const getEstadoLineaPedido = (devolucion) => {
  console.log(devolucion.linea_pedido_estado);
  if (devolucion?.linea_pedido_estado === 1) {
    return '(Entregado)';
  } else if (devolucion?.linea_pedido_estado === 2) {
    return '(Devuelto)';
  }
  return `(Entregado)`; ;
};


// --- APROBAR DEVOLUCIÓN ---
const aprobarCargando = ref(null); // id de la devolución en proceso
const rechazarCargando = ref(null); // id de la devolución en proceso
const errorAccion = ref({}); // { [id]: 'mensaje' }

const aprobarDevolucion = async (id) => {
  aprobarCargando.value = id;
  errorAccion.value[id] = null;
  try {
    await api.post(`devoluciones/${id}/aprobar/`, {});
    await fetchDevoluciones();
  } catch (err) {
    errorAccion.value[id] = 'No se pudo aprobar.';
  } finally {
    aprobarCargando.value = null;
  }
};

const rechazarDevolucion = async (id) => {
  rechazarCargando.value = id;
  errorAccion.value[id] = null;
  try {
    await api.post(`devoluciones/${id}/rechazar/`, {});
    await fetchDevoluciones();
  } catch (err) {
    errorAccion.value[id] = 'No se pudo rechazar.';
  } finally {
    rechazarCargando.value = null;
  }
};

const fetchDevoluciones = async () => {
  cargando.value = true;
  error.value = null;
  try {
    const response = await api.get('devoluciones/');
    devoluciones.value = response.data;
  } catch (err) {
    error.value = 'No se pudo cargar el historial de devoluciones.';
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  fetchDevoluciones();
});
</script>

<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
      <h5 class="mb-0 fw-bold text-primary">Devoluciones de Clientes</h5>
    </div>
    <div class="card-body">
      <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted small">Cargando devoluciones...</p>
      </div>
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <div>{{ error }}</div>
      </div>
      <div v-else-if="devoluciones.length === 0" class="text-center py-5">
        <i class="bi bi-arrow-return-left display-1 text-muted opacity-25"></i>
        <h5 class="mt-3 text-muted">No hay devoluciones registradas.</h5>
      </div>
      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th class="border-0 text-muted small text-uppercase ps-3">ID</th>
              <th class="border-0 text-muted small text-uppercase">Pieza</th>
              <th class="border-0 text-muted small text-uppercase">Pedido</th>
              <th class="border-0 text-muted small text-uppercase">Cliente</th>
              <th class="border-0 text-muted small text-uppercase">Motivo</th>
              <th class="border-0 text-muted small text-uppercase">Estado de la pieza</th>
              <th class="border-0 text-muted small text-uppercase">Cantidad</th>
              <th class="border-0 text-muted small text-uppercase">Reembolso</th>
              <th class="border-0 text-muted small text-uppercase">Solicitud</th>
              <th class="border-0 text-muted small text-uppercase">Aprobación</th>
              <th class="border-0 text-muted small text-uppercase">Estado</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="devolucion in devoluciones" :key="devolucion.id">
              <td class="fw-bold ps-3 text-primary">{{ devolucion.linea_pedido }}</td>
              <td>{{ devolucion.pieza_nombre }}</td>
              <td>#{{ devolucion.pedido_id }}</td>
              <td>{{ devolucion.cliente_nombre }}</td>
              <td class="text-truncate" style="max-width: 200px;" :title="devolucion.motivo">
                {{ devolucion.motivo }}
              </td>
              <td>{{ getEstadoLineaPedido(devolucion)}}</td>
              <td>{{ devolucion.cantidad_devuelta }}</td>
              <td>{{ formatoMoneda(devolucion.monto_reembolso) }}</td>
              <td>{{ formatoFecha(devolucion.fecha_solicitud) }}</td>
              <td>{{ devolucion.fecha_aprobacion ? formatoFecha(devolucion.fecha_aprobacion) : '-' }}</td>
              <td>
                <span class="badge" :class="getEstadoClase(devolucion.estado)">
                  {{ devolucion.estado_display }} 
                </span>
                <div v-if="devolucion.estado === 1" class="mt-2">
                  <button class="btn btn-success btn-sm me-1" :disabled="aprobarCargando === devolucion.id || rechazarCargando === devolucion.id" @click="aprobarDevolucion(devolucion.id)">
                    <span v-if="aprobarCargando === devolucion.id" class="spinner-border spinner-border-sm me-1"></span>
                    Aprobar
                  </button>
                  <button class="btn btn-danger btn-sm" :disabled="aprobarCargando === devolucion.id || rechazarCargando === devolucion.id" @click="rechazarDevolucion(devolucion.id)">
                    <span v-if="rechazarCargando === devolucion.id" class="spinner-border spinner-border-sm me-1"></span>
                    Rechazar
                  </button>
                  <div v-if="errorAccion[devolucion.id]" class="text-danger small mt-1">{{ errorAccion[devolucion.id] }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
