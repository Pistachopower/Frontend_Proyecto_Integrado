<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const menuAbierto = ref(false)
const desplegableAbierto = ref(false) // Variable para controlar el desplegable
const router = useRouter()
const authStore = useAuthStore()

// Inicializar estado al montar el componente
onMounted(async () => {
  await authStore.checkAuthStatus()
  console.log('✅ Estado de auth verificado:', authStore.isLoggedIn)
  console.log('👤 Usuario:', authStore.user)
})

const alternarMenu = () => {
  menuAbierto.value = !menuAbierto.value
}

const cerrarMenu = () => {
  menuAbierto.value = false
}

// Función para abrir/cerrar el desplegable
const alternarDesplegable = () => {
  desplegableAbierto.value = !desplegableAbierto.value
}

// Función para cerrar el desplegable
const cerrarDesplegable = () => {
  desplegableAbierto.value = false
}

// Ir al perfil y cerrar el menú
const irAlPerfil = () => {
  cerrarDesplegable()
  cerrarMenu()

  // Obtener el tipo de usuario del authStore
  const tipoUsuario = authStore.user?.tipo_usuario
  console.log('Tipo de usuario:', tipoUsuario) // 
  console.log('Usuario completo:', authStore.user) 


  if (tipoUsuario === 'cliente') {
    router.push('/perfil-usuario')

  } else if (tipoUsuario === 'vendedor') {
    router.push('/perfil-vendedor')

  } else { //PENDIENTE POR IMPLEMENTAR PARA ADMINISTRADOR
    router.push('/') // Redirigir a inicio si no es reconocido
  }


}

async function cerrarSesion() {
  try {
    cerrarDesplegable() // Cerrar el desplegable al hacer logout
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
          <img src="@/assets/logo.png" alt="MotorPartsExpress Logo" style="height: 40px;" />
      </router-link>

      <!-- Botón hamburguesa -->
      <button
        class="navbar-toggler"
        type="button"
        @click="alternarMenu"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menú (derecha) -->
      <div :class="['collapse navbar-collapse', { show: menuAbierto }]" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-2 gap-lg-3">
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="cerrarMenu">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/catalogo-productos" @click="cerrarMenu"
              >Productos</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="" @click="cerrarMenu">Sobre nosotros</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/carrito" @click="cerrarMenu">
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
              
            </router-link>
          </li>
          <li class="nav-item" v-if="authStore.isLoggedIn">
            <!-- DROPDOWN (Menú desplegable) - Mobile First -->
            <div class="dropdown-usuario">
              <!-- Botón que abre el menú -->
              <button 
                @click="alternarDesplegable" 
                class="btn-mi-cuenta"
              >
                👤 Mi Cuenta
                <span class="flecha" :class="{ 'flecha-arriba': desplegableAbierto }">▼</span>
              </button>
              
              <!-- Las opciones del menú (solo se muestran si desplegableAbierto es true) -->
              <div 
                v-if="desplegableAbierto" 
                class="dropdown-menu-usuario"
              >
                <!-- Opción: Ir al Perfil -->
                <button @click="irAlPerfil" class="dropdown-item-usuario">
                  📋 Perfil
                </button>
                
                <!-- Línea separadora -->
                <hr class="dropdown-separador">
                
                <!-- Opción: Cerrar Sesión -->
                <button @click="cerrarSesion" class="dropdown-item-usuario item-peligro">
                  🚪 Cerrar Sesión
                </button>
              </div>
            </div>
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

<style scoped>
/* ========================================
   MOBILE FIRST - Estilos base para móvil
   ======================================== */

/* Contenedor del dropdown */
.dropdown-usuario {
  position: relative;
  width: 100%;
  margin-top: 0.5rem;
}

/* Botón "Mi Cuenta" */
.btn-mi-cuenta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-mi-cuenta:hover {
  background-color: #5a6268;
}

/* Flecha del botón */
.flecha {
  font-size: 0.75rem;
  margin-left: 0.5rem;
  transition: transform 0.2s ease;
}

.flecha-arriba {
  transform: rotate(180deg);
}

/* Menú desplegable */
.dropdown-menu-usuario {
  width: 100%;
  margin-top: 0.25rem;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
}

/* Cada opción del menú */
.dropdown-item-usuario {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  font-size: 1rem;
  color: #212529;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.dropdown-item-usuario:hover {
  background-color: #f8f9fa;
}

/* Opción de peligro (cerrar sesión) */
.item-peligro {
  color: #dc3545;
}

.item-peligro:hover {
  background-color: #f8d7da;
}

/* Línea separadora */
.dropdown-separador {
  margin: 0;
  border: none;
  border-top: 1px solid #dee2e6;
}

/* ========================================
   TABLET Y DESKTOP - Media queries
   ======================================== */

/* Pantallas medianas (≥768px) */
@media (min-width: 768px) {
  .dropdown-usuario {
    width: auto;
    margin-top: 0;
  }

  .btn-mi-cuenta {
    width: auto;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .dropdown-menu-usuario {
    position: absolute;
    right: 0;
    top: 100%;
    width: auto;
    min-width: 160px;
  }

  .dropdown-item-usuario {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}

/* Pantallas grandes (≥992px) */
@media (min-width: 992px) {
  .dropdown-usuario {
    margin-left: 0.5rem;
  }

  .btn-mi-cuenta {
    padding: 0.5rem 1.25rem;
  }

  .dropdown-menu-usuario {
    min-width: 180px;
  }
}
</style>