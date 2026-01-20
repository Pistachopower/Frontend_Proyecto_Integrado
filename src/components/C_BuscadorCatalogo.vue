<script setup>
import { ref, computed } from 'vue';
import { usePiezasStore } from '@/stores/piezasStore';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['filtrar']);

const piezasStore = usePiezasStore();
const { marcas } = storeToRefs(piezasStore);

// Estado del buscador
const busqueda = ref('');
const marcaSeleccionada = ref('');
const estadoSeleccionado = ref({
  nuevo: false,
  usado: false,
  reacondicionado: false
});
const soloEnStock = ref(false);

// Estados disponibles
const estados = [
  { id: 1, key: 'nuevo', texto: 'Nuevo' },
  { id: 2, key: 'usado', texto: 'Usado' },
  { id: 3, key: 'reacondicionado', texto: 'Reacondicionado' }
];

// Emitir cambios de filtro
const actualizarFiltros = () => {
  const estadosSeleccionados = Object.keys(estadoSeleccionado.value)
    .filter(key => estadoSeleccionado.value[key])
    .map(key => {
      const mapeo = {
        'nuevo': 1,
        'usado': 2,
        'reacondicionado': 3
      };
      return mapeo[key];
    });

  const filtros = {
    busqueda: busqueda.value.trim(),
    marca: marcaSeleccionada.value,
    estado: estadosSeleccionados,
    soloEnStock: soloEnStock.value
  };
  emit('filtrar', filtros);
};

// Limpiar filtros
const limpiarFiltros = () => {
  busqueda.value = '';
  marcaSeleccionada.value = '';
  estadoSeleccionado.value = {
    nuevo: false,
    usado: false,
    reacondicionado: false
  };        
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
          <option value="">Todas las marcas</option>
          <option v-for="marca in marcas" :key="marca" :value="marca">
            {{ marca }}
          </option>
        </select>
      </div>

      <!-- Filtro por estado -->
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-light">
            <span class="text-primary fw-bold">Estado del Producto</span>
          </div>
          <div class="card-body">
            <div class="row">
              <div v-for="estado in estados" :key="estado.id" class="col-12 col-sm-6 col-md-3 mb-2">
                <div class="form-check">
                  <input 
                    v-model="estadoSeleccionado[estado.key]"
                    @change="actualizarFiltros"
                    class="form-check-input" 
                    type="checkbox" 
                    :id="'estado' + estado.id"
                  >
                  <label class="form-check-label" :for="'estado' + estado.id">
                    {{ estado.texto }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
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