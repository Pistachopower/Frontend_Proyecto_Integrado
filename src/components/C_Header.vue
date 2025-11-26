<script setup>

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand fw-bold" href="#">
        <i class="bi bi-shop-window fs-3"></i>
      </a>

      <!-- Botón colapsable -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menú de navegación -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-2 gap-lg-3">

          <!-- Enlaces principales -->
          <li class="nav-item">
           Inicio
          </li>
         

          <!-- Si NO está logueado -->
          <li class="nav-item d-flex align-items-center gap-2">
            <button class="btn btn-outline-light">
              <i class="bi bi-pencil-square"></i> Registrarse
            </button>
            <button class="btn btn-warning">
              <i class="bi bi-key"></i> Iniciar sesión
            </button>

            <!-- Carrito -->
              <i class="bi bi-cart3 fs-4"></i>
              <span
                
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
            
              </span>
          </li>

          <!-- Si está logueado -->
          <li class="nav-item d-flex align-items-center gap-2">
            <!-- Avatar -->
            <img alt="Avatar" class="rounded-circle border border-light"
              style="width: 40px; height: 40px;" />
            <span class="text-white"></span>

            <!-- Botón cerrar sesión -->
            <button class="btn btn-danger">
              <i class="bi bi-box-arrow-right"></i> Cerrar sesión
            </button>

            <!-- Carrito -->
              <i class="bi bi-cart3 fs-4"></i>
              <span
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
          
              </span>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>


<style scoped>
/* Estilo para el avatar */
.rounded-circle {
  border: 2px solid white;
}

.badge {
  font-size: 0.8rem;
}
</style>