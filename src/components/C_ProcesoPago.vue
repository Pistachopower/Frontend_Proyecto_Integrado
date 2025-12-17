<template>
  <div class="container py-5 fade-in">
    
    <div class="row mb-5 justify-content-center">
      <div class="col-12 col-md-8">
        <div class="d-flex justify-content-between position-relative align-items-center">
          <div class="position-absolute w-100 bg-light" style="height: 4px; z-index: 0;"></div>
          <div class="step-item text-center active">
            <div class="step-circle bg-primary text-white fw-bold mx-auto mb-2">1</div>
            <span class="fw-bold small">Envío</span>
          </div>
          <div class="step-item text-center text-muted opacity-50">
            <div class="step-circle bg-light border text-dark fw-bold mx-auto mb-2">2</div>
            <span class="small">Pago</span>
          </div>
          <div class="step-item text-center text-muted opacity-50">
            <div class="step-circle bg-light border text-dark fw-bold mx-auto mb-2">3</div>
            <span class="small">Revisión</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-5">
      
      <div class="col-12 col-lg-7">
        <h4 class="fw-bold mb-4">1. Información de Envío</h4>
        
        <form>
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <h6 class="mb-3 text-muted text-uppercase small fw-bold">Dirección de Entrega</h6>
              
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control bg-light" placeholder="Tu nombre">
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Apellido</label>
                  <input type="text" class="form-control bg-light" placeholder="Tus apellidos">
                </div>

                <div class="col-12">
                  <label class="form-label">Dirección</label>
                  <input type="text" class="form-control bg-light" placeholder="Calle, número, piso...">
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Ciudad</label>
                  <input type="text" class="form-control bg-light">
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Código Postal</label>
                  <input type="text" class="form-control bg-light">
                </div>
              </div>
            </div>
          </div>

          <h4 class="fw-bold mb-3 mt-5">Método de Envío</h4>
          <div class="row g-3 mb-4">
            <div class="col-12 col-md-6">
              <div class="card h-100 cursor-pointer shipping-card border-primary ring-active">
                <div class="card-body p-4">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold mb-0">Envío Estándar</h6>
                    <i class="bi bi-check-circle-fill text-primary fs-5"></i>
                  </div>
                  <p class="text-muted small mb-0">4-5 días laborables</p>
                  <hr class="my-2 border-light">
                  <p class="fw-bold text-primary mb-0">GRATIS</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="card h-100 cursor-pointer shipping-card">
                <div class="card-body p-4">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold mb-0">Envío Express</h6>
                    <i class="bi bi-circle text-muted fs-5"></i>
                  </div>
                  <p class="text-muted small mb-0">24-48 horas</p>
                  <hr class="my-2 border-light">
                  <p class="fw-bold text-primary mb-0">9,99 €</p>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-dark py-3 px-5 fw-bold shadow-hover">
              Continuar Pago <i class="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </form>
      </div>

      <div class="col-12 col-lg-5">
        <div class="card border-0 shadow-sm bg-light sticky-summary">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Resumen de tu cesta</h5>
            
            <div class="cart-items mb-4">
              <div class="d-flex gap-3 mb-3 bg-white p-2 rounded shadow-sm">
                <img src="https://placehold.co/80x80/png?text=Alt" class="rounded bg-light" width="60" height="60" style="object-fit: cover;">
                <div class="flex-grow-1">
                  <h6 class="mb-0 fw-bold small text-truncate">Alternador Bosch 12V</h6>
                  <div class="d-flex justify-content-between align-items-center mt-1">
                    <small class="text-muted">Cant: 1</small>
                    <small class="fw-bold">150,00 €</small>
                  </div>
                </div>
              </div>
              <div class="d-flex gap-3 mb-3 bg-white p-2 rounded shadow-sm">
                <img src="https://placehold.co/80x80/png?text=Bat" class="rounded bg-light" width="60" height="60" style="object-fit: cover;">
                <div class="flex-grow-1">
                  <h6 class="mb-0 fw-bold small text-truncate">Batería 60Ah</h6>
                  <div class="d-flex justify-content-between align-items-center mt-1">
                    <small class="text-muted">Cant: 1</small>
                    <small class="fw-bold">80,00 €</small>
                  </div>
                </div>
              </div>
            </div>

            <hr>

            <div class="d-flex justify-content-between mb-2 small">
              <span class="text-muted">Subtotal</span>
              <span class="fw-bold">230,00 €</span>
            </div>
            <div class="d-flex justify-content-between mb-2 small">
              <span class="text-muted">Envío</span>
              <span class="fw-bold text-success">Gratis</span>
            </div>
            <div class="d-flex justify-content-between mb-3 small">
              <span class="text-muted">Impuestos (est.)</span>
              <span class="fw-bold">48,30 €</span>
            </div>

            <hr>

            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold fs-5">Total</span>
              <span class="fw-bold fs-3 text-primary">278,30 €</span>
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
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.shipping-card {
  transition: all 0.2s;
}
.cursor-pointer {
  cursor: pointer;
}
.shipping-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.ring-active {
  border-color: #0d6efd;
  background-color: #f8fbff;
}

.shadow-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

@media (min-width: 992px) {
  .sticky-summary {
    position: sticky;
    top: 2rem;
  }
}
</style>