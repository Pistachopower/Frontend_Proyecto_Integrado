<script setup>
import { ref, onMounted } from 'vue';

const perfil = ref(null);
const error = ref(null);

onMounted(async () => {
  try {
    // 1. YA NO BUSCAMOS EL TOKEN EN LOCALSTORAGE

    // 2. Hacemos la llamada
    const response = await fetch("http://localhost:8000/api/v1/mi-perfil/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // YA NO ENVIAMOS Authorization: Bearer...
      },
      // 3. ¡ESTO ES LA LLAVE! Envía la cookie de sesión automáticamente
      credentials: 'include' 
    });

    if (response.status === 403) {
        throw new Error("No tienes permiso o tu sesión ha caducado.");
    }
    
    if (!response.ok) {
      throw new Error("Error obteniendo perfil: " + response.status);
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
    <div v-else-if="!error"><p>Cargando datos...</p></div>
    <div v-if="error" style="color: red;"><p>{{ error }}</p></div>
  </div>
</template>