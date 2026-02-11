<script setup>
import { ref, onMounted } from 'vue'
import { useMetodoPagoStore } from '@/stores/metodoPagoStore.js'
import { useRouter } from 'vue-router'

const pagoStore = useMetodoPagoStore()
const router = useRouter()
const mensaje = ref('Procesando tu pago...')
const exito = ref(false)
const mensajeBackend = ref('')
const pedidoId = ref(null)
const monto = ref(null)
const transactionId = ref(null)

onMounted(async () => {
  // Obtener parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search)
  const payerId = urlParams.get('PayerID')
  const paymentId = urlParams.get('paymentId') || localStorage.getItem('paypal_payment_id')

  if (payerId && paymentId) {
    try {
      const response = await pagoStore.capturarPagoPayPal(paymentId, payerId)
      if (response.success) {
        mensaje.value = '¡Pago realizado con éxito!'
        exito.value = true
        
        // Mostrar el mensaje del backend si existe
        if (response.message) {
          mensajeBackend.value = response.message
        }
        if (response.pedido_id) {
          pedidoId.value = response.pedido_id
        }
        if (response.monto) {
          monto.value = response.monto
        }
        if (response.transaction_id) {
          transactionId.value = response.transaction_id
        }
        localStorage.removeItem('paypal_payment_id')
      } else {
        mensaje.value = response.error || 'No se pudo capturar el pago.'
      }
    } catch (e) {
      mensaje.value = 'Error al capturar el pago.'
    }
  } else {
    mensaje.value = 'Faltan parámetros de PayPal en la URL.'
  }
})
</script>



<template>
  <div class="container py-5 text-center fade-in">
    <div class="card mx-auto shadow-sm p-4" style="max-width: 420px;">
      <div class="mb-3">
        <i v-if="exito" class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
        <i v-else class="bi bi-x-circle-fill text-danger" style="font-size: 4rem;"></i>
      </div>
      <h2 class="fw-bold mb-2">
        <span v-if="exito">¡Pago realizado con éxito!</span>
        <span v-else>{{ mensaje }}</span>
      </h2>
      <div v-if="exito">
        <div v-if="mensajeBackend" class="alert alert-success mt-3">
          {{ mensajeBackend }}
        </div>
        <ul v-if="pedidoId || monto || transactionId" class="list-group mt-3 text-start">
          <li v-if="pedidoId" class="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>ID Pedido:</strong></span>
            <span>{{ pedidoId }}</span>
          </li>
          <li v-if="monto" class="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>Monto:</strong></span>
            <span>{{ monto }} €</span>
          </li>
          <li v-if="transactionId" class="list-group-item d-flex justify-content-between align-items-center">
            <span><strong>ID Transacción:</strong></span>
            <span>{{ transactionId }}</span>
          </li>
        </ul>
        <p class="text-muted mb-4 mt-3">
          Tu compra se ha procesado correctamente.<br>
          Pronto recibirás un correo con los detalles de tu pedido.
        </p>
      </div>
      <div v-else>
        <p class="text-muted mb-4">
          Si tienes dudas, contacta con soporte o vuelve a intentarlo.
        </p>
      </div>
      <router-link to="/" class="btn btn-primary px-4 py-2 fw-bold">
        Volver al inicio
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>