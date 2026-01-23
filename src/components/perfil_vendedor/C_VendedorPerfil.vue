<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore.js';

const authStore = useAuthStore();

const editando = ref(false);
const formulario = ref({
  nombre: authStore.perfil?.nombre || '',
  email: authStore.usuario || '',
  telefono: authStore.perfil?.telefono || '',
  direccion: authStore.perfil?.direccion || '',
});

const guardarCambios = () => {
  // Aquí irría la llamada al backend para actualizar datos
  console.log('Datos a guardar:', formulario.value);
  editando.value = false;
};

const cancelarEdicion = () => {
  formulario.value = {
    nombre: authStore.perfil?.nombre || '',
    email: authStore.usuario || '',
    telefono: authStore.perfil?.telefono || '',
    direccion: authStore.perfil?.direccion || '',
  };
  editando.value = false;
};
</script>

<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
      <h5 class="fw-bold mb-0">Mi Perfil</h5>
      <button 
        v-if="!editando"
        @click="editando = true" 
        class="btn btn-sm btn-outline-primary"
      >
        <i class="bi bi-pencil me-1"></i> Editar
      </button>
    </div>

    <div class="card-body">
      <div v-if="!editando" class="row g-3">
        <!-- VISTA DE SOLO LECTURA -->
        <div class="col-12 col-md-6">
          <label class="form-label text-muted small fw-bold text-uppercase">Nombre</label>
          <p class="fs-5 fw-bold">{{ formulario.nombre }}</p>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label text-muted small fw-bold text-uppercase">Email</label>
          <p class="fs-5 fw-bold">{{ formulario.email }}</p>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label text-muted small fw-bold text-uppercase">Teléfono</label>
          <p class="fs-5 fw-bold">{{ formulario.telefono || 'No especificado' }}</p>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label text-muted small fw-bold text-uppercase">Dirección</label>
          <p class="fs-5 fw-bold">{{ formulario.direccion || 'No especificada' }}</p>
        </div>
      </div>

      <div v-else class="row g-3">
        <!-- FORMULARIO DE EDICIÓN -->
        <div class="col-12 col-md-6">
          <label class="form-label fw-bold">Nombre</label>
          <input v-model="formulario.nombre" type="text" class="form-control">
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label fw-bold">Email</label>
          <input v-model="formulario.email" type="email" class="form-control" disabled>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label fw-bold">Teléfono</label>
          <input v-model="formulario.telefono" type="tel" class="form-control">
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label fw-bold">Dirección</label>
          <input v-model="formulario.direccion" type="text" class="form-control">
        </div>

        <!-- BOTONES -->
        <div class="col-12 d-flex gap-2 justify-content-end">
          <button @click="cancelarEdicion" class="btn btn-secondary">
            <i class="bi bi-x-circle me-1"></i> Cancelar
          </button>
          <button @click="guardarCambios" class="btn btn-primary">
            <i class="bi bi-check-circle me-1"></i> Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>