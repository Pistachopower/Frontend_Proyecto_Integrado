<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/axiosRequest'

const router = useRouter()

// 1. Campos de USUARIO
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('') // <--- NUEVO CAMPO

// Campos de CLIENTE
const nombre = ref('')
const apellido = ref('')
const telefono = ref('')
const direccion = ref('')
const fecha_nacimiento = ref('')

const submitting = ref(false)
const success = ref(null)
const errorMsg = ref(null)
const errors = ref({})

function validate() {
  errors.value = {}
  
  // Validaciones
  if (!username.value) errors.value.username = 'El usuario es obligatorio.'
  if (!email.value) errors.value.email = 'El email es obligatorio.'
  
  // Validaciones de Contraseña
  if (!password.value) {
    errors.value.password = 'La contraseña es obligatoria.'
  } else if (password.value.length < 8) {
    // Puedes añadir reglas de longitud si quieres
    errors.value.password = 'Mínimo 8 caracteres.' 
  }

  // --- NUEVA VALIDACIÓN: COINCIDENCIA ---
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden.'
  }

  // Validaciones Personales
  if (!nombre.value) errors.value.first_name = 'Nombre requerido.'
  if (!apellido.value) errors.value.last_name = 'Apellido requerido.'
  if (!telefono.value) errors.value.telefono = 'Teléfono requerido.'
  if (!direccion.value) errors.value.direccion = 'Dirección requerida.'
  if (!fecha_nacimiento.value) errors.value.fecha_nacimiento = 'Fecha requerida.'
  
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  errorMsg.value = null
  success.value = null
  
  if (!validate()) return

  submitting.value = true


const payload = {
  user_data: {
    username: username.value,
    email: email.value,
    password: password.value,
    first_name: nombre.value,
    last_name: apellido.value,
    telefono: telefono.value,
    direccion: direccion.value,
    fecha_nacimiento: fecha_nacimiento.value ? new Date(fecha_nacimiento.value).toISOString().split('T')[0] : null,
  }
}

  try {
    await api.post('registro_cliente/', payload)
    
    success.value = '¡Cuenta creada correctamente! Redirigiendo al login...'
    
    // Limpiar todos los campos
    username.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    nombre.value = ''
    apellido.value = ''
    telefono.value = ''
    direccion.value = ''
    fecha_nacimiento.value = ''
    errors.value = {}
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (err) {
    console.error(err)
    
    // Manejo de errores de validación del backend
    if (err.response?.data?.user_data) {
      // Errores de campos dentro de user_data
      Object.assign(errors.value, err.response.data.user_data)
    } else if (err.response?.data?.non_field_errors) {
      // Errores generales de validación
      errorMsg.value = err.response.data.non_field_errors.join(' ')
    } else if (err.response?.data) {
      errorMsg.value = err.response.data.detail || err.response.data.error || 'Error al registrar. Verifica los datos.'
    } else {
      errorMsg.value = 'Hubo un error. Verifica que el usuario o email no existan ya.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="register-container d-flex align-items-center justify-content-center min-vh-100 bg-light py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          
          <div class="card border-0 shadow-lg animate-fade-up">
            <div class="card-body p-4 p-md-5">
              
              <div class="text-center mb-5">
                <h2 class="fw-bold text-primary">Crea tu cuenta</h2>
                <p class="text-muted">Únete a MotorPartsExpress</p>
              </div>

              <div v-if="success" class="alert alert-success d-flex align-items-center mb-4">
                <i class="bi bi-check-circle-fill me-2 fs-4"></i>
                <div>{{ success }}</div>
              </div>

              <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center mb-4">
                <i class="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
                <div>{{ errorMsg }}</div>
              </div>

              <form @submit.prevent="handleSubmit" novalidate>
                
                <div class="bg-light p-3 rounded mb-4 border-start border-4 border-primary">
                  <h5 class="mb-3 text-primary fw-bold"><i class="bi bi-shield-lock me-2"></i>Datos de Acceso</h5>
                  
                  <div class="row g-3">
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="username" type="text" class="form-control" id="user" placeholder="Usuario" :class="{ 'is-invalid': errors.username }">
                        <label for="user">Nombre de Usuario</label>
                        <div class="invalid-feedback">{{ errors.username }}</div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="email" type="email" class="form-control" id="email" placeholder="Email" :class="{ 'is-invalid': errors.email }">
                        <label for="email">Correo Electrónico</label>
                        <div class="invalid-feedback">{{ errors.email }}</div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="password" type="password" class="form-control" id="pass" placeholder="Pass" :class="{ 'is-invalid': errors.password }">
                        <label for="pass">Contraseña</label>
                        <div class="invalid-feedback">{{ errors.password }}</div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-floating">
                        <input 
                          v-model="confirmPassword" 
                          type="password" 
                          class="form-control" 
                          id="confirmPass" 
                          placeholder="Repetir Pass" 
                          :class="{ 'is-invalid': errors.confirmPassword }"
                        >
                        <label for="confirmPass">Repetir Contraseña</label>
                        <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
                      </div>
                    </div>

                  </div>
                </div>

                <div class="bg-light p-3 rounded mb-4 border-start border-4 border-info">
                  <h5 class="mb-3 text-info fw-bold"><i class="bi bi-person-badge me-2"></i>Información Personal</h5>
                  
                  <div class="row g-3">
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="nombre" type="text" class="form-control" id="nombre" placeholder="Nombre" :class="{ 'is-invalid': errors.first_name }">
                        <label for="nombre">Nombre</label>
                        <div class="invalid-feedback">{{ errors.first_name }}</div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="apellido" type="text" class="form-control" id="apellido" placeholder="Apellido" :class="{ 'is-invalid': errors.last_name }">
                        <label for="apellido">Apellido</label>
                        <div class="invalid-feedback">{{ errors.last_name }}</div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="telefono" type="tel" class="form-control" id="tel" placeholder="Tel" :class="{ 'is-invalid': errors.telefono }">
                        <label for="tel">Teléfono</label>
                        <div class="invalid-feedback">{{ errors.telefono }}</div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="fecha_nacimiento" type="date" class="form-control" id="fecha" :class="{ 'is-invalid': errors.fecha_nacimiento }">
                        <label for="fecha">Fecha de Nacimiento</label>
                        <div class="invalid-feedback">{{ errors.fecha_nacimiento }}</div>
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="form-floating">
                        <input v-model="direccion" type="text" class="form-control" id="dir" placeholder="Direccion" :class="{ 'is-invalid': errors.direccion }">
                        <label for="dir">Dirección Completa</label>
                        <div class="invalid-feedback">{{ errors.direccion }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-grid gap-2 mt-4">
                  <button class="btn btn-primary py-3 fw-bold shadow-sm button-hover" type="submit" :disabled="submitting">
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                    <span v-else>Crear mi cuenta <i class="bi bi-arrow-right-circle ms-2"></i></span>
                  </button>
                </div>

                <div class="text-center mt-4">
                  <span class="text-muted">¿Ya tienes cuenta? </span>
                  <router-link to="/login" class="text-decoration-none fw-bold">Inicia Sesión</router-link>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.animate-fade-up {
  animation: fadeUp 0.6s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.button-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}

.button-hover:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3) !important;
}

input[type="date"] {
  min-height: 58px; 
}
</style>