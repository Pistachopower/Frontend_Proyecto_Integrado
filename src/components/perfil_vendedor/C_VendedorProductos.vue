<script setup>
import { onMounted, ref } from 'vue';
import { usePiezasStore } from '@/stores/piezasStore';
import C_VendedorModalProducto from './C_VendedorModalProducto.vue';
import C_VendedorModalCrearProducto from './C_VendedorModalCrearProducto.vue';
import C_VendedorModalBulkUpload from './C_VendedorModalBulkUpload.vue';

const piezasStore = usePiezasStore();
const mostrarModal = ref(false);
const mostrarModalCrear = ref(false);
const piezaSeleccionada = ref(null);
const mostrarModalBulkUpload = ref(false);

//En este componente tomamos los datos del store de piezasStore y lo pintamos
onMounted(async () => {
  await piezasStore.fetchCatalogo();

});

//Creo un enumerado para los estados de las piezas
const estado = {
  1: 'Nuevo',
  2: 'Usado',
  3: 'Reacondicionado'
};

// Función para abrir el modal de crear
const abrirCrear = () => {
  mostrarModalCrear.value = true;
};

// Función para cerrar el modal de crear
const cerrarModalCrear = () => {
  mostrarModalCrear.value = false;
};

// Función para abrir el modal con los detalles de la pieza
const abrirDetalles = (pieza) => {
  piezaSeleccionada.value = pieza;
  console.log('Pieza seleccionada:', pieza.id);
  mostrarModal.value = true;
};

// Función para cerrar el modal
const cerrarModal = () => {
  mostrarModal.value = false;
  piezaSeleccionada.value = null;
};

// Función para eliminar una pieza
const eliminarPieza = async (pieza) => {
  // Confirmación antes de eliminar
  if (confirm(`¿Estás seguro de que deseas eliminar "${pieza.nombre}"?`)) {
    try {
      await piezasStore.eliminarPieza(pieza.id);
      console.log('✅ Producto eliminado correctamente');
    } catch (error) {
      console.error('❌ Error al eliminar:', error);
      alert('Error al eliminar el producto');
    }
  }
};


const onSubidaExitosa = async () => {
  await piezasStore.fetchCatalogo();
};

</script>

<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
      <h5 class="fw-bold mb-0">Mis Productos</h5>
      <button class="btn btn-sm btn-primary" @click="abrirCrear">
        <i class="bi bi-plus-circle me-1"></i> Nuevo Producto
      </button>

      <!-- Botón para abrir el modal de subida masiva -->
    <button class="btn btn-sm btn-outline-primary ms-2" @click="mostrarModalBulkUpload = true">
      <i class="bi bi-upload me-1"></i> Subir piezas
    </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover mb-0">
        <thead class="table-light">
          <tr>
            <th class="border-0">Nombre</th>
            <th class="border-0">Marca</th>
            <th class="border-0">Precio</th>
            <th class="border-0">Año</th>
            <th class="border-0">Estado</th>
            <th class="border-0">Acciones</th>
          </tr>
        </thead>
        <tbody v-if="piezasStore.listado.length > 0">
          <tr v-for="pieza in piezasStore.listado" :key="pieza.id">
            <td class="align-middle fw-bold">{{ pieza.nombre }}</td>
            <td class="align-middle">{{ pieza.marca }}</td>
            <td class="align-middle fw-bold">{{ pieza.precio_base }}€</td>
            <td class="align-middle">{{ pieza.anio }}</td>
            <td class="align-middle">
              <span class="badge" :class="{
                'bg-success': pieza.estado === 1,
                'bg-secondary': pieza.estado === 2,
                'bg-info': pieza.estado === 3
              }">
                {{ estado[pieza.estado] }}
              </span>
            </td>
            <td class="align-middle">
              <button class="btn btn-sm btn-outline-primary" title="Ver detalles" @click="abrirDetalles(pieza)">
                <i class="bi bi-pencil"></i>
              </button>

              <button class="btn btn-sm btn-outline-danger ms-1" title="Eliminar" @click="eliminarPieza(pieza)"
                :disabled="piezasStore.cargando">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-center py-5 text-muted" v-if="piezasStore.listado.length === 0">
      <i class="bi bi-box-seam fs-1 mb-3 d-block"></i>
      <p>No tienes productos registrados</p>
    </div>
  </div>

  <!-- Modal de detalles -->
  <C_VendedorModalProducto v-if="mostrarModal" :pieza="piezaSeleccionada.id" @cerrar="cerrarModal" />

  <!-- Modal de crear -->
  <C_VendedorModalCrearProducto v-if="mostrarModalCrear" @cerrar="cerrarModalCrear" />

  <C_VendedorModalBulkUpload v-if="mostrarModalBulkUpload" @cerrar="mostrarModalBulkUpload = false"   @subida-exitosa="onSubidaExitosa"

/>
</template>
