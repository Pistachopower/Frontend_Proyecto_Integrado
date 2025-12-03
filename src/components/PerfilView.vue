<script setup>
import { ref, onMounted } from 'vue';

// 1. Creamos la variable "reactiva" para guardar el perfil
const perfil = ref(null);
const error = ref(null);

// 2. onMounted() es el nuevo "mounted()"
onMounted(async () => {
  try {
    // 3. Cogemos la llave correcta (Error 2 corregido)
    const token = localStorage.getItem('access_token');

    if (!token) {
      throw new Error("No estás autenticado. Por favor, inicia sesión.");
    }

    // 4. Hacemos la llamada
    const response = await fetch("http://127.0.0.1:8000/api/v1/mi-perfil/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener el perfil. (Error " + response.status + ")");
    }

    perfil.value = await response.json();
    
  } catch (err) {
    console.error(err);
    error.value = err.message;
  }
});
</script>

<template>
  <div>
    <h1>Mi Perfil</h1>

    <div v-if="perfil">
      <p><strong>Nombre:</strong> {{ perfil.nombre }}</p>
      <p><strong>Apellido:</strong> {{ perfil.apellido }}</p>
      <p><strong>Usuario:</strong> {{ perfil.usuario?.username }}</p>
      <p><strong>Email:</strong> {{ perfil.usuario?.email }}</p>
      <p><strong>Teléfono:</strong> {{ perfil.telefono }}</p>
    </div>

    <div v-else-if="!error">
      <p>Cargando datos...</p>
    </div>

    <div v-if="error" style="color: red;">
      <p>{{ error }}</p>
    </div>
  </div>
</template>