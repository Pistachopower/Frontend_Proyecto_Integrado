<script setup>
import { ref } from 'vue';

// --- ESTADO ---
// Simulamos datos que vendrían de la API
const wishlist = ref([
  {
    id: 1,
    titulo: 'Alternador Bosch 12V',
    descripcion: 'Para modelos Sedán 2018+',
    precio: 150.00,
    stock: true,
    imagen: 'https://placehold.co/100x100/png?text=Alt'
  },
  {
    id: 2,
    titulo: 'Kit de Embrague',
    descripcion: 'Ref: KIT-EMB-99',
    precio: 210.50,
    stock: false, // ¡Agotado!
    imagen: 'https://placehold.co/100x100/png?text=Emb'
  },
  {
    id: 3,
    titulo: 'Faros LED Delanteros',
    descripcion: 'Juego de 2 unidades',
    precio: 89.99,
    stock: true,
    imagen: 'https://placehold.co/100x100/png?text=LED'
  }
]);

// --- FUNCIONES ---
const formatoDinero = (valor) => {
  return valor.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
};

const eliminarItem = (id) => {
  if(confirm("¿Seguro que quieres eliminar este producto de tu lista?")) {
    wishlist.value = wishlist.value.filter(item => item.id !== id);
  }
};

const moverAlCarrito = (item) => {
  if (!item.stock) return;
  alert(`¡${item.titulo} añadido al carrito!`);
  // Aquí llamarías a tu store de Pinia o lógica de carrito
  // Y opcionalmente lo borras de la wishlist:
  // eliminarItem(item.id); 
};

const vaciarLista = () => {
  if(confirm("¿Vaciar toda la lista?")) {
    wishlist.value = [];
  }
};
</script>

<template>
  <div class="container py-5 fade-in">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">Mi Lista de Deseos</h2>
      <button 
        v-if="wishlist.length > 0" 
        class="btn btn-outline-danger btn-sm"
        @click="vaciarLista"
      >
        <i class="bi bi-trash3 me-1"></i> Vaciar lista
      </button>
    </div>

    <div v-if="wishlist.length > 0" class="row g-4">
      
      <div class="col-12 col-lg-10 offset-lg-1">
        <div class="card border-0 shadow-sm overflow-hidden">
          <div class="list-group list-group-flush">
            
            <div 
              v-for="item in wishlist" 
              :key="item.id" 
              class="list-group-item p-4 wishlist-item"
            >
              <div class="row align-items-center g-3">
                
                <div class="col-4 col-md-2">
                  <div class="position-relative">
                    <img :src="item.imagen" class="img-fluid rounded bg-light w-100" :alt="item.titulo">
                    <span v-if="!item.stock" class="position-absolute top-0 start-0 badge bg-danger m-1 shadow-sm">
                      Agotado
                    </span>
                  </div>
                </div>

                <div class="col-8 col-md-5">
                  <h5 class="fw-bold mb-1">
                    <router-link :to="`/producto/${item.id}`" class="text-decoration-none text-dark stretched-link-fix">
                      {{ item.titulo }}
                    </router-link>
                  </h5>
                  <p class="text-muted small mb-2 text-truncate">{{ item.descripcion }}</p>
                  
                  <h5 class="text-primary fw-bold mb-0 d-md-none">
                    {{ formatoDinero(item.precio) }}
                  </h5>
                  
                  <div class="d-none d-md-block mt-2">
                    <small v-if="item.stock" class="text-success fw-bold">
                      <i class="bi bi-check-circle-fill me-1"></i> En Stock
                    </small>
                    <small v-else class="text-danger fw-bold">
                      <i class="bi bi-x-circle-fill me-1"></i> Sin Stock
                    </small>
                  </div>
                </div>

                <div class="col-md-2 d-none d-md-block text-center">
                  <h5 class="text-primary fw-bold mb-0">{{ formatoDinero(item.precio) }}</h5>
                </div>

                <div class="col-12 col-md-3">
                  <div class="d-grid gap-2">
                    <button 
                      class="btn btn-dark btn-sm fw-bold shadow-hover" 
                      :disabled="!item.stock"
                      @click="moverAlCarrito(item)"
                    >
                      <i class="bi bi-cart-plus me-2"></i> Añadir al Carrito
                    </button>
                    <button 
                      class="btn btn-outline-secondary btn-sm border-0 text-muted"
                      @click="eliminarItem(item.id)"
                    >
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

    <div v-else class="text-center py-5 fade-in empty-state">
      <div class="mb-4 text-muted opacity-25">
        <i class="bi bi-heart display-1"></i>
      </div>
      <h3>Tu lista de deseos está vacía</h3>
      <p class="text-muted mb-4">Guarda aquí lo que te guste para comprarlo más tarde.</p>
      <router-link to="/productos" class="btn btn-primary px-5 py-2 fw-bold shadow-sm">
        Explorar Productos
      </router-link>
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

/* Fix para que el router-link no cubra los botones de acción */
.stretched-link-fix {
  position: relative;
  z-index: 1;
}
.wishlist-item:hover .stretched-link-fix {
  color: #0d6efd !important; /* Color primario al pasar el ratón por la tarjeta */
}
</style>