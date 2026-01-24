<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { usePerfilStore } from '@/stores/usuarioPerfilStore'

const authStore = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const usuarioPerfilStore = usePerfilStore()

async function handleLogin() {
  try {
    await authStore.login(username.value, password.value)

  
    await usuarioPerfilStore.fetchPerfil(); // Cargar datos del perfil tras el login exitoso

    // Navegar a la página principal después del login exitoso
    router.push('/')
  } catch (error) {
    // El error ya está en authStore.errorMessage
    console.error('Error al iniciar sesión:', error)
  }
}  



</script>

<template>
  <div class="login-container d-flex align-items-center justify-content-center min-vh-100 bg-light">
    
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          
          <div class="card border-0 shadow-lg animate-fade-up">
            <div class="card-body p-4 p-md-5">
              
              <div class="text-center mb-4">
                <div class="icon-bg mb-3 mx-auto">
                  <i class="bi bi-person-circle text-white fs-1"></i>
                </div>
                <h3 class="fw-bold text-dark">¡Hola de nuevo!</h3>
                <p class="text-muted small">Accede a tu cuenta de MotorPartsExpress</p>
              </div>

              <div v-if="authStore.errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{{ authStore.errorMessage }}</div>
              </div>

              <form @submit.prevent="handleLogin">
                
                <div class="form-floating mb-3">
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username" 
                    placeholder="nombreusuario" 
                    v-model="username" 
                    required
                  >
                  <label for="username"><i class="bi bi-person me-1"></i> Usuario</label>
                </div>

                <div class="form-floating mb-4">
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    placeholder="Contraseña" 
                    v-model="password" 
                    required
                  >
                  <label for="password"><i class="bi bi-lock me-1"></i> Contraseña</label>
                </div>
                
                <button 
                  type="submit" 
                  class="btn btn-primary w-100 py-3 fw-bold shadow-sm button-hover"
                  :disabled="authStore.isLoading"
                >
                  <span v-if="authStore.isLoading">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Entrando...
                  </span>
                  <span v-else>
                    Iniciar Sesión <i class="bi bi-arrow-right ms-2"></i>
                  </span>
                </button>

              </form>
              
              <div class="text-center mt-4 pt-3 border-top">
                <p class="small text-muted mb-0">¿No tienes cuenta?</p>
                <router-link to="/registro" class="text-decoration-none fw-bold text-primary">
                  Regístrate aquí
                </router-link>
              </div>

            </div>
          </div>
          <div class="text-center mt-3">
            <router-link to="/" class="text-muted small text-decoration-none">
              <i class="bi bi-arrow-left"></i> Volver a la tienda
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fondo general */
.login-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Círculo del icono principal */
.icon-bg {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #0d6efd, #0dcaf0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
}

/* Inputs flotantes personalizados */
.form-floating > .form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Animación de entrada suave */
.animate-fade-up {
  animation: fadeUp 0.6s ease-out;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efecto hover en el botón */
.button-hover {
  transition: transform 0.2s;
}
.button-hover:hover:not(:disabled) {
  transform: translateY(-2px);
}
</style>