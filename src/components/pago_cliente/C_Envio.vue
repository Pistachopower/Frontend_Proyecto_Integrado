<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useMetodoPagoStore } from '@/stores/metodoPagoStore.js'
import { usePerfilStore } from '@/stores/usuarioPerfilStore.js'
import { useCarritoStore } from '@/stores/carritoStore.js'

const router = useRouter()
const pagoStore = useMetodoPagoStore()
const perfilStore = usePerfilStore()
const carritoStore = useCarritoStore()

// ═══════════════════════════════════════════════════════════════════════════
// ESTADO REACTIVO
// ═══════════════════════════════════════════════════════════════════════════

// Datos del store (métodos de pago del usuario y estado de carga)
const { metodos: metodosPago, cargando: cargandoMetodos } = storeToRefs(pagoStore)

// ID del método de pago que el usuario ha seleccionado
const metodoPagoSeleccionado = ref(null)

// Dirección de envío
const direccionEnvio = ref('')

// Estado de procesamiento y errores
const procesandoCompra = ref(false)
const errorCompra = ref(null)

// Nombres legibles para cada tipo de método de pago
const TIPOS_METODO = {
  1: 'Tarjeta de Crédito / Débito',
  2: 'Cuenta Bancaria',
  3: 'Billetera Digital'
}

