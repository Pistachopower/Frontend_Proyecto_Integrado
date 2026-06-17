<script setup>
import { ref } from 'vue';
import { usePiezasStore } from '@/stores/piezasStore';

const piezasStore = usePiezasStore();
const formData = ref({
  nombre: '',
  marca: '',
  anio: null,
  precio_base: null,
  descripcion: '',
  estado: null,
  referencia: '',
  version: '',
  imagen: null,
  imagenPreview: null
});

const emit = defineEmits(['cerrar']);

// Función para cerrar el modal
const cerrar = () => {
  resetFormulario();
  emit('cerrar');
};

// Función para guardar la nueva pieza
const guardar = async () => {
  try {
    await piezasStore.crearPieza(formData.value);
    cerrar();
    console.log('✅ Producto creado correctamente');
  } catch (error) {
    console.error('❌ Error al crear:', error);
  }
};

// Función para cancelar
const cancelar = () => {
  resetFormulario();
  cerrar();
};

// Limpiar formulario
const resetFormulario = () => {
  formData.value = {
    nombre: '',
    marca: '',
    anio: null,
    precio_base: null,
    descripcion: '',
    estado: null,
    referencia: '',
    version: '',
    imagen: null,
    imagenPreview: null
  };
};

// Función para manejar la carga de imagen
const handleImageUpload = (event) => {
  debugger;
  // 1. Accedemos al primer archivo seleccionado por el usuario en el input
  const file = event.target.files[0]// 

  console.log('Archivo seleccionado:', event.target);

  // Verificamos si efectivamente el usuario seleccionó un archivo
  if (file) {
    // 2. Instanciamos FileReader para poder leer el archivo local del usuario
    const reader = new FileReader();

    // 3. Preparamos el "escuchador". Este código NO se ejecuta de inmediato.
    // Se ejecutará de forma asíncrona SOLO cuando el archivo se haya terminado de leer.
    reader.onload = (e) => {
      // Guardamos la imagen convertida en Base64 para mostrar la vista previa en el HTML
      formData.value.imagenPreview = e.target.result;
      
      // Guardamos el objeto File original por si necesito enviarlo al servidor/API más adelante
      formData.value.imagen = file;
    };

      // 4. Disparamos la lectura del archivo. 
    // Le dice al navegador: "Lee este archivo y conviértelo en una URL de datos (Base64) para poder dibujarlo
    // en la etiqueta imagen".
    // Cuando termine esta acción, se activará automáticamente el método 'reader.onload' de arriba.
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <!-- Modal de Bootstrap -->
  <div class="modal fade show" style="display: block; background-color: rgba(0, 0, 0, 0.5);" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <!-- Header del Modal -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold">Crear Nuevo Producto</h5>
          <button type="button" class="btn-close" @click="cerrar" aria-label="Close"></button>
        </div>

        <!-- Body del Modal -->
        <div class="modal-body">
          <form>
            <!-- Nombre -->
            <div class="mb-3">
              <label for="nombre" class="form-label fw-bold">Nombre:</label>
              <input 
                v-model="formData.nombre" 
                type="text" 
                class="form-control" 
                id="nombre"
                placeholder="Ej: Motor V8"
              >
            </div>

            <!-- Marca -->
            <div class="mb-3">
              <label for="marca" class="form-label fw-bold">Marca:</label>
              <input 
                v-model="formData.marca" 
                type="text" 
                class="form-control" 
                id="marca"
                placeholder="Ej: Toyota"
              >
            </div>

            <!-- Año -->
            <div class="mb-3">
              <label for="anio" class="form-label fw-bold">Año:</label>
              <input 
                v-model="formData.anio" 
                type="number" 
                class="form-control" 
                id="anio"
                placeholder="Ej: 2020"
              >
            </div>

            <!-- Precio Base -->
            <div class="mb-3">
              <label for="precio_base" class="form-label fw-bold">Precio Base (€):</label>
              <input 
                v-model="formData.precio_base" 
                type="number" 
                step="0.01"
                class="form-control" 
                id="precio_base"
                placeholder="Ej: 150.50"
              >
            </div>

            <!-- Descripción -->
            <div class="mb-3">
              <label for="descripcion" class="form-label fw-bold">Descripción:</label>
              <textarea 
                v-model="formData.descripcion"
                class="form-control" 
                id="descripcion"
                rows="3"
                placeholder="Describe tu producto..."
              ></textarea>
            </div>

            <!-- Estado -->
            <div class="mb-3">
              <label for="estado" class="form-label fw-bold">Estado:</label>
              <select 
                v-model="formData.estado" 
                class="form-control" 
                id="estado"
              >
                <option :value="null">-- Selecciona un estado --</option>
                <option value="1">NUEVO</option>
                <option value="2">USADO</option>
                <option value="3">REACONDICIONADO</option>
              </select>
            </div>

            <!-- Referencia -->
            <div class="mb-3">
              <label for="referencia" class="form-label fw-bold">Referencia:</label>
              <input 
                v-model="formData.referencia" 
                type="text" 
                class="form-control" 
                id="referencia"
                placeholder="Ej: REF-2024-001"
              >
            </div>

            <!-- Version -->
            <div class="mb-3">
              <label for="version" class="form-label fw-bold">Versión:</label>
              <input 
                v-model="formData.version" 
                type="text" 
                class="form-control" 
                id="version"
                placeholder="Ej: V1.0"
              >
            </div>

            <!-- Imagen -->
            <div class="mb-3">
              <label for="imagen" class="form-label fw-bold">Imagen:</label>
              <input 
                type="file"
                accept="image/*"
                class="form-control" 
                id="imagen"
                @change="handleImageUpload"
              >
              <div v-if="formData.imagenPreview" class="mt-2">
                <img 
                  :src="formData.imagenPreview" 
                  alt="Vista previa" 
                  class="img-thumbnail"
                  style="max-width: 150px;"
                >
              </div>
            </div>
          </form>
        </div>

        <!-- Footer del Modal -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="cancelar">
            Cancelar
          </button>
          <button type="button" class="btn btn-primary" @click="guardar" :disabled="piezasStore.cargando">
            <span v-if="piezasStore.cargando" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ piezasStore.cargando ? 'Creando...' : 'Crear Producto' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>