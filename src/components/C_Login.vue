<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref(null) 

// --- FUNCIÓN PARA LEER LA COOKIE CSRF DE DJANGO ---
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

async function handleLogin() {
  errorMessage.value = null 
  
  try {
    // 1. Obtenemos el token CSRF (Django lo suele poner en la cookie 'csrftoken')
    const csrftoken = getCookie('csrftoken');

    const response = await fetch('http://localhost:8000/api/v1/login/', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken, // <-- IMPORTANTE: Enviamos el token de seguridad
      },
      // 2. ¡ESTO ES VITAL! Le dice al navegador que guarde la cookie que devuelve Django
      credentials: 'include', 
      
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Usuario o contraseña incorrectos.'); // Ajusté para leer 'error'
    }

    await response.json();
    
    // 3. YA NO GUARDAMOS NADA EN LOCALSTORAGE.
    // El navegador ya guardó la cookie solito.

    router.push('/perfil') 
    
  } catch (error) {
    console.error('Error en el login:', error);
    errorMessage.value = error.message;
  }
}
</script>

<template>
  <div>
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Usuario:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>