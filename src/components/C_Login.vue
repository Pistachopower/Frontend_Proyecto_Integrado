<script setup>
import { ref } from 'vue'
// 1. ¡IMPORTA EL "MAPA" (ROUTER)!
import { useRouter } from 'vue-router'

// 2. ¡ACTIVA LA HERRAMIENTA DEL "MAPA"!
const router = useRouter()

// --- Tu código existente ---
const username = ref('')
const password = ref('')
const errorMessage = ref(null) 

async function handleLogin() {
  errorMessage.value = null 
  
  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/login/', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Usuario o contraseña incorrectos.');
    }

    const data = await response.json();
    
    console.log("¡Login exitoso!");
    console.log("Access Token:", data.access);
    console.log("Refresh Token:", data.refresh);

    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    // 3. ¡ACTIVA EL "TELETRANSPORTE"! 
    // (Le quitamos las "//" de comentario)
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
      
      <div v-if="errorMessage" style="color: red;">
        {{ errorMessage }}
      </div>
      
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<style scoped>
  div { margin-bottom: 10px; }
  label { margin-right: 10px; }
</style>