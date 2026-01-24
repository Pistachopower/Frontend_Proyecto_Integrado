<script setup>
import { onMounted, computed } from 'vue';
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';
import { useRoute } from 'vue-router';

const perfilStore = usePerfilStore();
const route = useRoute();

// Helper para determinar si un enlace está activo
const isLinkActive = (path) => route.path === path;


onMounted(async() => {
    // Inicializamos la carga de los datos del perfil en el Store
  if (!perfilStore.perfil) {
    await perfilStore.fetchPerfil();
  }

});

//console.log('Nombre del vendedor:', perfilStore.perfil.usuario.first_name);
//console.log('Nombre del vendedor:', perfilStore.perfil?.usuario?.first_name);





</script>

<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <h1 class="mb-4">Dashboard Vendedor</h1>
    
    <div v-if="perfilStore.cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Cargando datos del vendedor...</p>
    </div>

    <div v-else-if="perfilStore.error" class="alert alert-danger shadow-sm">
      {{ perfilStore.error }}
    </div>

    <div v-else class="row g-4">
      
      <!-- SIDEBAR -->
      <div class="col-12 col-lg-2">
        <div class="card border-0 shadow-sm h-100 sidebar-card">
          <div class="card-body text-center">
            <div class="mb-4">
              <img 
                src="https://placehold.co/100x100/png?text=V" 
                class="rounded-circle mb-2 border border-3 border-white shadow-sm" 
                width="80"
              >
              <h6 class="fw-bold mb-0">{{ perfilStore.perfil.usuario?.username || ''}}</h6>
              <small class="text-muted">Vendedor</small>
            </div>
            
            <div class="list-group list-group-flush text-start">
              <router-link 
                to="/perfil-vendedor/perfil" 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/perfil-vendedor/perfil') }"
              >
                <i class="bi bi-speedometer2 me-2"></i> Perfil
              </router-link>

              <router-link 
                to="/perfil-vendedor/perfil" 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/perfil-vendedor/perfil') }"
              >
                <i class="bi bi-person-lines-fill me-2"></i> Clientes
              </router-link>

              <router-link 
                to="/perfil-vendedor/pedidos" 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/perfil-vendedor/pedidos') }"
              >
                <i class="bi bi-box-seam me-2"></i> Pedidos
              </router-link>

              <router-link 
                to="/perfil-vendedor/productos" 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/perfil-vendedor/productos') }"
              >
                <i class="bi bi-archive me-2"></i> Productos
              </router-link> 
            </div> 
          </div>
        </div>
      </div>

      <!-- CONTENIDO PRINCIPAL -->
      <div class="col-12 col-lg-10">
        <RouterView />
      </div>
      
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

.sidebar-card {
  position: sticky;
  top: 20px;
}
</style>