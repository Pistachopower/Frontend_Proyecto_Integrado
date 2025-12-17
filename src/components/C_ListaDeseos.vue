<template>
  <div class="container py-5 fade-in">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">Mi Lista de Deseos</h2>
      <button class="btn btn-outline-danger btn-sm">
        <i class="bi bi-trash3 me-1"></i> Vaciar lista
      </button>
    </div>

    <div class="row g-4">
      
      <div class="col-12 col-lg-10 offset-lg-1">
        <div class="card border-0 shadow-sm overflow-hidden">
          <div class="list-group list-group-flush">
            
            <div class="list-group-item p-4 wishlist-item">
              <div class="row align-items-center g-3">
                <div class="col-4 col-md-2">
                  <div class="position-relative">
                    <img src="https://placehold.co/100x100/png?text=Alt" class="img-fluid rounded bg-light w-100" alt="Alternador Bosch 12V">
                    <span class="position-absolute top-0 start-0 badge bg-danger m-1 shadow-sm">
                      Agotado
                    </span>
                  </div>
                </div>
                <div class="col-8 col-md-5">
                  <h5 class="fw-bold mb-1">
                    <span class="text-decoration-none text-dark stretched-link-fix">Alternador Bosch 12V</span>
                  </h5>
                  <p class="text-muted small mb-2 text-truncate">Para modelos Sedán 2018+</p>
                  
                  <h5 class="text-primary fw-bold mb-0 d-md-none">150,00 €</h5>
                  
                  <div class="d-none d-md-block mt-2">
                    <small class="text-success fw-bold">
                      <i class="bi bi-check-circle-fill me-1"></i> En Stock
                    </small>
                  </div>
                </div>
                <div class="col-md-2 d-none d-md-block text-center">
                  <h5 class="text-primary fw-bold mb-0">150,00 €</h5>
                </div>
                <div class="col-12 col-md-3">
                  <div class="d-grid gap-2">
                    <button class="btn btn-dark btn-sm fw-bold shadow-hover" disabled>
                      <i class="bi bi-cart-plus me-2"></i> Añadir al Carrito
                    </button>
                    <button class="btn btn-outline-secondary btn-sm border-0 text-muted">
                      <i class="bi bi-x-lg me-1"></i> Eliminar
                    </button>
                  </div>
                </div>
              </div>
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

/* Efecto Hover en el Item */
.wishlist-item {
  transition: background-color 0.2s;
}
.wishlist-item:hover {
  background-color: #f8f9fa;
}

/* Efecto en botón principal */
.shadow-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}
.shadow-hover:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Fix para que los enlaces no interfieran con los botones */
.stretched-link-fix {
  position: relative;
  z-index: 1;
}
</style>