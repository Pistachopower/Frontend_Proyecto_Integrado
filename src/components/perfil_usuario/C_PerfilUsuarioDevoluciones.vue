<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/axiosRequest.js';

// --- ESTADO ---
const devoluciones = ref([]);
const cargando = ref(true);
const error = ref(null);

// Modal para nueva devolución
const mostrarModal = ref(false);
const enviando = ref(false);
const lineasPedidoEntregadas = ref([]); // líneas de pedido con estado 4
const seleccionadas = ref([]); // ids de líneas seleccionadas
const formulario = ref({
  motivo: '',
  cantidades: {} // { linea_pedido_id: cantidad }
});
const errorFormulario = ref(null);
const resultadosDevolucion = ref(null); // para mostrar la respuesta del backend

// --- HELPER: Formato de Fecha ---
const formatoFecha = (fechaString) => {
  if (!fechaString) return '';
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// --- HELPER: Formato de Moneda ---
const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(valor);
};

// --- HELPER: Clase de Estado ---
const getEstadoClase = (estado) => {
  const clases = {
    1: 'bg-warning text-dark',   // Pendiente
    2: 'bg-success text-white',  // Aprobada
    3: 'bg-danger text-white'    // Rechazada
  };
  return clases[estado] || 'bg-secondary text-white';
};

// --- LÓGICA: Cargar Devoluciones ---
const fetchDevoluciones = async () => {
  cargando.value = true;
  error.value = null;
  try {
    const response = await api.get('mis-devoluciones/');
    devoluciones.value = response.data;
    //console.log("📦 Devoluciones recibidas:", response.data);
  } catch (err) {
    console.error("Error obteniendo devoluciones:", err);
    error.value = 'No se pudo cargar el historial de devoluciones.';
  } finally {
    cargando.value = false;
  }
};

// --- LÓGICA: Crear Devolución múltiple ---
const crearDevolucion = async () => {
  enviando.value = true;
  errorFormulario.value = null;
  resultadosDevolucion.value = null;

  // Prepara el payload: lista de devoluciones
  const devolucionesPayload = seleccionadas.value.map(lineaId => ({
    linea_pedido: lineaId,
    motivo: formulario.value.motivo,
    cantidad_devuelta: Number(formulario.value.cantidades[lineaId] || 1)
  }));

  try {
    // Si es una sola devolución, enviar como objeto, si son varias, como array
    const payload = devolucionesPayload.length === 1 ? devolucionesPayload[0] : devolucionesPayload;
    const response = await api.post('mis-devoluciones/', payload);
    resultadosDevolucion.value = response.data.resultados;
    // Limpiar selección y recargar lista
    seleccionadas.value = [];
    formulario.value = { motivo: '', cantidades: {} };
    await fetchDevoluciones();
  } catch (err) {
    console.error("Error creando devolución:", err);
    errorFormulario.value = err.response?.data?.detail || 'No se pudo procesar la devolución.';
  } finally {
    enviando.value = false;
  }
};


//Traer líneas de pedido entregadas (estado 4)
const fetchLineasPedidoEntregadas = async () => {
  try {
    const response = await api.get('mis-devoluciones/mostrar_lineas_cliente_devolucion/');
    lineasPedidoEntregadas.value = response.data.lineas_para_devolucion;
  } catch (err) {
    lineasPedidoEntregadas.value = [];
  }
};

