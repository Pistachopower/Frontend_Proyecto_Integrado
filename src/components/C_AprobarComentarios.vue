<template>
  <div class="container py-5 fade-in">
    
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
      <div>
        <h2 class="fw-bold mb-1">Moderación de Comentarios</h2>
        <p class="text-muted mb-0">Revisa las opiniones de los usuarios antes de publicarlas.</p>
      </div>

      <div class="bg-light p-1 rounded-pill d-inline-flex border">
        <button class="btn btn-sm rounded-pill px-4 fw-bold transition-all text-muted">
          Pendientes <span class="badge bg-danger ms-1">3</span>
        </button>
        <button class="btn btn-sm rounded-pill px-4 fw-bold transition-all text-muted">
          Historial
        </button>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12">
        
        <div class="card border-0 shadow-sm animate-item">
          <div class="card-body p-4">
            <div class="row align-items-center g-4">
              
              <div class="col-12 col-md-3 border-end-md">
                <div class="d-flex align-items-center mb-3">
                  <img src="https://placehold.co/50x50/png?text=P" class="rounded-circle me-3" width="45" height="45">
                  <div>
                    <h6 class="fw-bold mb-0 text-truncate" style="max-width: 140px;">Pedro Pérez</h6>
                    <small class="text-muted">Cliente verificado</small>
                  </div>
                </div>
                <div class="bg-light p-2 rounded small text-muted">
                  <i class="bi bi-box-seam me-1"></i> Alternador Bosch 12V
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <div class="text-warning small">
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                  </div>
                  <span class="fw-bold">Funciona perfecto</span>
                </div>
                <p class="text-muted mb-0">
                  "La pieza llegó rápido y en buen estado. Mi coche arrancó a la primera."
                </p>
              </div>

              <div class="col-12 col-md-3 text-end">
                <div class="d-flex gap-2 justify-content-end">
                  <button class="btn btn-outline-danger btn-sm px-3 fw-bold action-btn">
                    <i class="bi bi-x-lg d-md-none me-1"></i> Rechazar
                  </button>
                  <button class="btn btn-success btn-sm px-4 fw-bold text-white shadow-sm action-btn">
                    <i class="bi bi-check-lg d-md-none me-1"></i> Aprobar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <!-- Más elementos se pueden repetir aquí -->
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