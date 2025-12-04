<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}


// Logout function
const router = useRouter()

async function handleLogout() {
  try {
    // 1. Recuperamos los tokens antes de borrarlos
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')

    if (refreshToken && accessToken) {
      // 2. Enviamos el refresh token a la lista negra de Django
      // Nota: Asegúrate de poner la ruta correcta (/api/v1/logout/ o la que tengas)
      await fetch('http://127.0.0.1:8000/api/v1/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` // Necesitamos permiso para entrar
        },
        body: JSON.stringify({
          refresh: refreshToken // Este es el dato que espera el backend
        })
      })
    }
  } catch (error) {
    console.error("Error al conectar con el servidor para logout:", error)
    // No importa si falla el servidor, en el frontend DEBEMOS cerrar sesión igual
  } finally {
    // 3. LIMPIEZA LOCAL (Esto se ejecuta SIEMPRE)
    console.log("Limpiando credenciales locales...")
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    
    // 4. Redirigir al login
    router.push('/')
  }
}





</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="#">
        <img :src="logo" alt="Logo" style="height: 40px;" />
        <span>MotorPartsExpress</span>
      </a>

      <!-- Botón hamburguesa -->
      <button class="navbar-toggler" type="button" @click="toggleMenu" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menú colapsable (controlado con Vue) -->
      <div :class="['collapse navbar-collapse', { show: isOpen }]" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-2 gap-lg-3">
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="closeMenu">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/productos" @click="closeMenu">Productos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about" @click="closeMenu">Sobre nosotros</router-link>
          </li>
        </ul>
      </div>


      <!--Logout-->
      <button @click="handleLogout" style="background-color: red; color: white; padding: 10px;">
      Cerrar Sesión
      </button>
    </div>
  </nav>
</template>
<style>
</style>