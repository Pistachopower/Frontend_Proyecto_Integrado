<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore.js';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();

// Helper para determinar si un enlace está activo
const isLinkActive = (path) => route.path === path;

onMounted(() => {
  console.log('Perfil Vendedor:', authStore.perfil);
});
</script>

<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <h1 class="mb-4">Dashboard Vendedor</h1>
    
    <!-- ← CAMBIO: Eliminado v-if porque el guard ya lo valida -->
    <div class="row g-4">
      
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
              <h6 class="fw-bold mb-0">{{ authStore.perfil?.nombre || 'Vendedor' }}</h6>
              <small class="text-muted">Vendedor</small>
            </div>
            
            <div class="list-group list-group-flush text-start">
              <router-link 
                to="/vendedor-dashboard/inicio" 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/vendedor-dashboard/inicio') }"
              >
                <i class="bi bi-speedometer2 me-2"></i> Inicio
              </router-link>

              <router-link 
                to="/vendedor-dashboard/perfil" 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/vendedor-dashboard/perfil') }"
              >
                <i class="bi bi-person-lines-fill me-2"></i> Mi Perfil
              </router-link>

              <router-link 
                to="/vendedor-dashboard/pedidos" 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/vendedor-dashboard/pedidos') }"
              >
                <i class="bi bi-box-seam me-2"></i> Pedidos
              </router-link>

              <router-link 
                to="/vendedor-dashboard/productos" 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/vendedor-dashboard/productos') }"
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