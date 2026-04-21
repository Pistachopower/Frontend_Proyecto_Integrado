<script setup>


import { onMounted } from 'vue';
//import { useAuthStore } from '../../stores/authStore.js';
import { useDashboardVendedorStore } from '../../stores/dashboardVendedorStore.js';

//const authStore = useAuthStore();
const dashboardStore = useDashboardVendedorStore();

onMounted(() => {
  dashboardStore.fetchDashboardVendedor();
});
</script>

<template>
  <div class="row g-3">
    <div v-if="dashboardStore.cargando" class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-if="dashboardStore.error" class="col-12">
      <div class="alert alert-danger">{{ dashboardStore.error }}</div>
    </div>
    <template v-if="dashboardStore.dashboard && !dashboardStore.cargando && !dashboardStore.error">
    
    <!-- FILA 1: ESTADÍSTICAS PRINCIPALES -->
    <div class="col-12">
      <h5 class="fw-bold mb-3">
        <i class="bi bi-speedometer2 me-2"></i>Panel de Control
      </h5>
    </div>

    <!-- TARJETA 1: Ventas Hoy -->
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card border-0 shadow-sm h-100 stat-card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem;">
                Ventas Hoy
              </small>
              <h4 class="fw-bold mb-0">€{{ dashboardStore.dashboard.ventas_hoy }}</h4>
            </div>
            <div class="rounded-circle p-3 bg-success-subtle">
              <i class="bi bi-cash-coin fs-5 text-success"></i>
            </div>
          </div>
          <small :class="dashboardStore.dashboard.porcentaje_vs_ayer >= 0 ? 'text-success' : 'text-danger'">
            <i :class="dashboardStore.dashboard.porcentaje_vs_ayer >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
            {{ dashboardStore.dashboard.porcentaje_vs_ayer >= 0 ? '+' : '' }}{{ dashboardStore.dashboard.porcentaje_vs_ayer }}% respecto ayer
          </small>
        </div>
      </div>
    </div>

    <!-- TARJETA 2: Pedidos Pendientes -->
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card border-0 shadow-sm h-100 stat-card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem;">
                Pendientes
              </small>
              <h4 class="fw-bold mb-0">{{ dashboardStore.dashboard.pedidos_pendientes }}</h4>
            </div>
            <div class="rounded-circle p-3 bg-warning-subtle">
              <i class="bi bi-box-seam fs-5 text-warning"></i>
            </div>
          </div>
          <small class="text-warning">
            <i class="bi bi-exclamation-circle"></i> Requieren atención
          </small>
        </div>
      </div>
    </div>

    <!-- TARJETA 3: Productos Activos -->
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card border-0 shadow-sm h-100 stat-card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem;">
                Productos Activos
              </small>
              <h4 class="fw-bold mb-0">{{ dashboardStore.dashboard.producto_activo }} ({{ dashboardStore.dashboard.producto_activo_cantidad }})</h4>
            </div>
            <div class="rounded-circle p-3 bg-info-subtle">
              <i class="bi bi-archive fs-5 text-info"></i>
            </div>
          </div>
          <small class="text-info">
            <i class="bi bi-check-circle"></i> En catálogo
          </small>
        </div>
      </div>
    </div>

    <!-- TARJETA 4: Valoración Promedio -->
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card border-0 shadow-sm h-100 stat-card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem;">
                Valoración
              </small>
              <h4 class="fw-bold mb-0">{{ dashboardStore.dashboard.valoracion_promedio }} ★</h4>
            </div>
            <div class="rounded-circle p-3 bg-primary-subtle">
              <i class="bi bi-star-fill fs-5 text-primary"></i>
            </div>
          </div>
          <small class="text-primary">
            <i class="bi bi-people"></i> {{ dashboardStore.dashboard.cliente_frecuente }} ({{ dashboardStore.dashboard.cliente_frecuente_pedidos }} pedidos)
          </small>
        </div>
      </div>
    </div>

    <!-- FILA 2: ESTADÍSTICAS SECUNDARIAS -->
    <div class="col-12 col-lg-6">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 py-3">
          <h6 class="fw-bold mb-0">Ventas Esta Semana</h6>
        </div>
        <div class="card-body">
          <div class="text-center py-4">
            <h3 class="fw-bold mb-2">€{{ dashboardStore.dashboard.ventas_semana }}</h3>
            <p :class="dashboardStore.dashboard.porcentaje_vs_semana_pasada >= 0 ? 'text-success' : 'text-danger'">
              <i :class="dashboardStore.dashboard.porcentaje_vs_semana_pasada >= 0 ? 'bi bi-graph-up text-success me-1' : 'bi bi-graph-down text-danger me-1'"></i>
              {{ dashboardStore.dashboard.porcentaje_vs_semana_pasada >= 0 ? '+' : '' }}{{ dashboardStore.dashboard.porcentaje_vs_semana_pasada }}% respecto semana anterior
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-6">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 py-3">
          <h6 class="fw-bold mb-0">Clientes Frecuentes</h6>
        </div>
        <div class="card-body">
          <div class="text-center py-4">
            <h3 class="fw-bold mb-2">{{ dashboardStore.dashboard.cliente_frecuente }}</h3>
            <p class="text-muted mb-0">
              <i class="bi bi-people text-info me-1"></i>
              Clientes que compran regularmente
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- FILA 3: EVENTOS GLOBALES -->
    <div class="col-12">
      <h6 class="fw-bold mb-2 mt-2">
        <i class="bi bi-activity me-2"></i>Eventos Globales
      </h6>
    </div>

    <div class="col-12 col-lg-4">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-header bg-white border-0 py-3">
          <h6 class="fw-bold mb-0">Producto Más Visto</h6>
        </div>
        <div class="card-body">
          <template v-if="dashboardStore.dashboard.producto_mas_visto_global">
            <p class="mb-1"><strong>Referencia:</strong> {{ dashboardStore.dashboard.producto_mas_visto_global.propiedades__referencia || 'N/A' }}</p>
            <p class="mb-1"><strong>Pieza ID:</strong> {{ dashboardStore.dashboard.producto_mas_visto_global.propiedades__pieza_id ?? 'N/A' }}</p>
            <p class="mb-0 text-muted"><strong>Cantidad de veces visto:</strong> {{ dashboardStore.dashboard.producto_mas_visto_global.total_eventos ?? 0 }}</p>
          </template>
          <p v-else class="text-muted mb-0">Sin datos de visualizaciones.</p>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-4">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-header bg-white border-0 py-3">
          <h6 class="fw-bold mb-0">Búsqueda Más Frecuente</h6>
        </div>
        <div class="card-body">
          <template v-if="dashboardStore.dashboard.busqueda_mas_frecuente_global">
            <p class="mb-1"><strong>Búsqueda:</strong> {{ dashboardStore.dashboard.busqueda_mas_frecuente_global.propiedades__query || 'N/A' }}</p>
            <p class="mb-0 text-muted"><strong>Cantidad de veces buscada:</strong> {{ dashboardStore.dashboard.busqueda_mas_frecuente_global.total_eventos ?? 0 }}</p>
          </template>
          <p v-else class="text-muted mb-0">Sin datos de búsquedas.</p>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-4">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-header bg-white border-0 py-3">
          <h6 class="fw-bold mb-0">Más Añadida al Carrito</h6>
        </div>
        <div class="card-body">
          <template v-if="dashboardStore.dashboard.pieza_mas_agregada_carrito_global">
            <p class="mb-1"><strong>Referencia:</strong> {{ dashboardStore.dashboard.pieza_mas_agregada_carrito_global.propiedades__pieza_id || 'N/A' }}</p>
            <p class="mb-1"><strong>Pieza ID:</strong> {{ dashboardStore.dashboard.pieza_mas_agregada_carrito_global.propiedades__pieza_id ?? 'N/A' }}</p>
            <p class="mb-0 text-muted"><strong>Cantidad de veces agregado:</strong> {{ dashboardStore.dashboard.pieza_mas_agregada_carrito_global.total_eventos ?? 0 }}</p>
          </template>
          <p v-else class="text-muted mb-0">Sin datos de carrito.</p>
        </div>
      </div>
    </div>

    <!-- FILA 4: ÚLTIMAS TRANSACCIONES -->
    <div class="col-12">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 class="fw-bold mb-0">
            <i class="bi bi-receipt me-2"></i>Listado de Pedidos Recientes
          </h6>
          <router-link to="/perfil-vendedor/pedidos" class="btn btn-sm btn-outline-primary">
            Ver Todas
          </router-link>
        </div>
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="border-0">Cliente</th>
                <th class="border-0">Monto</th>
                <th class="border-0">Estado</th>
                <th class="border-0">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tx, idx) in dashboardStore.dashboard.ultimas_transacciones" :key="idx">
                <td class="align-middle">
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-light p-2 me-2" style="width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">
                      <i class="bi bi-person-circle text-muted"></i>
                    </div>
                    <span class="fw-500">{{ tx.cliente }}</span>
                  </div>
                </td>
                <td class="align-middle fw-bold">€{{ tx.monto }}</td>
                <td class="align-middle">
                  <span>{{ tx.estado }}</span>
                </td>
                <td class="align-middle text-muted small">{{ tx.fecha }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    </template>
  </div>
</template>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.12) !important;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa !important;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
  border-radius: 50px;
}
</style>