<template>
  <div class="container py-5 fade-in">
    <h2 class="fw-bold mb-4">Tu Carrito de Compra</h2>

    <div class="row g-4">
      
      <div class="col-12 col-lg-8">
        <div class="card border-0 shadow-sm mb-3">
          <div class="card-body p-3">
            <div class="row align-items-center g-3">
              
              <div class="col-3 col-md-2">
                <img src="https://placehold.co/100x100/png?text=Alt" class="img-fluid rounded bg-light" alt="Alternador Bosch 12V">
              </div>

              <div class="col-9 col-md-4">
                <h6 class="fw-bold mb-1">Alternador Bosch 12V</h6>
                <small class="text-muted d-block text-truncate">Ref: ALT-2023-X</small>
              </div>

              <div class="col-6 col-md-3 d-flex justify-content-center">
                <div class="input-group input-group-sm" style="max-width: 120px;">
                  <button class="btn btn-outline-secondary">-</button>
                  <input type="text" class="form-control text-center bg-white" value="1" readonly>
                  <button class="btn btn-outline-secondary">+</button>
                </div>
              </div>

              <div class="col-6 col-md-3 d-flex justify-content-between align-items-center">
                <span class="fw-bold text-primary">€150.00</span>
                <button class="btn btn-sm btn-outline-danger border-0 rounded-circle">
                  <i class="bi bi-trash"></i>
                </button>
              </div>

            </div>
          </div>
        </div>

        <div class="mt-4">
          <a href="/productos" class="text-decoration-none text-muted fw-bold">
            <i class="bi bi-arrow-left me-2"></i> Seguir comprando
          </a>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm sticky-summary">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Resumen</h5>
            
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Subtotal</span>
              <span class="fw-bold">€310.00</span>
            </div>
            
            <div class="d-flex justify-content-between mb-3">
              <span class="text-muted">Envío</span>
              <span class="fw-bold">€10.00</span>
            </div>

            <hr class="my-3">

            <div class="d-flex justify-content-between mb-4">
              <span class="fw-bold fs-5">Total</span>
              <span class="fw-bold fs-4 text-primary">€320.00</span>
            </div>

            <button class="btn btn-dark w-100 py-3 fw-bold shadow-hover">
              Pagar Ahora
            </button>
            
            <div class="text-center mt-3 text-muted opacity-50">
              <i class="bi bi-credit-card-2-front fs-5 mx-2"></i>
              <i class="bi bi-paypal fs-5 mx-2"></i>
              <i class="bi bi-shield-lock fs-5 mx-2"></i>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Animación de entrada de la página */
.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Efecto hover en el botón de pagar */
.shadow-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}
.shadow-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Sticky Summary: En pantallas grandes, el resumen se queda fijo al hacer scroll */
@media (min-width: 992px) {
  .sticky-summary {
    position: sticky;
    top: 2rem; /* Ajusta según la altura de tu navbar */
    z-index: 10;
  }
}
</style>