// --- LÓGICA: Abrir/Cerrar Modal ---
const abrirModal = async () => {
  await fetchLineasPedidoEntregadas();
  seleccionadas.value = [];
  formulario.value = { motivo: '', cantidades: {} };
  errorFormulario.value = null;
  resultadosDevolucion.value = null;
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

onMounted(() => {
  fetchDevoluciones();
});
</script>

<template>
  <div class="card border-0 shadow-sm">
    
    <!-- Cabecera -->
    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
      <h5 class="mb-0 fw-bold text-primary">Mis Devoluciones</h5>
      <button class="btn btn-primary btn-sm" @click="abrirModal">
        <i class="bi bi-plus-lg me-1"></i> Nueva Devolución
      </button>
    </div>

    <div class="card-body">
      
      <!-- Cargando -->
      <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted small">Cargando devoluciones...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <div>{{ error }}</div>
      </div>

      <!-- Sin devoluciones -->
      <div v-else-if="devoluciones.length === 0" class="text-center py-5">
        <i class="bi bi-arrow-return-left display-1 text-muted opacity-25"></i>
        <h5 class="mt-3 text-muted">No tienes devoluciones registradas.</h5>
      </div>

      <!-- Lista de devoluciones -->
      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th class="border-0 text-muted small text-uppercase ps-3">ID</th>
              <th class="border-0 text-muted small text-uppercase">Pieza</th>
              <th class="border-0 text-muted small text-uppercase">Pedido</th>
              <th class="border-0 text-muted small text-uppercase">Motivo</th>
              <th class="border-0 text-muted small text-uppercase">Cantidad</th>
              <th class="border-0 text-muted small text-uppercase">Reembolso</th>
              <th class="border-0 text-muted small text-uppercase">Solicitud</th>
              <th class="border-0 text-muted small text-uppercase">Fecha aprobación</th>
              <th class="border-0 text-muted small text-uppercase">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="devolucion in devoluciones" :key="devolucion.id">
              <td class="fw-bold ps-3 text-primary">{{ devolucion.id }}</td>
              <td>{{ devolucion.pieza_nombre }}</td>
              <td>{{ devolucion.pedido_id }}</td>
              <td class="text-truncate" style="max-width: 200px;" :title="devolucion.motivo">
                {{ devolucion.motivo }}
              </td>
              <td>{{ devolucion.cantidad_devuelta }}</td>
              <td>{{ formatoMoneda(devolucion.monto_reembolso) }}</td>
              <td>{{ formatoFecha(devolucion.fecha_solicitud) }}</td>
              <td>{{ devolucion.fecha_aprobacion ? formatoFecha(devolucion.fecha_aprobacion) : '-' }}</td>
              <td>
                <span class="badge" :class="getEstadoClase(devolucion.estado)">
                  {{ devolucion.estado_display }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Nueva Devolución -->
    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content bg-white rounded shadow p-4 position-relative" style="max-width: 700px;">
        <button type="button" class="btn-close position-absolute top-0 end-0 m-3" aria-label="Cerrar" @click="cerrarModal"></button>
        <h5 class="mb-3 fw-bold">Solicitar Devolución</h5>

        <!-- Mensaje de error -->
        <div v-if="errorFormulario" class="alert alert-danger">
          {{ errorFormulario }}
        </div>

        <!-- Resultados de la devolución -->
        <div v-if="resultadosDevolucion" class="alert alert-info">
          <div v-for="res in resultadosDevolucion" :key="res.linea_pedido" class="mb-1">
            <template v-if="res.error">
              <span class="text-danger">Línea {{ res.linea_pedido }}: {{ res.error }}</span>
            </template>
            <template v-else>
              <span class="text-success">Línea {{ res.linea_pedido }}: Devolución creada (ID: {{ res.devolucion_id }}) - Estado: {{ res.estado }} - Cantidad: {{ res.cantidad_devuelta }} - Reembolso: {{ res.monto_reembolso }}</span>
            </template>
          </div>
        </div>

        <form @submit.prevent="crearDevolucion">
          <div class="mb-3">
            <label class="form-label">Selecciona las líneas de pedido entregadas</label>
            <div v-if="lineasPedidoEntregadas.length === 0" class="text-muted small">No tienes líneas entregadas para devolver.</div>
            <table v-else class="table table-sm table-bordered align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>ID Línea</th>
                  <th>Pieza</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Pedido</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="linea in lineasPedidoEntregadas" :key="linea.id">
                  <td>
                    <input type="checkbox" :value="linea.id" v-model="seleccionadas" />
                  </td>
                  <td>{{ linea.id }}</td>
                  <td>{{ linea.pieza?.nombre || '-' }}</td>
                  <td>
                    <input type="number" class="form-control form-control-sm" style="width:80px;display:inline-block;"
                      :min="1" :max="linea.cantidad" :disabled="!seleccionadas.includes(linea.id)"
                      v-model.number="formulario.cantidades[linea.id]" />
                    <span class="ms-1 text-muted small">/ {{ linea.cantidad }}</span>
                  </td>
                  <td>
                    <span v-if="!isNaN(Number(linea.precio_unitario))">
                      {{ formatoMoneda(Number(linea.precio_unitario)) }}
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <span v-if="linea.pedido">
                      {{ linea.pedido.split('/').filter(Boolean).pop() }}
                    </span>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mb-3">
            <label class="form-label">Motivo</label>
            <textarea 
              class="form-control" 
              v-model="formulario.motivo"
              rows="3"
              placeholder="Describe el motivo de la devolución..."
              required
            ></textarea>
          </div>

          <div class="d-flex gap-2 justify-content-end">
            <button type="button" class="btn btn-secondary" @click="cerrarModal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="enviando || seleccionadas.length === 0">
              <span v-if="enviando" class="spinner-border spinner-border-sm me-1"></span>
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  max-width: 500px;
  width: 90%;
}
</style>
