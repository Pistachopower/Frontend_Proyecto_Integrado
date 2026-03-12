<script setup>
import { ref } from 'vue';
import { usePiezasStore } from '@/stores/piezasStore';

const piezasStore = usePiezasStore();
const selectedFile = ref(null);

const emit = defineEmits(['cerrar', 'subida-exitosa']);

function onFileChange(e) {
  const file = e.target.files[0];
  if (file && /\.(csv|xlsx|ods)$/i.test(file.name)) {
    selectedFile.value = file;
    piezasStore.clearBulkUploadResult();
  } else {
    selectedFile.value = null;
    piezasStore.bulkUploadError = 'Formato de archivo no permitido.';
  }
}


async function uploadFile() {
  if (selectedFile.value) {
    await piezasStore.bulkUploadArchivo(selectedFile.value);
    // Si fue exitoso y no hay errores, puedes refrescar el catálogo desde el padre
    if (piezasStore.bulkUploadResult && !piezasStore.bulkUploadResult.errores) {
      emit('subida-exitosa');
    }
  }
}

function closeModal() {
  emit('cerrar');
  selectedFile.value = null;
  piezasStore.clearBulkUploadResult();
}
</script>

<template>
  <div class="modal fade show" style="display:block; background:rgba(0,0,0,0.5);" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Subida Masiva de Productos</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <input
            type="file"
            class="form-control"
            accept=".csv,.xlsx,.ods"
            @change="onFileChange"
            :disabled="piezasStore.bulkUploadLoading"
          />
          <small class="text-muted">Formatos permitidos: .csv, .xlsx, .ods</small>

          <!-- Feedback -->
          <div v-if="piezasStore.bulkUploadLoading" class="mt-3">
            <span class="text-info">Subiendo archivo...</span>
          </div>
          <div v-if="piezasStore.bulkUploadResult" class="mt-3">
            <div class="alert alert-success" v-if="!piezasStore.bulkUploadResult.errores">
              {{ piezasStore.bulkUploadResult.detalle }}
            </div>

          </div>
          <div v-if="piezasStore.bulkUploadError" class="alert alert-danger mt-3">
            {{ piezasStore.bulkUploadError }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal" :disabled="piezasStore.bulkUploadLoading">Cerrar</button>
          <button
            class="btn btn-success"
            @click="uploadFile"
            :disabled="!selectedFile || piezasStore.bulkUploadLoading"
          >
            Subir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>