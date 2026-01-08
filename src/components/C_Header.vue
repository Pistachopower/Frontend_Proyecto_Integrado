<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const isOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore()

// Inicializar estado al montar el componente
onMounted(() => {
  authStore.checkAuthStatus()
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

async function handleLogout() {
  try {
    await authStore.logout()
    // Navegar a la página principal después del logout
    router.push('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid px-4">
      <!-- Logo (izquierda) -->
      <router-link to="/" class="navbar-brand fw-bold d-flex align-items-center gap-2">
        <img alt="Logo" style="height: 40px;" />
        <span>MotorPartsExpress</span>
      </router-link>

      <!-- Botón hamburguesa -->
      <button
        class="navbar-toggler"
        type="button"
        @click="toggleMenu"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menú (derecha) -->
      <div :class="['collapse navbar-collapse', { show: isOpen }]" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-2 gap-lg-3">
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="closeMenu">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/catalogo-productos" @click="closeMenu"
              >Productos</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="" @click="closeMenu">Sobre nosotros</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/carrito" @click="closeMenu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 20c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zM7.334 16l.94-2h7.453c.828 0 1.563-.522 1.847-1.303l3.426-8.895A1 1 0 0 0 20 2H5.21l-.94-2H0v2h2l3.6 7.59-1.35 2.44C3.52 13.37 4.48 15 6 15h12v-2H7.334z"
                />
              </svg>
              Carrito
            </router-link>
          </li>
          <li class="nav-item" v-if="authStore.isLoggedIn">
            <button
              @click="handleLogout"
              class="btn btn-danger btn-sm"
              style="margin-left: 10px;"
            >
              Cerrar Sesión
            </button>
          </li>
          <li class="nav-item" v-else>
            <router-link
            to="/login"
            >
            <button
              
              class="btn btn-primary btn-sm"
              style="margin-left: 10px;"
            >
              Iniciar Sesión
            </button>

            </router-link>

          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style>
</style>