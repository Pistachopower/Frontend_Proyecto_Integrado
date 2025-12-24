<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// ... tu código del menú hamburguesa ...
const isOpen = ref(false)
const toggleMenu = () => isOpen.value = !isOpen.value
const closeMenu = () => isOpen.value = false
// ...

const router = useRouter()

// --- FUNCIÓN GET COOKIE (Cópiala aquí también si es necesario, o haz un archivo compartido) ---
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function handleLogout() {
  try {
    const csrftoken = getCookie('csrftoken');

    await fetch('http://localhost:8000/api/v1/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken, // Necesario para POST
      },
      credentials: 'include' // Enviar la cookie para saber A QUIÉN desloguear
    })
    
  } catch (error) {
    console.error("Error al cerrar sesión", error)
  } finally {
    console.log("Sesión cerrada")
    // Ya no hay localStorage que limpiar
    router.push('/login') // O a Home
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="#">
        <img alt="Logo" style="height: 40px;" />
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
            <router-link class="nav-link" to="/catalogo-productos" @click="closeMenu">Productos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="" @click="closeMenu">Sobre nosotros</router-link>
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