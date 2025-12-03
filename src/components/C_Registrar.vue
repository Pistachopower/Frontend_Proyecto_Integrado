<script setup>
import { ref } from 'vue'

// 1. Agregamos los campos de USUARIO (necesarios para el login)
const username = ref('')
const email = ref('')
const password = ref('')

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
  
  // Validaciones de Usuario
  if (!username.value) errors.value.username = 'El usuario es obligatorio.'
  if (!email.value) errors.value.email = 'El email es obligatorio.'
  if (!password.value) errors.value.password = 'La contraseña es obligatoria.'

  // Validaciones de Cliente
  if (!nombre.value) errors.value.nombre = 'Nombre es obligatorio.'
  if (!apellido.value) errors.value.apellido = 'Apellido es obligatorio.'
  if (!telefono.value) errors.value.telefono = 'Teléfono es obligatorio.'
  if (!direccion.value) errors.value.direccion = 'Dirección es obligatoria.'
  if (!fecha_nacimiento.value) errors.value.fecha_nacimiento = 'Fecha de nacimiento es obligatoria.'
  
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  errorMsg.value = null
  success.value = null
  if (!validate()) return

  submitting.value = true

  // 2. CAMBIO CLAVE: Estructura anidada para que coincida con RegistroClienteSerializer
  const payload = {
    user_data: {
      username: username.value,
      email: email.value,
      password: password.value
    },
    cliente_data: {
      nombre: nombre.value,
      apellido: apellido.value,
      telefono: telefono.value,
      direccion: direccion.value,
      fecha_nacimiento: fecha_nacimiento.value,
    }
  }

  try {
    // 3. CAMBIO DE URL: Debe coincidir con tu api_urls.py ('registro_cliente/')
    // Asegúrate de incluir el /v1/ si así lo tienes en el backend
    const res = await fetch('http://127.0.0.1:8000/api/v1/registro_cliente/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      // Intentamos leer el error que manda Django
      const errorData = await res.json()
      throw new Error(JSON.stringify(errorData) || 'Error en la creación de usuario')
    }
    
    const data = await res.json()

    console.log('Usuario creado:', data)
    success.value = '¡Usuario registrado con éxito! Ahora puedes iniciar sesión.'
    
    // Limpiar formulario
    username.value = email.value = password.value = ''
    nombre.value = apellido.value = telefono.value = direccion.value = fecha_nacimiento.value = ''
    
  } catch (err) {
    console.error(err)
    // Mostramos el error de forma un poco más limpia si viene de Django
    errorMsg.value = err.message || 'Error inesperado'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="card p-4">
    <h5 class="mb-3">Registrar Nuevo Cliente</h5>

    <div v-if="success" class="alert alert-success py-2">{{ success }}</div>
    <div v-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>

    <form @submit.prevent="handleSubmit" novalidate>
      
      <h6 class="text-primary mt-2">Datos de Cuenta</h6>
      <hr>
      <div class="mb-3">
        <label class="form-label">Nombre de Usuario (Login)</label>
        <input v-model="username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
        <div class="invalid-feedback">{{ errors.username }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Correo Electrónico</label>
        <input v-model="email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input v-model="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>

      <h6 class="text-primary mt-4">Datos Personales</h6>
      <hr>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Nombre</label>
          <input v-model="nombre" type="text" class="form-control" :class="{ 'is-invalid': errors.nombre }" />
          <div class="invalid-feedback">{{ errors.nombre }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label">Apellido</label>
          <input v-model="apellido" type="text" class="form-control" :class="{ 'is-invalid': errors.apellido }" />
          <div class="invalid-feedback">{{ errors.apellido }}</div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Teléfono</label>
        <input v-model="telefono" type="tel" class="form-control" :class="{ 'is-invalid': errors.telefono }" />
        <div class="invalid-feedback">{{ errors.telefono }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Dirección</label>
        <input v-model="direccion" type="text" class="form-control" :class="{ 'is-invalid': errors.direccion }" />
        <div class="invalid-feedback">{{ errors.direccion }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Fecha de nacimiento</label>
        <input v-model="fecha_nacimiento" type="date" class="form-control" :class="{ 'is-invalid': errors.fecha_nacimiento }" />
        <div class="invalid-feedback">{{ errors.fecha_nacimiento }}</div>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button class="btn btn-primary w-100" type="submit" :disabled="submitting">
          <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Registrarse
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.card { max-width: 680px; margin: 20px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
</style>