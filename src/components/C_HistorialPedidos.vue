<script setup>
import { ref, computed } from 'vue';

// --- ESTADO ---
const busqueda = ref('');
const filtroActivo = ref('todos'); // 'todos', 'enviados', 'entregados', 'cancelados'
const paginaActual = ref(1);
const elementosPorPagina = 5;

// Mapeo de estados (Igual que en tu backend)
// 1: Pendiente, 2: Pagado, 3: Enviado, 4: Entregado, 5: Cancelado
const ESTADOS = {
  1: { texto: 'Pendiente', color: 'bg-warning text-dark', filtro: 'pendiente' },
  2: { texto: 'Pagado', color: 'bg-info text-dark', filtro: 'pagado' },
  3: { texto: 'Enviado', color: 'bg-primary', filtro: 'enviados' },
  4: { texto: 'Entregado', color: 'bg-success', filtro: 'entregado' },
  5: { texto: 'Cancelado', color: 'bg-danger', filtro: 'cancelado' }
};

// Datos simulados (Backend: GET /api/v1/pedido/)
const pedidos = ref([
  { id: 1024, fecha: '2023-10-25', estado: 1, total: 150.00 },
  { id: 1023, fecha: '2023-10-24', estado: 3, total: 85.50 },
  { id: 1022, fecha: '2023-10-20', estado: 4, total: 200.00 },
  { id: 1021, fecha: '2023-10-18', estado: 5, total: 45.00 },
  { id: 1020, fecha: '2023-10-15', estado: 4, total: 120.00 },
  { id: 1019, fecha: '2023-10-10', estado: 4, total: 60.00 },
  { id: 1018, fecha: '2023-10-05', estado: 2, total: 300.00 },
]);

// --- FILTROS (COMPUTED) ---
const pedidosFiltrados = computed(() => {
  return pedidos.value.filter(p => {
    // 1. Filtro por Estado
    if (filtroActivo.value !== 'todos') {
      const infoEstado = ESTADOS[p.estado];
      if (infoEstado.filtro !== filtroActivo.value && 
          // Caso especial para agrupar (opcional)
          !(filtroActivo.value === 'enviados' && p.estado === 3) &&
          !(filtroActivo.value === 'entregado' && p.estado === 4) &&
          !(filtroActivo.value === 'cancelado' && p.estado === 5)
         ) {
        return false;
      }
    }

    // 2. Filtro por Buscador (ID o Fecha)
    if (busqueda.value) {
      const term = busqueda.value.toLowerCase();
      return p.id.toString().includes(term) || p.fecha.includes(term);
    }

    return true;
  });
});

// --- PAGINACIÓN (COMPUTED) ---
const totalPaginas = computed(() => Math.ceil(pedidosFiltrados.value.length / elementosPorPagina));

const pedidosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * elementosPorPagina;
  const fin = inicio + elementosPorPagina;
  return pedidosFiltrados.value.slice(inicio, fin);
});

// --- FUNCIONES ---
const formatoDinero = (valor) => {
  return valor.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
};

const cambiarPagina = (delta) => {
  const nuevaPagina = paginaActual.value + delta;
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina;
  }
};

const verDetalle = (id) => {
  console.log("Navegar a detalle pedido:", id);
  // router.push(`/pedidos/${id}`)
};
</script>

<template>
  <div class="container py-5 fade-in">
    
    <h2 class="fw-bold mb-4">Mis Pedidos</h2>

    <div class="row g-3 mb-4">
      
      <div class="col-12 col-md-6">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
          <input 
            v-model="busqueda" 
            type="text" 
            class="form-control border-start-0 ps-0" 
            placeholder="Buscar por Nº Pedido o Fecha..."
          >
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="d-flex gap-2 overflow-auto pb-2 filter-scroll">
          <button 
            class="btn btn-sm rounded-pill px-3 fw-bold text-nowrap"
            :class="filtroActivo === 'todos' ? 'btn-dark' : 'btn-outline-secondary'"
            @click="filtroActivo = 'todos'"
          >
            Todos
          </button>
          <button 
            class="btn btn-sm rounded-pill px-3 fw-bold text-nowrap"
            :class="filtroActivo === 'enviados' ? 'btn-dark' : 'btn-outline-secondary'"
            @click="filtroActivo = 'enviados'"
          >
            Enviados
          </button>
          <button 
            class="btn btn-sm rounded-pill px-3 fw-bold text-nowrap"
            :class="filtroActivo === 'entregado' ? 'btn-dark' : 'btn-outline-secondary'"
            @click="filtroActivo = 'entregado'"
          >
            Entregados
          </button>
          <button 
            class="btn btn-sm rounded-pill px-3 fw-bold text-nowrap"
            :class="filtroActivo === 'cancelado' ? 'btn-dark' : 'btn-outline-secondary'"
            @click="filtroActivo = 'cancelado'"
          >
            Cancelados
          </button>
        </div>
      </div>
    </div>

    <div class="d-block d-md-none">
      <div v-for="pedido in pedidosPaginados" :key="pedido.id" class="card border-0 shadow-sm mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold mb-0">#{{ pedido.id }}</h6>
            <span class="badge rounded-pill" :class="ESTADOS[pedido.estado].color">
              {{ ESTADOS[pedido.estado].texto }}
            </span>
          </div>
          <div class="row text-muted small mb-3">
            <div class="col-6">
              <i class="bi bi-calendar3 me-1"></i> {{ pedido.fecha }}
            </div>
            <div class="col-6 text-end fw-bold text-dark">
              {{ formatoDinero(pedido.total) }}
            </div>
          </div>
          <button class="btn btn-outline-primary w-100 btn-sm" @click="verDetalle(pedido.id)">
            Ver Detalles
          </button>
        </div>
      </div>
    </div>

    <div class="d-none d-md-block">
      <div class="card border-0 shadow-sm overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="py-3 ps-4">Número de Pedido</th>
                <th class="py-3">Fecha</th>
                <th class="py-3">Estado</th>
                <th class="py-3">Total</th>
                <th class="py-3 text-end pe-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pedido in pedidosPaginados" :key="pedido.id">
                <td class="ps-4 fw-bold text-primary">#{{ pedido.id }}</td>
                <td>{{ pedido.fecha }}</td>
                <td>
                  <span class="badge rounded-pill" :class="ESTADOS[pedido.estado].color">
                    {{ ESTADOS[pedido.estado].texto }}
                  </span>
                </td>
                <td class="fw-bold">{{ formatoDinero(pedido.total) }}</td>
                <td class="text-end pe-4">
                  <button class="btn btn-sm btn-outline-dark" @click="verDetalle(pedido.id)">
                    Ver Detalles
                  </button>
                </td>
              </tr>
              <tr v-if="pedidosPaginados.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                  No se encontraron pedidos con estos filtros.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-4">
      <button 
        class="btn btn-outline-secondary px-4" 
        :disabled="paginaActual === 1"
        @click="cambiarPagina(-1)"
      >
        Anterior
      </button>
      
      <span class="text-muted small">
        Página <strong>{{ paginaActual }}</strong> de <strong>{{ totalPaginas || 1 }}</strong>
      </span>

      <button 
        class="btn btn-outline-secondary px-4" 
        :disabled="paginaActual >= totalPaginas"
        @click="cambiarPagina(1)"
      >
        Siguiente
      </button>
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

/* Scroll horizontal para los filtros en móvil */
.filter-scroll::-webkit-scrollbar {
  display: none; /* Ocultar scrollbar visualmente pero permitir scroll */
}
.filter-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Efecto hover suave en la tabla */
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
  transition: background-color 0.2s;
}
</style>