// Iconos de Bootstrap para cada tipo de método
const ICONOS_METODO = {
  1: 'bi bi-credit-card-2-front',
  2: 'bi bi-bank',
  3: 'bi bi-wallet2'
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════


function getTipoMetodo(tipoMetodo) {
  return TIPOS_METODO[tipoMetodo] || 'Método de pago'
}

function getIconoMetodo(tipoMetodo) {
  return ICONOS_METODO[tipoMetodo] || 'bi bi-credit-card'
}

/**
 * Obtiene una descripción segura del método (datos enmascarados)
 * @param {Object} metodo - Objeto del método de pago
 * @returns {string} Descripción enmascarada (ej: "**** **** **** 1234")
 */
function getDetalleMetodo(metodo) {
  // Tarjeta: mostrar últimos 4 dígitos
  if (metodo.tipo_metodo === 1 && metodo.detalles_tarjeta) {
    const numero = metodo.detalles_tarjeta.num_tarjeta_encriptado || ''
    return `**** **** **** ${numero.slice(-4)}`
  }
  
  // Cuenta bancaria: mostrar últimos 4 dígitos del IBAN
  if (metodo.tipo_metodo === 2 && metodo.detalles_cuenta) {
    const iban = metodo.detalles_cuenta.iban || ''
    return `IBAN: ****${iban.slice(-4)}`
  }
  
  // Billetera digital: mostrar email
  if (metodo.tipo_metodo === 3 && metodo.detalles_billetera) {
    return metodo.detalles_billetera.email || 'Billetera digital'
  }
  
  return 'Método de pago'
}

/**
 * Selecciona automáticamente el mejor método de pago disponible
 * Prioridad: predeterminado > primero de la lista
 */
function seleccionarMetodoPorDefecto() {
  // Buscar el método marcado como predeterminado
  const predeterminado = metodosPago.value.find(m => m.es_predeterminado)
  
  if (predeterminado) {
    metodoPagoSeleccionado.value = predeterminado.id
  } else if (metodosPago.value.length > 0) {
    // Si no hay predeterminado, seleccionar el primero
    metodoPagoSeleccionado.value = metodosPago.value[0].id
  }
}

/**
 * Procesa la compra llamando al endpoint de finalización
 */
async function finalizarCompra() {
  // Validar dirección
  if (!direccionEnvio.value.trim()) {
    errorCompra.value = 'Por favor, introduce una dirección de envío.'
    return
  }
  
  errorCompra.value = null
  procesandoCompra.value = true
  
  try {
    await carritoStore.finalizarCompra(
      direccionEnvio.value.trim(),
      metodoPagoSeleccionado.value
    )
    
    // Compra exitosa, redirigir al home
    router.push({ name: 'Home' })
  } catch (error) {
    // Mostrar mensaje de error
    if (error.response?.data?.error) {
      errorCompra.value = error.response.data.error
    } else if (error.response?.data?.detail) {
      errorCompra.value = error.response.data.detail
    } else if (error.response?.data?.message) {
      errorCompra.value = error.response.data.message
    } else {
      errorCompra.value = 'Error al procesar la compra. Inténtalo de nuevo.'
    }
  } finally {
    procesandoCompra.value = false
  }
}

onMounted(async () => {
  // 1. Asegurar que el perfil del usuario esté cargado
  if (!perfilStore.perfil) {
    await perfilStore.fetchPerfil()
  }
  
  // 2. Cargar los métodos de pago del usuario
  await pagoStore.fetchMetodos()
  
  // 3. Seleccionar un método por defecto
  seleccionarMetodoPorDefecto()
})
</script>

<template>
  <div class="container py-5 fade-in">
    <div class="row g-5">
      
      <div class="col-12 col-lg-7">
        <h4 class="fw-bold mb-4">1. Información de Envío</h4>
        
        <form @submit.prevent="finalizarCompra">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <h6 class="mb-3 text-muted text-uppercase small fw-bold">Dirección de Entrega</h6>
              
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Dirección</label>
                  <input 
                    type="text" 
                    class="form-control bg-light" 
                    placeholder="Calle, número, piso..."
                    v-model="direccionEnvio"
                    :disabled="procesandoCompra"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Sección Método de Pago -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <h6 class="mb-3 text-muted text-uppercase small fw-bold">Método de Pago</h6>
              
              <!-- Estado de carga -->
              <div v-if="cargandoMetodos" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="text-muted mt-2 mb-0">Cargando métodos de pago...</p>
              </div>

              <!-- Sin métodos de pago -->
              <div v-else-if="metodosPago.length === 0" class="text-center py-4">
                <i class="bi bi-credit-card-2-front fs-1 text-muted mb-3"></i>
                <p class="text-muted mb-3">No tienes métodos de pago guardados.</p>
                <router-link to="/perfil-usuario/metodos-pago" class="btn btn-outline-primary btn-sm">
                  <i class="bi bi-plus-circle me-2"></i>Agregar método de pago
                </router-link>
              </div>

              <!-- Lista de métodos de pago del usuario -->
              <div v-else class="d-flex flex-column gap-3">
                <div 
                  v-for="metodo in metodosPago" 
                  :key="metodo.id"
                  class="payment-option p-3 border rounded cursor-pointer d-flex align-items-center justify-content-between"
                  :class="{ 'ring-active': metodoPagoSeleccionado === metodo.id }"
                  @click="metodoPagoSeleccionado = metodo.id"
                >
                  <div class="d-flex align-items-center gap-3">
                    <input 
                      type="radio" 
                      name="metodoPago" 
                      :value="metodo.id" 
                      v-model="metodoPagoSeleccionado"
                      class="form-check-input"
                    >
                    <!-- Icono según tipo de método -->
                    <i 
                      class="fs-3 text-primary"
                      :class="getIconoMetodo(metodo.tipo_metodo)"
                    ></i>
                    <div>
                      <h6 class="fw-bold mb-0">{{ getTipoMetodo(metodo.tipo_metodo) }}</h6>
                      <small class="text-muted">{{ getDetalleMetodo(metodo) }}</small>
                    </div>
                  </div>
                  <span v-if="metodo.es_predeterminado" class="badge bg-success">Predeterminado</span>
                </div>

                <!-- Enlace para agregar más métodos -->
                <div class="text-center mt-2">
                  <router-link to="/perfil-usuario/metodos-pago" class="text-decoration-none small fw-bold">
                    <i class="bi bi-plus-circle me-1"></i>Agregar otro método de pago
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensaje de error -->
          <div v-if="errorCompra" class="alert alert-danger mb-4" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorCompra }}
          </div>

          <div class="d-flex justify-content-end">
            <button 
              type="submit" 
              class="btn btn-dark py-3 px-5 fw-bold shadow-hover"
              :disabled="procesandoCompra"
            >
              <span v-if="procesandoCompra">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Procesando...
              </span>
              <span v-else>
                Finalizar Compra <i class="bi bi-check-circle ms-2"></i>
              </span>
            </button>
          </div>
        </form>
      </div>

      <!-- <div class="col-12 col-lg-5">
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
      </div> -->

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

/* Estilos de las opciones de pago */
.payment-option {
  transition: all 0.2s;
}
.payment-option:hover {
  background-color: #f8f9fa;
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