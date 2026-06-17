<script setup>
import { ref, onMounted, computed } from 'vue'
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
    const response = await carritoStore.finalizarCompra(
      direccionEnvio.value.trim(),
      metodoPagoSeleccionado.value
    )
    // Compra exitosa, redirigir al home
    router.push({
      name: 'pago-exito',
      query: {
        pedido_id: response.pedido_id,
        total: response.total,
        message: response.message
      }
    })

  } catch (error) {
    if (error.response?.data) {
      errorCompra.value =
        error.response.data.error ||
        error.response.data.detail ||
        error.response.data.message ||
        (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data));
    } else if (error.message) {
      errorCompra.value = error.message;
    } else {
      errorCompra.value = 'Error al procesar la compra. Inténtalo de nuevo.';
    }
  } finally {
    procesandoCompra.value = false;
  }
}

// Computed para saber si el método seleccionado es PayPal

const esPayPalDisponible = computed(() => {

  // Buscar el método seleccionado
  const metodo = metodosPago.value.find(m => m.id === metodoPagoSeleccionado.value)

  // Si no hay método seleccionado, PayPal no está disponible
  if (metodo === undefined || metodo === null) {
    return false
  }
  // Debe ser billetera digital
  const esBilleteraDigital = metodo.tipo_metodo === 3
  // Debe ser proveedor PayPal
  const esProveedorPayPal = metodo.detalles_billetera && metodo.detalles_billetera.proveedor === 1
  // Solo disponible si ambas condiciones se cumplen
  return esBilleteraDigital && esProveedorPayPal
})

/**
 * Inicia el flujo de pago con PayPal
 */
async function pagarConPayPal() {
  // Validar dirección

  if (!direccionEnvio.value.trim()) {
    errorCompra.value = 'Por favor, introduce una dirección de envío.'
    return //Detener ejecución si no hay dirección válida
  }

  errorCompra.value = null
  procesandoCompra.value = true
  try {

    // Crear pedido (finalizarCompra devuelve objeto, extraer pedido_id)
    const responsePedido = await carritoStore.finalizarCompra(
      direccionEnvio.value.trim(),
      metodoPagoSeleccionado.value
    )

    // Extraer el id del pedido según backend
    const pedidoId = responsePedido.pedido_id || responsePedido.id


    const response = await pagoStore.crearOrdenPayPal(pedidoId)

    if (response.success && response.approval_url) {
      // Guardar payment_id en localStorage para usarlo al volver
      localStorage.setItem('paypal_payment_id', response.order_id)

      // Redirigir a PayPal
      window.location.href = response.approval_url
      return
    } else {
      errorCompra.value = response.error || 'Error al crear la orden de PayPal.'
      return
    }
  } catch (error) {
    if (error.response?.data) {
      errorCompra.value =
        error.response.data.error ||
        error.response.data.detail ||
        error.response.data.message ||
        (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data));
    } else if (error.message) {
      errorCompra.value = error.message;
    } else {
      errorCompra.value = 'Error al procesar el pago con PayPal.';
    }
  } finally {
    procesandoCompra.value = false;
  }
}



onMounted(async () => {
  // 1. Asegurar que el perfil del usuario esté cargado
  if (!perfilStore.perfil) {
    await perfilStore.fetchPerfil()
  }

  // 2. Cargar los métodos de pago del usuario
  await pagoStore.fetchMetodos()

  // 3. Capturar parámetros de PayPal al volver
  const urlParams = new URLSearchParams(window.location.search)
  const payerId = urlParams.get('PayerID')
  const paymentId = urlParams.get('paymentId') || localStorage.getItem('paypal_payment_id')

  if (payerId && paymentId) {
    procesandoCompra.value = true
    try {
      const response = await pagoStore.capturarPagoPayPal(paymentId, payerId)

      // Si el pago se capturó correctamente, redirigir a la página de éxito
      if (response.success) {
        // Limpiar el payment_id del localStorage por si el usuario vuelve a esta página sin pasar por PayPal
        localStorage.removeItem('paypal_payment_id')

        router.push({ name: 'pago-exito' })
      } else {
        errorCompra.value = response.error || 'Error al capturar el pago de PayPal.'
      }
    } catch (e) {
      errorCompra.value = 'Error al capturar el pago de PayPal.'
    } finally {
      procesandoCompra.value = false
    }
  }
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
                  <input type="text" class="form-control bg-light" placeholder="Calle, número, piso..."
                    v-model="direccionEnvio" :disabled="procesandoCompra">
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
                <div v-for="metodo in metodosPago" :key="metodo.id"
                  class="payment-option p-3 border rounded cursor-pointer d-flex align-items-center justify-content-between"
                  :class="{ 'ring-active': metodoPagoSeleccionado === metodo.id }"
                  @click="metodoPagoSeleccionado = metodo.id">
                  <div class="d-flex align-items-center gap-3">
                    <input type="radio" name="metodoPago" :value="metodo.id" v-model="metodoPagoSeleccionado"
                      class="form-check-input">
                    <!-- Icono según tipo de método -->
                    <i class="fs-3 text-primary" :class="getIconoMetodo(metodo.tipo_metodo)"></i>
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
            <div class="d-flex flex-column flex-md-row justify-content-end gap-2 mt-3">
              <!-- Botón de pago normal -->
              <button type="submit" class="btn btn-dark py-3 px-5 fw-bold shadow-hover" :disabled="procesandoCompra">
                <span v-if="procesandoCompra">
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Procesando...
                </span>
                <span v-else>
                  Finalizar Compra <i class="bi bi-check-circle ms-2"></i>
                </span>
              </button>

              <!-- Botón de pago con PayPal -->
              <button type="button"
                class="btn btn-outline-primary py-3 px-5 fw-bold shadow-hover d-flex align-items-center justify-content-center"
                :disabled="procesandoCompra || !esPayPalDisponible" @click="pagarConPayPal" style="min-width: 220px;">
                <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal"
                  style="height: 24px; margin-right: 8px;" />
                <span v-if="procesandoCompra">
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Procesando...
                </span>
                <span v-else>
                  Pagar con PayPal
                </span>
              </button>
            </div>
          </div>
        </form>
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
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shipping-card {
  transition: all 0.2s;
}

.cursor-pointer {
  cursor: pointer;
}

.shipping-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

@media (min-width: 992px) {
  .sticky-summary {
    position: sticky;
    top: 2rem;
  }
}
</style>