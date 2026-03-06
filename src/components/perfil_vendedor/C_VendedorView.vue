<script setup>
import { onMounted, computed, ref } from 'vue';
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';
import { useDashboardVendedorStore } from '../../stores/dashboardVendedorStore.js';
import { useRoute } from 'vue-router';

const perfilStore = usePerfilStore();
const dashboardVendedorStore = useDashboardVendedorStore();
const route = useRoute();

const inputFoto = ref(null);

// Helper para determinar si un enlace está activo
const isLinkActive = (path) => route.path === path;

const vendedorId = computed(() => perfilStore.perfil?.vendedor?.id || perfilStore.perfil?.id);

const fotoPerfilUrl = computed(() => {
  // Prioriza la foto de la store de vendedor, luego la del perfil (foto_perfil_vendedor), luego foto_perfil, luego placeholder
  return (
    dashboardVendedorStore.fotoPerfilUrl ||
    perfilStore.perfil?.foto_perfil_vendedor ||
    perfilStore.perfil?.foto_perfil ||
    'https://placehold.co/100x100/png?text=V'
  );
});

async function onFotoSeleccionada(event) {
  const archivo = event.target.files[0];
  if (!archivo || !vendedorId.value) return;
  await dashboardVendedorStore.subirFotoPerfilVendedor(vendedorId.value, archivo);
  // Opcional: recargar perfil si quieres refrescar datos globales
  await perfilStore.fetchPerfil();
}

onMounted(async () => {
  // Inicializamos la carga de los datos del perfil en el Store
  if (!perfilStore.perfil) {
    await perfilStore.fetchPerfil();
  }

});
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

            <div>
              <div class="mb-4 position-relative d-inline-block">
                <img
                  :src="fotoPerfilUrl"
                  alt="Foto de perfil"
                  class="rounded-circle mb-2 border border-3 border-white shadow-sm"
                  width="100"
                  height="100"
                  style="object-fit: cover;"
                >
                <input
                  ref="inputFoto"
                  type="file"
                  accept="image/*"
                  class="d-none"
                  @change="onFotoSeleccionada"
                />
                <button
                  type="button"
                  class="btn btn-light position-absolute top-50 start-50 translate-middle p-2 border border-secondary rounded-circle"
                  style="opacity: 0.8;"
                  @click="inputFoto.click()"
                  title="Cambiar foto de perfil"
                >
                  <i class="bi bi-camera"></i>
                </button>
                <div v-if="dashboardVendedorStore.cargandoFoto" class="position-absolute top-0 start-100 translate-middle">
                  <div class="spinner-border text-primary" style="width: 1.5rem; height: 1.5rem;" role="status"></div>
                </div>
              </div>
              <div v-if="dashboardVendedorStore.mensajeFotoExito" class="alert alert-success py-1 mt-2">
                {{ dashboardVendedorStore.mensajeFotoExito }}
              </div>
              <div v-if="dashboardVendedorStore.mensajeFotoError" class="alert alert-danger py-1 mt-2">
                {{ dashboardVendedorStore.mensajeFotoError }}
              </div>
              <h6 class="fw-bold mb-0">{{ perfilStore.perfil.usuario?.username || '' }}</h6>
              <small class="text-muted">Vendedor</small>
            </div>

            <div class="list-group list-group-flush text-start">
              <router-link to="/perfil-vendedor/inicio"
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/perfil-vendedor/inicio') }">
                <i class="bi bi-speedometer2"></i> Inicio
              </router-link>

              <router-link to="/perfil-vendedor/perfil"
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/perfil-vendedor/perfil') }">
                <i class="bi bi-person-lines-fill me-2"></i> Perfil

              </router-link>

              <router-link to="/perfil-vendedor/clientes"
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/perfil-vendedor/clientes') }">
                <i class="bi bi-people-fill"></i> Clientes

              </router-link>

              <router-link to="/perfil-vendedor/pedidos"
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/perfil-vendedor/pedidos') }">
                <i class="bi bi-box-seam me-2"></i> Pedidos
              </router-link>

              <router-link to="/perfil-vendedor/productos"
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/perfil-vendedor/productos') }">
                <i class="bi bi-archive me-2"></i> Productos
              </router-link>

              <router-link to="/perfil-vendedor/devoluciones"
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/perfil-vendedor/devoluciones') }">
                <i class="bi bi-arrow-return-left me-2"></i> Devoluciones
              </router-link>

              <router-link to="/perfil-vendedor/aprobar-comentarios"
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-link': isLinkActive('/perfil-vendedor/aprobar-comentarios') }">
                <i class="bi bi-chat-left-dots me-2"></i> Aprobar Comentarios
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