<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  piezas: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['filtrar']);

// Estado del buscador
const busqueda = ref('');
const marcaSeleccionada = ref('todas');
const estadoSeleccionado = ref('todos');
const soloEnStock = ref(false);

// Obtener marcas únicas
const marcas = computed(() => {
  const marcasUnicas = [...new Set(props.piezas.map(p => p.marca))];
  return marcasUnicas.sort();
});

// Obtener estados únicos
const estados = [
  { id: 1, texto: 'Nuevo' },
  { id: 2, texto: 'Usado' },
  { id: 3, texto: 'Reacondicionado' }
];

// Emitir cambios de filtro
const actualizarFiltros = () => {
  const filtros = {
    busqueda: busqueda.value.toLowerCase(),
    marca: marcaSeleccionada.value,
    estado: estadoSeleccionado.value,
    soloEnStock: soloEnStock.value
  };
  emit('filtrar', filtros);
};

// Limpiar filtros
const limpiarFiltros = () => {
  busqueda.value = '';
  marcaSeleccionada.value = 'todas';
  estadoSeleccionado.value = 'todos';
  soloEnStock.value = false;
  actualizarFiltros();
};
</script>

<template>
  <div class="buscador-container mb-4">
    <div class="row g-3">
      <!-- Búsqueda por texto -->
      <div class="col-12 col-md-6">
        <div class="input-group">
          <span class="input-group-text bg-white border-primary">
            <i class="bi bi-search text-primary"></i>
          </span>
          <input 
            v-model="busqueda"
            @input="actualizarFiltros"
            type="text" 
            class="form-control border-primary" 
            placeholder="Ej: Amortiguador, Filtro de aceite..."
          >
        </div>
      </div>

      <!-- Filtro por marca -->
      <div class="col-12 col-md-3">
        <select 
          v-model="marcaSeleccionada"
          @change="actualizarFiltros"
          class="form-select border-primary"
        >
          <option value="todas">Todas las marcas</option>
          <option v-for="marca in marcas" :key="marca" :value="marca">
            {{ marca }}
          </option>
        </select>
      </div>

      <!-- Filtro por estado -->
      <div class="col-12 col-md-3">
        <select 
          v-model="estadoSeleccionado"
          @change="actualizarFiltros"
          class="form-select border-primary"
        >
          <option value="todos">Cualquier estado</option>
          <option v-for="estado in estados" :key="estado.id" :value="estado.id">
            {{ estado.texto }}
          </option>
        </select>
      </div>

      <!-- Toggle: Solo en Stock -->
      <div class="col-12">
        <div class="form-check form-switch">
          <input 
            v-model="soloEnStock"
            @change="actualizarFiltros"
            class="form-check-input" 
            type="checkbox" 
            id="soloEnStock"
          >
          <label class="form-check-label" for="soloEnStock">
            <i class="bi bi-check-circle text-success me-2"></i>
            Solo en Stock
          </label>
        </div>
      </div>

      <!-- Botón limpiar -->
      <div class="col-12">
        <button 
          @click="limpiarFiltros"
          class="btn btn-outline-secondary btn-sm"
        >
          <i class="bi bi-arrow-clockwise me-2"></i>Limpiar filtros
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.buscador-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  border-radius: 0.75rem;
  border-left: 4px solid #0d6efd;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}
</style>