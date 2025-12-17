<template>
  <div class="container py-5 fade-in">
    
    <h2 class="fw-bold mb-4">Finalizar Compra</h2>

    <div class="row g-4">
      
      <div class="col-12 col-lg-8">
        
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-3">Información de la cuenta</h5>
            <p class="text-muted mb-1">
              <strong>Juan Pérez</strong>
            </p>
            <p class="text-muted mb-1">juan.perez@example.com</p>
            <p class="text-muted mb-0">+34 600 000 000</p>
            <div class="mt-3">
              <a href="#" class="text-decoration-none small fw-bold">Editar información</a>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-3">Información de facturación</h5>
            <div class="bg-light p-3 rounded">
              <p class="mb-1 text-muted">Calle Mayor 123, 2ºB</p>
              <p class="mb-1 text-muted">28001 Madrid</p>
              <p class="mb-0 text-muted">España</p>
            </div>
            <div class="mt-3">
              <a href="#" class="text-decoration-none small fw-bold">Editar dirección</a>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Método de Pago</h5>
            
            <div class="d-flex flex-column gap-3">
              
              <div class="payment-option p-3 border rounded cursor-pointer d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-credit-card-2-front fs-3 text-primary"></i>
                  <div>
                    <h6 class="fw-bold mb-0">Tarjeta de Crédito / Débito</h6>
                    <small class="text-muted">Pago seguro con encriptación SSL</small>
                  </div>
                </div>
              </div>

              <div class="p-3 bg-light rounded">
                <div class="row g-3">
                   <div class="col-12">
                     <label class="form-label small fw-bold">Número de Tarjeta</label>
                     <div class="input-group">
                       <span class="input-group-text bg-white"><i class="bi bi-credit-card"></i></span>
                       <input type="text" class="form-control" placeholder="0000 0000 0000 0000">
                     </div>
                   </div>
                   <div class="col-6">
                     <label class="form-label small fw-bold">Fecha Exp.</label>
                     <input type="text" class="form-control" placeholder="MM/AA">
                   </div>
                   <div class="col-6">
                     <label class="form-label small fw-bold">CVV</label>
                     <input type="text" class="form-control" placeholder="123">
                   </div>
                </div>
              </div>

              <div class="payment-option p-3 border rounded cursor-pointer d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-paypal fs-3 text-primary"></i>
                  <div>
                    <h6 class="fw-bold mb-0">Pagar con PayPal</h6>
                    <small class="text-muted">Serás redirigido a PayPal para completar el pago</small>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm bg-light sticky-summary">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Detalle de Pago</h5>
            
            <p class="text-muted small mb-4">
              Revisa los detalles de tu compra antes de finalizar. Al hacer clic en "Pagar", aceptas nuestros términos y condiciones.
            </p>

            <div class="d-flex justify-content-between mb-2 small">
              <span class="text-muted">Subtotal</span>
              <span class="fw-bold">230,00 €</span>
            </div>
            <div class="d-flex justify-content-between mb-2 small">
              <span class="text-muted">Envío</span>
              <span class="fw-bold">9,99 €</span>
            </div>
            <div class="d-flex justify-content-between mb-4 small">
              <span class="text-muted">Impuestos</span>
              <span class="fw-bold">48,30 €</span>
            </div>
            
            <hr class="border-secondary opacity-25">

            <div class="d-flex justify-content-between align-items-center mb-4">
              <span class="fw-bold fs-5">Total a Pagar</span>
              <span class="fw-bold fs-3 text-primary">288,29 €</span>
            </div>

            <button class="btn btn-dark w-100 py-3 fw-bold shadow-hover">
              Pagar 288,29 € <i class="bi bi-lock-fill ms-2"></i>
            </button>
            
            <div class="text-center mt-3">
               <small class="text-muted d-block"><i class="bi bi-shield-check me-1"></i> Pago 100% Seguro</small>
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

/* Estilos de las opciones de pago */
.payment-option {
  transition: all 0.2s;
}
.payment-option:hover {
  background-color: #f8f9fa;
}
.cursor-pointer {
  cursor: pointer;
}

/* Sticky Summary en Desktop */
@media (min-width: 992px) {
  .sticky-summary {
    position: sticky;
    top: 2rem;
  }
}

/* Botón Hover */
.shadow-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
</style>