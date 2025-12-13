<script setup>
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';


// 1. Acceder al Store
const perfilStore = usePerfilStore();

</script>

<template>
  <div class="card border-0 shadow-sm animate-fade">
    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
      <h5 class="mb-0 fw-bold" :class="perfilStore.esEmpleado ? 'text-warning' : 'text-primary'">Información Personal</h5>
      <button class="btn btn-sm btn-outline-primary shadow-sm"><i class="bi bi-pencil me-1"></i> Editar</button>
    </div>

    <div class="card-body">
      <form class="row g-3">
          <div class="col-md-6">
            <label class="form-label text-muted small text-uppercase">Usuario</label>
            <input type="text" class="form-control bg-light" :value="perfilStore.perfil?.usuario?.username" readonly>
          </div>
          <div class="col-md-6">
            <label class="form-label text-muted small text-uppercase">Email</label>
            <input type="text" class="form-control bg-light" :value="perfilStore.perfil?.usuario?.email" readonly>
          </div>
          
          <div class="col-md-6">
            <label class="form-label text-muted small text-uppercase">Nombre</label>
            <input type="text" class="form-control bg-light" :value="perfilStore.perfil?.nombre" readonly>
          </div>
          <div class="col-md-6">
            <label class="form-label text-muted small text-uppercase">Apellido</label>
            <input type="text" class="form-control bg-light" :value="perfilStore.perfil?.apellido" readonly>
          </div>
          
          <div class="col-12">
             <label class="form-label text-muted small text-uppercase">Teléfono</label>
             <input type="text" class="form-control bg-light" :value="perfilStore.perfil?.telefono" readonly>
          </div>
          <div class="col-12" v-if="!perfilStore.esEmpleado">
            <label class="form-label text-muted small text-uppercase">Dirección</label>
            <input type="text" class="form-control bg-light" :value="perfilStore.perfil?.direccion" readonly>
          </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-control:read-only { background-color: #f8f9fa; opacity: 1; }
.text-uppercase { font-size: 0.75rem; letter-spacing: 0.5px; }
.animate-fade { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>