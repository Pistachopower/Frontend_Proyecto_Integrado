<script setup>
import { ref, onMounted } from 'vue';
import { useMetodoPagoStore } from '@/stores/metodoPagoStore.js'

const pagoStore = useMetodoPagoStore()
const mensaje = ref('');

onMounted(async () => {
    // Obtener parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search)
  const paymentId = urlParams.get('paymentId') || localStorage.getItem('paypal_payment_id')

  if (paymentId) {
    const response= await pagoStore.cancelarPagoPayPal(paymentId)
    mensaje.value = response?.message;
    localStorage.removeItem('paypal_payment_id')
  }
});
</script>




<template>
  <div class="container py-5 text-center fade-in">
    <div class="card mx-auto shadow-sm p-4" style="max-width: 420px;">
      <div class="mb-3">
        <i class="bi bi-x-circle-fill text-danger" style="font-size: 4rem;"></i>
      </div>
      <h2 class="fw-bold mb-2">
        <span>Pago Cancelado con éxito!</span>
      </h2>
      <div>
        <div v-if="mensaje" class="alert alert-danger mt-3">
            {{ mensaje }}
        </div>

        <p class="text-muted mb-4 mt-3">
          Tu compra ha sido cancelada.<br>
          No se ha procesado ningún cargo.
        </p>
      </div>
      <div>
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