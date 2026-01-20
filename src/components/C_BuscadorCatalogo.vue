<script setup>
import { defineEmits} from 'vue';
import { ref } from 'vue';

const emit= defineEmits(['filtrar']);

//Creamos las variable reactivas
const busqueda = ref('');




//Función para emitir los filtros al componente padre
const actualizarFiltros= () => {


  const filtros = {
    busqueda: busqueda.value.toLowerCase(),
  };

  emit('filtrar', filtros);
}; 
</script>

<template>
  <div class="buscador-container mb-4">
    <div class="row g-3">
      
      <!-- INPUT DE BÚSQUEDA -->
      <div class="col-12">
        <label class="form-label fw-bold text-primary mb-2">
          <i class="bi bi-search me-2"></i>Buscar Pieza
        </label>
        <div class="input-group">
          <span class="input-group-text bg-white">
            <i class="bi bi-search text-primary"></i>
          </span>
          <input 
            v-model="busqueda" 
            @input="actualizarFiltros" 
            type="text" 
            class="form-control" 
            placeholder="Ej: Amortiguador, Filtro de aceite..."
          >
        </div>
      </div>


    </div>
  </div>
</template>

<style scoped></style>