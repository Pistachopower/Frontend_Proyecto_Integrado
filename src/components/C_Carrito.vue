<script setup>
import { onMounted, computed } from 'vue'
import { useCarritoStore } from '../stores/carritoStore'


const carritoStore = useCarritoStore()

// Obtener los productos del carrito al montar el componente
onMounted(async () => {
  try {
    await carritoStore.obtenerCarrito()

  } catch (error) {
    console.error('Error al cargar el carrito:', error)
  }
})

// Calcular el total con envío
const calcularTotal = computed(() => {
  return carritoStore.precioTotal + 10 // 10 es el costo del envío
})

// Eliminar producto del carrito
const eliminarDelCarrito = async (pieza_id) => {
  try {
    await carritoStore.eliminarProducto(pieza_id)
  } catch (error) {
    console.error('Error al eliminar producto:', error)
  }
}

// Actualizar cantidad del producto
const actualizarCantidad = async (pieza_id, nuevaCantidad) => {
  try {
    if (nuevaCantidad < 1) return
    await carritoStore.agregarOActualizar(pieza_id, nuevaCantidad)
  } catch (error) {
    console.error('Error al actualizar cantidad:', error)
  }
}
</script>

<template>
  <div class="container py-5 fade-in">
    <h2 class="fw-bold mb-4">Tu Carrito de Compra</h2>

    <div v-if="carritoStore.items.length === 0" class="alert alert-info">
      Tu carrito está vacío. <router-link to="/catalogo-productos">Continúa comprando</router-link>
    </div>

    <div v-else class="row g-4">

      <div class="col-12 col-lg-8">
        <div v-for="item in carritoStore.items" :key="item.id" class="card border-0 shadow-sm mb-3">
          <div class="card-body p-3">
            <div class="row align-items-center g-3">

              <div class="col-3 col-md-2">
                <img :src="item.imagen || 'https://placehold.co/100x100/png?text=Producto'"
                  class="img-fluid rounded bg-light" :alt="item.nombre">
              </div>

              <div class="col-9 col-md-4">
                <h6 class="fw-bold mb-1">{{ item.nombre }}</h6>
                <small class="text-muted d-block text-truncate">Ref: {{ item.id }}</small>
              </div>

              <div class="col-6 col-md-3 d-flex justify-content-center">
                <div class="input-group input-group-sm" style="max-width: 120px;">
                  <button class="btn btn-outline-secondary"
                    @click="actualizarCantidad(item.id, item.cantidad - 1)">-</button>
                  <input type="text" class="form-control text-center bg-white" :value="item.cantidad" readonly disabled>
                  <button class="btn btn-outline-secondary"
                    @click="actualizarCantidad(item.id, item.cantidad + 1)">+</button>
                </div>
              </div>

              <div class="col-6 col-md-3 d-flex justify-content-between align-items-center">
                <span class="fw-bold text-primary">€{{ item.precio_total_piezas.toFixed(2) }}</span>
                <button class="btn btn-sm btn-outline-danger border-0 rounded-circle"
                  @click="eliminarDelCarrito(item.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>

            </div>
          </div>
        </div>

        <div class="mt-4">
          <router-link to="/catalogo-productos" class="text-decoration-none text-muted fw-bold">
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
              <span class="fw-bold">€{{ carritoStore.precioTotal.toFixed(2) }}</span>
            </div>

            <div class="d-flex justify-content-between mb-3">
              <span class="text-muted">Envío</span>
              <span class="fw-bold">€10.00</span>
            </div>

            <hr class="my-3">

            <div class="d-flex justify-content-between mb-4">
              <span class="fw-bold fs-5">Total</span>
              <span class="fw-bold fs-4 text-primary">€{{ calcularTotal.toFixed(2) }}</span>
            </div>

            <router-link
              to="/proceso-pago"
              class="btn btn-dark w-100 py-3 fw-bold shadow-hover"
            >
              Pagar Ahora
            </router-link>

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
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efecto hover en el botón de pagar */
.shadow-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}

.shadow-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Sticky Summary: En pantallas grandes, el resumen se queda fijo al hacer scroll */
@media (min-width: 992px) {
  .sticky-summary {
    position: sticky;
    top: 2rem;
    /* Ajusta según la altura de tu navbar */
    z-index: 10;
  }
}
</style>