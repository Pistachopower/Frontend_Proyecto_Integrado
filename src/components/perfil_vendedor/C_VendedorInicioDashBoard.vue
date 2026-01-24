<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore.js';

const authStore = useAuthStore();

// Estado para estadísticas (reemplazar con datos reales del backend)

onMounted(() => {
  //console.log('Dashboard Vendedor Cargado');
  // Aquí iría la llamada al backend para obtener estadísticas reales
  // fetchEstadisticas();
});
</script>

<template>
  <div class="row g-3">
    
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
              <h4 class="fw-bold mb-0">€</h4>
            </div>
            <div class="rounded-circle p-3 bg-success-subtle">
              <i class="bi bi-cash-coin fs-5 text-success"></i>
            </div>
          </div>
          <small class="text-success">
            <i class="bi bi-arrow-up"></i> +12% respecto ayer
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
              <h4 class="fw-bold mb-0">estadisticas.pedidosPendientes</h4>
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
              <h4 class="fw-bold mb-0">estadisticas.productosActivos</h4>
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
              <h4 class="fw-bold mb-0">estadisticas.valoracionPromedio ★</h4>
            </div>
            <div class="rounded-circle p-3 bg-primary-subtle">
              <i class="bi bi-star-fill fs-5 text-primary"></i>
            </div>
          </div>
          <small class="text-primary">
            <i class="bi bi-people"></i> estadisticas.clientesFrecuentes clientes
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
            <h3 class="fw-bold mb-2">estadisticas.ventasEsta €</h3>
            <p class="text-muted mb-0">
              <i class="bi bi-graph-up text-success me-1"></i>
              +25% respecto semana anterior
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
            <h3 class="fw-bold mb-2">estadisticas.clientesFrecuentes</h3>
            <p class="text-muted mb-0">
              <i class="bi bi-people text-info me-1"></i>
              Clientes que compran regularmente
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- FILA 3: ÚLTIMAS TRANSACCIONES -->
    <div class="col-12">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 class="fw-bold mb-0">
            <i class="bi bi-receipt me-2"></i>Últimas Transacciones
          </h6>
          <router-link to="/vendedor-dashboard/pedidos" class="btn btn-sm btn-outline-primary">
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
              <tr>
                <td class="align-middle">
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-light p-2 me-2" style="width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">
                      <i class="bi bi-person-circle text-muted"></i>
                    </div>
                    <span class="fw-500">transacciones cliente</span>
                  </div>
                </td>
                <td class="align-middle fw-bold">transacciones cliente</td>
                <td class="align-middle">
                  <span>
                    transacciones cliente
                  </span>
                </td>
                <td class="align-middle text-muted small">fecha</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

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