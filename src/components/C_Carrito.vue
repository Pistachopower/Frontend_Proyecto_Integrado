<script setup>
import { ref, computed } from 'vue';

// --- DATOS SIMULADOS (ESTADO) ---
const carrito = ref([
  {
    id: 1,
    titulo: 'Alternador Bosch 12V',
    descripcion: 'Ref: ALT-2023-X',
    precio: 150.00,
    cantidad: 1,
    imagen: 'https://placehold.co/100x100/png?text=Alt'
  },
  {
    id: 2,
    titulo: 'Batería 60Ah',
    descripcion: 'Ref: BAT-60-YU',
    precio: 80.00,
    cantidad: 2,
    imagen: 'https://placehold.co/100x100/png?text=Bat'
  },
  {
    id: 3,
    titulo: 'Filtro de Aceite',
    descripcion: 'Ref: FIL-OIL-99',
    precio: 12.50,
    cantidad: 1,
    imagen: 'https://placehold.co/100x100/png?text=Filt'
  }
]);

// --- CÁLCULOS AUTOMÁTICOS (COMPUTED) ---
const subtotal = computed(() => {
  return carrito.value.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
});

const costoEnvio = computed(() => {
  // Ejemplo: Envío gratis si supera 200€, sino 10€
  if (subtotal.value > 200) return 0;
  return 10.00;
});

const total = computed(() => subtotal.value + costoEnvio.value);

// --- FUNCIONES ---
const incrementar = (id) => {
  const item = carrito.value.find(i => i.id === id);
  if (item) item.cantidad++;
};

const decrementar = (id) => {
  const item = carrito.value.find(i => i.id === id);
  if (item && item.cantidad > 1) item.cantidad--;
};

const eliminar = (id) => {
  // Filtramos el array para quitar el item
  carrito.value = carrito.value.filter(i => i.id !== id);
};

const formatoDinero = (valor) => {
  return valor.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
};

const procesarPago = () => {
  alert(`Procesando pago por ${formatoDinero(total.value)}`);
};
</script>

<template>
  <div class="container py-5 fade-in">
    <h2 class="fw-bold mb-4">Tu Carrito de Compra</h2>

    <div v-if="carrito.length > 0" class="row g-4">
      
      <div class="col-12 col-lg-8">
        
        <transition-group name="list" tag="div">
          <div v-for="item in carrito" :key="item.id" class="card border-0 shadow-sm mb-3">
            <div class="card-body p-3">
              <div class="row align-items-center g-3">
                
                <div class="col-3 col-md-2">
                  <img :src="item.imagen" class="img-fluid rounded bg-light" :alt="item.titulo">
                </div>

                <div class="col-9 col-md-4">
                  <h6 class="fw-bold mb-1">{{ item.titulo }}</h6>
                  <small class="text-muted d-block text-truncate">{{ item.descripcion }}</small>
                </div>

                <div class="col-6 col-md-3 d-flex justify-content-center">
                  <div class="input-group input-group-sm" style="max-width: 120px;">
                    <button class="btn btn-outline-secondary" @click="decrementar(item.id)">-</button>
                    <input type="text" class="form-control text-center bg-white" :value="item.cantidad" readonly>
                    <button class="btn btn-outline-secondary" @click="incrementar(item.id)">+</button>
                  </div>
                </div>

                <div class="col-6 col-md-3 d-flex justify-content-between align-items-center">
                  <span class="fw-bold text-primary">{{ formatoDinero(item.precio * item.cantidad) }}</span>
                  <button class="btn btn-sm btn-outline-danger border-0 rounded-circle" @click="eliminar(item.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </transition-group>

        <div class="mt-4">
          <router-link to="/productos" class="text-decoration-none text-muted fw-bold">
            <i class="bi bi-arrow-left me-2"></i> Seguir comprando
          </router-link>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm sticky-summary">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Resumen</h5>
            
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Subtotal</span>
              <span class="fw-bold">{{ formatoDinero(subtotal) }}</span>
            </div>
            
            <div class="d-flex justify-content-between mb-3">
              <span class="text-muted">Envío</span>
              <span v-if="costoEnvio === 0" class="text-success fw-bold">Gratis</span>
              <span v-else class="fw-bold">{{ formatoDinero(costoEnvio) }}</span>
            </div>

            <hr class="my-3">

            <div class="d-flex justify-content-between mb-4">
              <span class="fw-bold fs-5">Total</span>
              <span class="fw-bold fs-4 text-primary">{{ formatoDinero(total) }}</span>
            </div>

            <button class="btn btn-dark w-100 py-3 fw-bold shadow-hover" @click="procesarPago">
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

    <div v-else class="text-center py-5 fade-in">
      <div class="mb-4 text-muted opacity-25">
        <i class="bi bi-cart-x display-1"></i>
      </div>
      <h3>Tu carrito está vacío</h3>
      <p class="text-muted mb-4">Parece que aún no has añadido ninguna pieza.</p>
      <router-link to="/productos" class="btn btn-primary px-5 py-2">
        Ir al Catálogo
      </router-link>
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

/* Animación al eliminar un ítem de la lista (transition-group) */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
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