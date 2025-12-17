<template>
  <div class="container-fluid py-4 bg-light min-vh-100 fade-in">
    
    <div class="row g-4">
      
      <div class="col-12 col-lg-2">
        <div class="card border-0 shadow-sm h-100 sidebar-card">
          <div class="card-body text-center">
            <div class="mb-4">
              <img src="https://placehold.co/100x100/png?text=CE" class="rounded-circle mb-2 border border-3 border-white shadow-sm" width="80">
              <h6 class="fw-bold mb-0">Carlos Empleado</h6>
              <small class="text-muted">Vendedor Senior</small>
            </div>
            
            <div class="list-group list-group-flush text-start">
              <button class="list-group-item list-group-item-action border-0 rounded mb-1">
                <i class="bi bi-speedometer2 me-2"></i> Dashboard
              </button>
              <button class="list-group-item list-group-item-action border-0 rounded mb-1">
                <i class="bi bi-box-seam me-2"></i> Pedidos
              </button>
              <button class="list-group-item list-group-item-action border-0 rounded mb-1">
                <i class="bi bi-tags me-2"></i> Productos
              </button>
              <button class="list-group-item list-group-item-action border-0 rounded mb-1">
                <i class="bi bi-people me-2"></i> Clientes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-7">
        
        <div class="row g-3 mb-4">
          <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm stat-card">
              <div class="card-body d-flex align-items-center">
                <div class="rounded-circle p-3 me-3 bg-success-subtle">
                  <i class="bi fs-4 bi-cash-coin text-success"></i>
                </div>
                <div>
                  <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem;">Ventas del día</small>
                  <h4 class="fw-bold mb-0">1.250 €</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm stat-card">
              <div class="card-body d-flex align-items-center">
                <div class="rounded-circle p-3 me-3 bg-warning-subtle">
                  <i class="bi fs-4 bi-clock-history text-warning"></i>
                </div>
                <div>
                  <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem;">Pedidos Pendientes</small>
                  <h4 class="fw-bold mb-0">12</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm stat-card">
              <div class="card-body d-flex align-items-center">
                <div class="rounded-circle p-3 me-3 bg-primary-subtle">
                  <i class="bi fs-4 bi-person-plus-fill text-primary"></i>
                </div>
                <div>
                  <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem;">Nuevos Clientes</small>
                  <h4 class="fw-bold mb-0">5</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">Rendimiento Semanal</h5>
            <select class="form-select form-select-sm w-auto border-0 bg-light">
              <option>Esta semana</option>
              <option>Este mes</option>
            </select>
          </div>
          <div class="card-body">
            <div class="chart-container d-flex justify-content-around align-items-end" style="height: 250px;">
              <div class="bar-group text-center">
                <div class="bar bg-primary rounded-top" style="height: 40%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Lun</small>
              </div>
              <div class="bar-group text-center">
                <div class="bar bg-primary rounded-top" style="height: 60%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Mar</small>
              </div>
              <div class="bar-group text-center">
                <div class="bar bg-primary rounded-top" style="height: 30%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Mié</small>
              </div>
              <div class="bar-group text-center">
                <div class="bar bg-primary rounded-top opacity-50" style="height: 80%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Jue</small>
              </div>
              <div class="bar-group text-center">
                <div class="bar bg-primary rounded-top opacity-50" style="height: 50%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Vie</small>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-12 col-md-6">
            <button class="btn btn-outline-primary w-100 py-3 border-dashed">
              <i class="bi bi-plus-circle fs-4 d-block mb-1"></i>
              Añadir Nuevo Producto
            </button>
          </div>
          <div class="col-12 col-md-6">
            <button class="btn btn-dark w-100 py-3">
              <i class="bi bi-list-check fs-4 d-block mb-1"></i>
              Gestionar Pedidos
            </button>
          </div>
        </div>

      </div>

      <div class="col-12 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-0 py-3">
            <h6 class="fw-bold mb-0 text-uppercase text-muted small">Últimos Pedidos Pendientes</h6>
          </div>
          <div class="list-group list-group-flush overflow-auto" style="max-height: 500px;">
            <div class="list-group-item px-3 py-3 border-bottom-0">
              <div class="d-flex w-100 justify-content-between align-items-center mb-1">
                <span class="badge bg-warning text-dark rounded-pill">#1024</span>
                <small class="text-muted" style="font-size: 0.7rem;">Hace 10 min</small>
              </div>
              <h6 class="mb-1 fw-bold text-truncate">Taller Manolo</h6>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Total:</small>
                <span class="fw-bold text-success">150€</span>
              </div>
              <button class="btn btn-sm btn-light w-100 mt-2 text-muted" style="font-size: 0.8rem;">
                Ver detalle
              </button>
            </div>
            <!-- Más pedidos aquí, de forma estática ... -->
          </div>
          <div class="card-footer bg-white border-0 text-center pb-3">
            <a href="#" class="text-decoration-none small fw-bold">Ver todos los pendientes</a>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Otros estilos... */
</style>