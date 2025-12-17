<template>
  <div class="container py-4 fade-in">
    
    <div class="row g-4 mb-5">
      
      <div class="col-12 col-lg-7">
        <div class="card border-0 shadow-sm mb-3 main-image-container">
          <img src="https://placehold.co/600x600/png?text=Imagen+Principal" class="card-img-top img-fluid rounded" alt="Producto Principal">
        </div>
        
        <div class="d-flex gap-2 overflow-auto">
          <div class="thumbnail-box border rounded">
            <img src="https://placehold.co/600x600/e9ecef/495057?text=Vista+Lateral" class="img-fluid rounded" alt="Miniatura">
          </div>
          <div class="thumbnail-box border rounded">
            <img src="https://placehold.co/600x600/e9ecef/495057?text=Conectores" class="img-fluid rounded" alt="Miniatura">
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="ps-lg-4">
          <h1 class="fw-bold mb-2">Alternador Bosch 12V</h1>
          <p class="text-muted mb-3">Alternador de alto rendimiento para modelos sedán 2018-2022.</p>
          <h2 class="text-primary fw-bold mb-4">150.00 €</h2>

          <div class="d-flex align-items-center gap-3 mb-4">
            <div class="input-group" style="width: 130px;">
              <button class="btn btn-outline-secondary" type="button">-</button>
              <input type="text" class="form-control text-center" value="1" readonly>
              <button class="btn btn-outline-secondary" type="button">+</button>
            </div>
            <button class="btn btn-dark flex-grow-1 py-2">
              Añadir al Carrito
            </button>
          </div>

          <div class="row g-2 mb-4">
            <div class="col-6">
              <div class="p-3 border rounded text-center bg-light h-100">
                <i class="bi bi-truck fs-4 text-primary d-block mb-1"></i>
                <small class="fw-bold d-block">Envío Rápido</small>
                <small class="text-muted">24/48 horas</small>
              </div>
            </div>
            <div class="col-6">
              <div class="p-3 border rounded text-center bg-light h-100">
                <i class="bi bi-shield-check fs-4 text-primary d-block mb-1"></i>
                <small class="fw-bold d-block">Garantía</small>
                <small class="text-muted">2 años</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0">
            <ul class="nav nav-tabs card-header-tabs">
              <li class="nav-item">
                <a class="nav-link active">Descripción</a>
              </li>
              <li class="nav-item">
                <a class="nav-link">Envío y Devoluciones</a>
              </li>
            </ul>
          </div>
          <div class="card-body">
            <h5 class="fw-bold">Detalles del producto</h5>
            <p class="text-muted">Este alternador ofrece una carga estable y duradera. Fabricado con materiales de alta calidad, garantiza el funcionamiento óptimo de todos los sistemas eléctricos de su vehículo. Compatible con series X, Y, Z.</p>
            <p class="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-5">
      <h4 class="fw-bold mb-4">Productos Relacionados</h4>
      <div class="row g-3">
        <div class="col-6 col-md-4 col-lg-4">
          <div class="card h-100 border-0 shadow-sm product-card">
            <div class="card-img-top bg-light ratio ratio-4x3">
               <img src="https://placehold.co/400x300?text=Bateria" class="object-fit-cover rounded-top" alt="Batería 60Ah">
            </div>
            <div class="card-body">
              <h6 class="card-title text-truncate">Batería 60Ah</h6>
              <p class="card-text text-primary fw-bold">80.00 €</p>
              <button class="btn btn-sm btn-outline-primary w-100">Ver</button>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-4">
          <div class="card h-100 border-0 shadow-sm product-card">
            <div class="card-img-top bg-light ratio ratio-4x3">
               <img src="https://placehold.co/400x300?text=Correa" class="object-fit-cover rounded-top" alt="Correa Distribución">
            </div>
            <div class="card-body">
              <h6 class="card-title text-truncate">Correa Distribución</h6>
              <p class="card-text text-primary fw-bold">35.50 €</p>
              <button class="btn btn-sm btn-outline-primary w-100">Ver</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-5">
      <h4 class="fw-bold mb-4">Opiniones del producto</h4>
      <div class="card border-0 shadow-sm">
        <div class="list-group list-group-flush">
          <div class="list-group-item p-4">
            <div class="d-flex align-items-center mb-2">
              <img src="https://placehold.co/50x50" class="rounded-circle me-3" width="50" height="50" alt="Avatar">
              <div>
                <h6 class="mb-0 fw-bold">Pedro Pérez</h6>
                <div class="text-warning small">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                </div>
              </div>
            </div>
            <p class="text-muted mb-0 ps-5 ms-3">La pieza está en buen estado y llegó rápido.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

.main-image-container {
  background-color: #f8f9fa;
}

.thumbnail-box {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s, border-color 0.2s;
}

.product-card {
  transition: transform 0.2s;
}
.product-card:hover {
  transform: translateY(-5px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>