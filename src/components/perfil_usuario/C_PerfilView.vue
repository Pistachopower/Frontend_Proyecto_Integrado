<script setup>
import { onMounted } from 'vue';
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';
import { useRoute } from 'vue-router';

const perfilStore = usePerfilStore();
const route = useRoute(); // Instancia de la ruta actual

// Helper para determinar si un enlace está activo.
const isLinkActive = (path) => route.path === path;

onMounted(() => {
  // Inicializamos la carga de los datos del perfil en el Store
  if (!perfilStore.perfil) {
    perfilStore.fetchPerfil();

  }
});
</script>

<template>
  <div class="container py-4">
    <h1 class="mb-4">Mi Perfil</h1>
    
    <div v-if="perfilStore.cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Cargando datos del usuario...</p>
    </div>
    
    <div v-else-if="perfilStore.error" class="alert alert-danger shadow-sm">{{ perfilStore.error }}</div>

    <div v-else class="row g-4">
      
      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm">
            <div class="list-group list-group-flush">
                
                <router-link 
                    to="/perfil-usuario/datos" 
                    class="list-group-item list-group-item-action border-0 px-4 py-3"
                    :class="{ 'active-link': isLinkActive('/perfil-usuario/datos') }"
                >
                    <i class="bi bi-person-lines-fill me-2"></i> Mis Datos
                </router-link>

                <router-link 
                    to="/perfil-usuario/pedidos" 
                    class="list-group-item list-group-item-action border-0 px-4 py-3"
                    :class="{ 'active-link': isLinkActive('/perfil-usuario/pedidos') }"
                >
                    <i class="bi bi-box-seam me-2"></i> Mis Pedidos
                </router-link>

                <router-link 
                    to="/perfil-usuario/metodos-pago" 
                    class="list-group-item list-group-item-action border-0 px-4 py-3"
                    :class="{ 'active-link': isLinkActive('/perfil-usuario/metodos-pago') }"
                >
                    <i class="bi bi-credit-card-2-front me-2"></i> Métodos de Pago
                </router-link>
                
                <router-link 
                    to="/perfil-usuario/comentarios" 
                    class="list-group-item list-group-item-action border-0 px-4 py-3"
                    :class="{ 'active-link': isLinkActive('/perfil-usuario/comentarios') }"
                >
                    <i class="bi bi-shield-lock me-2"></i> Valoraciones y comentarios
                </router-link>

                <router-link 
                  to="/perfil-usuario/devoluciones" 
                  class="list-group-item list-group-item-action border-0 px-4 py-3"
                  :class="{ 'active-link': isLinkActive('/perfil-usuario/devoluciones') }"
                >
                  <i class="bi bi-arrow-return-left me-2"></i> Mis Devoluciones
                </router-link>

                <router-link 
                  to="/perfil-usuario/lista-deseos" 
                  class="list-group-item list-group-item-action border-0 px-4 py-3"
                  :class="{ 'active-link': isLinkActive('/perfil-usuario/lista-deseos') }"
                >
                  <i class="bi bi-heart me-2"></i> Mi Lista de Deseos
                </router-link>
            </div>
        </div>
      </div>
      
      <div class="col-12 col-lg-8">
        <RouterView /></div>
      
    </div>
  </div>
</template>

<style scoped>
.active-link { 
  background-color: #f8f9fa; 
  font-weight: 600; 
  border-left: 4px solid #0d6efd !important; 
  color: #0d6efd; 
}
.list-group-item {
    color: #495057;
}
</style>