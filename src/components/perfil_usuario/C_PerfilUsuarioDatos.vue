<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';

const perfilStore = usePerfilStore();
const editando = ref(false);

const formulario = reactive({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  telefono: '',
  direccion: ''
});

// --- NUEVO: FUNCIÓN PARA LLENAR LOS DATOS ---
const sincronizarDatos = () => {
  if (perfilStore.perfil) {
    // Usamos el operador ?. por seguridad, o cadenas vacías si es null
    formulario.username = perfilStore.perfil.usuario?.username || '';
    formulario.email = perfilStore.perfil.usuario?.email || '';
    formulario.first_name = perfilStore.perfil.usuario?.first_name || '';
    formulario.last_name = perfilStore.perfil.usuario?.last_name || '';
    formulario.telefono = perfilStore.perfil.usuario?.telefono || '';
    formulario.direccion = perfilStore.perfil.usuario?.direccion || '';
  }
};

// 1. Intentar llenar al cargar (si los datos ya están ahí)
onMounted(() => {
  sincronizarDatos();
});

// 2. IMPORTANTE: Si los datos tardan en llegar (API lenta),
// este "vigilante" actualizará el formulario en cuanto lleguen.
watch(
  () => perfilStore.perfil, 
  () => {
     if (!editando.value) { // Solo actualizamos si NO estás editando ya
         sincronizarDatos();
     }
  },
  { deep: true, immediate: true }
);

// --- Funciones de Botones ---

const iniciarEdicion = () => {
  editando.value = true;
  // (Ya no hace falta copiar aquí porque el watcher los mantiene al día,
  // pero por seguridad podemos llamar a sincronizarDatos() de nuevo si quieres)
};

const cancelarEdicion = () => {
  editando.value = false;
  // Al cancelar, volvemos a poner los datos originales del store
  sincronizarDatos();
};

const guardarCambios = async () => {
  try {
    // Aquí tu lógica de envío a la API...
    await perfilStore.actualizarPerfil(formulario);
    editando.value = false;
    await perfilStore.fetchPerfil(); // Refrescar datos desde la API
    
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="card border-0 shadow-sm animate-fade">
    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
      <h5 class="mb-0 fw-bold" :class="perfilStore.esEmpleado ? 'text-warning' : 'text-primary'">
        Información Personal
      </h5>
      
      <div>
        <button 
          v-if="!editando" 
          @click="iniciarEdicion" 
          class="btn btn-sm btn-outline-primary shadow-sm"
        >
          <i class="bi bi-pencil me-1"></i> Editar
        </button>

        <div v-else class="d-flex gap-2">
          <button @click="cancelarEdicion" class="btn btn-sm btn-outline-secondary">
            Cancelar
          </button>
          <button @click="guardarCambios" class="btn btn-sm btn-success text-white">
            <i class="bi bi-save me-1"></i> Guardar
          </button>
        </div>
      </div>
    </div>

    <div class="card-body">
      <form class="row g-3">
          <div class="col-md-6">
            <label class="form-label text-muted small text-uppercase">Usuario</label>
            <p class="form-control bg-light mb-0">{{formulario.username}}</p>
          </div>

          <div class="col-md-6">
            <label class="form-label text-muted small text-uppercase">Email</label>
            <input 
              type="email" 
              class="form-control" 
              :class="{'bg-light': !editando}"
              v-model="formulario.email"
              :disabled="!editando"
            >
          </div>
          
          <div class="col-md-6">
            <label class="form-label text-muted small text-uppercase">Nombre</label>
            <input 
              type="text" 
              class="form-control" 
              :class="{'bg-light': !editando}"
              v-model="formulario.first_name"
              :disabled="!editando"
            >
          </div>

          <div class="col-md-6">
            <label class="form-label text-muted small text-uppercase">Apellido</label>
            <input 
              type="text" 
              class="form-control" 
              :class="{'bg-light': !editando}"
              v-model="formulario.last_name"
              :disabled="!editando"
            >
          </div>
          
          <div class="col-12">
             <label class="form-label text-muted small text-uppercase">Teléfono</label>
             <input 
               type="text" 
               class="form-control" 
               :class="{'bg-light': !editando}"
               v-model="formulario.telefono"
               :disabled="!editando"
             >
          </div>

          <div class="col-12" v-if="!perfilStore.esEmpleado">
            <label class="form-label text-muted small text-uppercase">Dirección</label>
            <input 
              type="text" 
              class="form-control" 
              :class="{'bg-light': !editando}"
              v-model="formulario.direccion"
              :disabled="!editando"
            >
          </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Transición suave al cambiar entre estados */
.form-control {
  transition: background-color 0.3s, border-color 0.3s;
}

/* Opcional: Estilo visual cuando está deshabilitado */
.form-control:disabled {
  background-color: #f8f9fa; /* Gris claro */
  opacity: 1; /* Para que el texto se lea bien */
  border-color: transparent; /* Quitar borde cuando es solo lectura */
}

.text-uppercase { font-size: 0.75rem; letter-spacing: 0.5px; }
.animate-fade { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>