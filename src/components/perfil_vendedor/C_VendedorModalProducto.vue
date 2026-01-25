<script setup> 
import { onMounted } from 'vue'; 
import {usePiezasStore} from '@/stores/piezasStore';

const piezasStore = usePiezasStore();

const props = defineProps({
  pieza: {
    type: Number,
    required: true
  }
});

onMounted(async () => { 
    await piezasStore.fetchPiezaDetalle(props.pieza); 
});

const emit = defineEmits(['cerrar']);

// Función para cerrar el modalss -tulpn | grep :3000ss -tulpn | grep :3000
const cerrar = () => {
  emit('cerrar');
};

</script>

<template>
  <!-- Overlay del modal -->
  <div class="modal-overlay" @click="cerrar" style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  ">
    <!-- Modal -->
    <div class="modal-content" @click.stop style="
      background: white;
      border-radius: 8px;
      padding: 30px;
      width: 90%;
      max-width: 600px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    ">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h4 class="fw-bold mb-0">Detalles del Producto</h4>
        <button @click="cerrar" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        ">
          ×
        </button>
      </div>

      <!-- Contenido -->
      <div v-if="piezasStore.piezaSeleccionada" style="display: grid; gap: 15px;">
        <div>
          <label class="fw-bold">Nombre:</label>
          <p>{{ piezasStore.piezaSeleccionada.nombre }}</p>
        </div>
        <div>
          <label class="fw-bold">Imagen:</label>
          <p>{{ piezasStore.piezaSeleccionada.imagen }}</p>
        </div>
        
        <div>
          <label class="fw-bold">Marca:</label>
          <p>{{ piezasStore.piezaSeleccionada.marca }}</p>
        </div>
        <div>
          <label class="fw-bold">Año:</label>
          <p>{{ piezasStore.piezaSeleccionada.anio }}</p>
        </div>
        <div>
          <label class="fw-bold">Precio Base:</label>
          <p>{{ piezasStore.piezaSeleccionada.precio_base }}€</p>
        </div>
        <div>
          <label class="fw-bold">Descripción:</label>
          <p>{{ piezasStore.piezaSeleccionada.descripcion }}</p>
        </div>
        <div>
          <label class="fw-bold">Referencia:</label>
          <p>{{ piezasStore.piezaSeleccionada.referencia }}</p>
        </div>
        <div>
          <label class="fw-bold">Estado:</label>
          <p>{{ piezasStore.piezaSeleccionada.estado }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
        <button @click="cerrar" class="btn btn-secondary">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<style>
</style>