<script setup> 
import { onMounted, ref } from 'vue'; 
import {usePiezasStore} from '@/stores/piezasStore';

const piezasStore = usePiezasStore();
const isEditing = ref(false);
const formData = ref({});

const props = defineProps({
  pieza: {
    type: Number,
    required: true
  }
});

onMounted(async () => { 
    await piezasStore.fetchPiezaDetalle(props.pieza);
    
    // Inicializar formData con los datos de la pieza
    if (piezasStore.piezaSeleccionada) {
      //Crea una copia independiente de los datos de la pieza seleccionada
      formData.value = { ...piezasStore.piezaSeleccionada };
    }
});



// Función para cerrar el modal
const cerrar = () => {
  isEditing.value = false;
  emit('cerrar');
};

const emit = defineEmits(['cerrar']); //emitir un evento llamado 'cerrar'

// Función para entrar en modo editar
const editar = () => {
  isEditing.value = true;
};

// Función para guardar cambios
const guardar = async () => {
  try {
    await piezasStore.actualizarPieza(props.pieza, formData.value);
    isEditing.value = false;

  } catch (error) {
    console.error('❌ Error al guardar:', error);
  }
};


// Función para cancelar la edición
const cancelar = () => {
  formData.value = { ...piezasStore.piezaSeleccionada };
  isEditing.value = false;
};

// Función para manejar la carga de imagen
const handleImageUpload = (event) => {
  const file = event.target.files[0]; //Obtiene el primer archivo seleccionado del input
  
  if (file) {
    // Crear una vista previa de la imagen
    const reader = new FileReader(); //Crea un lector de archivos para convertir el archivo a datos legibles
    
    //Define qué hacer cuando se termine de leer el archivo
    reader.onload = (e) => {
      formData.value.imagenPreview = e.target.result; //Guarda la imagen en formato Base64 para mostrar la vista previa
      formData.value.imagen = file; // Guardar el archivo
    };

    reader.readAsDataURL(file); //Convierte el archivo a una URL de datos (Base64)
  }
};

// Función para obtener el texto del estado
const getEstadoText = (estado) => {
  const estadoMap = {
    1: 'Nuevo',
    2: 'Usado',
    3: 'Reacondicionado'
  };
  return estadoMap[estado] || 'Desconocido';
};

</script>

<template>
  <!-- Modal de Bootstrap -->
  <div class="modal fade show" style="display: block; background-color: rgba(0, 0, 0, 0.5);" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <!-- Header del Modal -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold">{{ isEditing ? 'Editar Producto' : 'Detalles del Producto' }}</h5>
          <button type="button" class="btn-close" @click="cerrar" aria-label="Close"></button>
        </div>

        <!-- Body del Modal -->
        <div class="modal-body">
          <form v-if="piezasStore.piezaSeleccionada">
            <!-- Nombre -->
            <div class="mb-3">
              <label for="nombre" class="form-label fw-bold">Nombre:</label>
              <input 
                v-if="isEditing"
                v-model="formData.nombre" 
                type="text" 
                class="form-control" 
                id="nombre"
              >
              <p v-else class="form-control-plaintext">{{ piezasStore.piezaSeleccionada.nombre }}</p>
            </div>

            <!-- Marca -->
            <div class="mb-3">
              <label for="marca" class="form-label fw-bold">Marca:</label>
              <input 
                v-if="isEditing"
                v-model="formData.marca" 
                type="text" 
                class="form-control" 
                id="marca"
              >
              <p v-else class="form-control-plaintext">{{ piezasStore.piezaSeleccionada.marca }}</p>
            </div>

            <!-- Año -->
            <div class="mb-3">
              <label for="anio" class="form-label fw-bold">Año:</label>
              <input 
                v-if="isEditing"
                v-model="formData.anio" 
                type="text" 
                class="form-control" 
                id="anio"
              >
              <p v-else class="form-control-plaintext">{{ piezasStore.piezaSeleccionada.anio }}</p>
            </div>

            <!-- Precio Base -->
            <div class="mb-3">
              <label for="precio_base" class="form-label fw-bold">Precio Base:</label>
              <input 
                v-if="isEditing"
                v-model="formData.precio_base" 
                type="number" 
                class="form-control" 
                id="precio_base"
                step="0.01"
              >
              <p v-else class="form-control-plaintext">{{ piezasStore.piezaSeleccionada.precio_base }}€</p>
            </div>

            <!-- Descripción -->
            <div class="mb-3">
              <label for="descripcion" class="form-label fw-bold">Descripción:</label>
              <textarea 
                v-if="isEditing"
                v-model="formData.descripcion" 
                class="form-control" 
                id="descripcion"
                rows="3"
              ></textarea>
              <p v-else class="form-control-plaintext">{{ piezasStore.piezaSeleccionada.descripcion }}</p>
            </div>

            <!-- Estado -->
            <div class="mb-3">
              <label for="estado" class="form-label fw-bold">Estado:</label>
              <select 
                v-if="isEditing"
                v-model="formData.estado" 
                class="form-control" 
                id="estado"
              >
                <option value="1">Nuevo</option>
                <option value="2">Usado</option>
                <option value="3">Reacondicionado</option>
              </select>
              <p v-else class="form-control-plaintext">{{ getEstadoText(piezasStore.piezaSeleccionada.estado) }}</p>
            </div>

            <!-- Referencia -->
            <div class="mb-3">
              <label for="referencia" class="form-label fw-bold">Referencia:</label>
              <input 
                v-if="isEditing"
                v-model="formData.referencia" 
                type="text" 
                class="form-control" 
                id="referencia"
              >
              <p v-else class="form-control-plaintext">{{ piezasStore.piezaSeleccionada.referencia }}</p>
            </div>
          
            <!-- Version -->
            <div class="mb-3">
              <label for="version" class="form-label fw-bold">Version:</label>
              <input 
                v-if="isEditing"
                v-model="formData.version" 
                type="text" 
                class="form-control" 
                id="version"
              >
              <p v-else class="form-control-plaintext">{{ piezasStore.piezaSeleccionada.version }}</p>
            </div>

            <!-- Imagen -->
            <div class="mb-3">
              <label for="imagen" class="form-label fw-bold">Imagen:</label>
              <div v-if="isEditing">
                <input 
                  type="file" 
                  class="form-control" 
                  id="imagen"
                  accept="image/*"
                  @change="handleImageUpload"
                >
                <small class="text-muted d-block mt-2">Formatos permitidos: JPG, PNG, GIF, WebP</small>
                <div v-if="formData.imagenPreview" class="mt-3">
                  <img :src="formData.imagenPreview" alt="Vista previa" style="max-width: 200px; border-radius: 4px;">
                </div>
              </div>
              <div v-else>
                <img 
                  :src="piezasStore.piezaSeleccionada.imagen" 
                  alt="Imagen del producto" 
                  style="max-width: 300px; border-radius: 4px;"
                  class="img-fluid"
                >
              </div>
            </div>
          </form>
        </div>

        <!-- Footer del Modal -->
        <div class="modal-footer">
          <!-- Botones en modo Vista -->
          <template v-if="!isEditing">
            <button type="button" class="btn btn-secondary" @click="cerrar">Cerrar</button>
            <button type="button" class="btn btn-primary" @click="editar">Editar</button>
          </template>

          <!-- Botones en modo Edición -->
          <template v-else>
            <button type="button" class="btn btn-secondary" @click="cancelar">Cancelar</button>
            <button type="button" class="btn btn-success" @click="guardar">Guardar</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>