<script setup>
import { ref } from 'vue';

// --- ESTADO ---
const email = ref('');
const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);

// --- FUNCIONES ---
const handleRecovery = async () => {
  // 1. Limpiamos mensajes previos
  successMessage.value = null;
  errorMessage.value = null;
  
  // 2. Validación básica
  if (!email.value || !email.value.includes('@')) {
    errorMessage.value = "Por favor, introduce un correo electrónico válido.";
    return;
  }

  // 3. Simulación de envío (O llamada a tu API real)
  loading.value = true;

  try {
    // AQUÍ IRÍA TU FETCH AL BACKEND
    // const res = await fetch('http://localhost:8000/api/password_reset/', ...);
    
    // Simulamos un retardo de red de 1.5 segundos
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Éxito simulado
    successMessage.value = `Hemos enviado un enlace de recuperación a ${email.value}. Por favor, revisa tu bandeja de entrada (y spam).`;
    email.value = ''; // Limpiamos el campo

  } catch (error) {
    errorMessage.value = "Ocurrió un error al intentar enviar el correo. Inténtalo más tarde.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="recovery-container d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
    
    <div class="card border-0 shadow-lg animate-fade-up w-100" style="max-width: 450px;">
      <div class="card-body p-4 p-md-5">
        
        <div class="text-center mb-4">
          <div class="icon-bg mb-3 mx-auto">
            <i class="bi bi-key-fill text-white fs-2"></i>
          </div>
          <h3 class="fw-bold text-dark">¿Olvidaste tu contraseña?</h3>
          <p class="text-muted small">
            No te preocupes. Introduce tu correo electrónico y te enviaremos las instrucciones para restablecerla.
          </p>
        </div>

        <div v-if="successMessage" class="alert alert-success d-flex align-items-start" role="alert">
          <i class="bi bi-check-circle-fill me-2 mt-1"></i>
          <div>{{ successMessage }}</div>
        </div>

        <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{{ errorMessage }}</div>
        </div>

        <form @submit.prevent="handleRecovery" v-if="!successMessage">
          
          <div class="form-floating mb-4">
            <input 
              v-model="email" 
              type="email" 
              class="form-control" 
              id="recoveryEmail" 
              placeholder="name@example.com" 
              required
            >
            <label for="recoveryEmail">Correo Electrónico</label>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-100 py-3 fw-bold shadow-sm button-hover"
            :disabled="loading"
          >
            <span v-if="loading">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Enviando...
            </span>
            <span v-else>
              Recuperar Contraseña
            </span>
          </button>

        </form>

        <div class="text-center mt-4 pt-3 border-top">
          <router-link to="/login" class="text-decoration-none fw-bold text-secondary d-flex justify-content-center align-items-center gap-2 back-link">
            <i class="bi bi-arrow-left"></i> Volver al Inicio de Sesión
          </router-link>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
/* Fondo degradado consistente con Login/Registro */
.recovery-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Círculo del icono */
.icon-bg {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #0d6efd, #0dcaf0); /* Azul Bootstrap */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
}

/* Animación de entrada */
.animate-fade-up {
  animation: fadeUp 0.6s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Efecto Hover en Botón */
.button-hover {
  transition: transform 0.2s;
}
.button-hover:hover:not(:disabled) {
  transform: translateY(-2px);
}

/* Inputs flotantes Focus */
.form-floating > .form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Enlace de Volver */
.back-link {
  transition: color 0.2s;
}
.back-link:hover {
  color: #0d6efd !important; /* Cambia a azul al pasar el ratón */
}
</style>