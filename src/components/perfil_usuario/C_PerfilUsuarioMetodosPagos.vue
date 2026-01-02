<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'; // <--- 1. IMPORTANTE: Importa esto
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';
import { useMetodoPagoStore } from '../../stores/metodoPagoStore.js';

const perfilStore = usePerfilStore();
const pagoStore = useMetodoPagoStore();

// --- 2. AQUÍ ESTÁ LA SOLUCIÓN ---
// Extraemos las variables del store manteniendo la reactividad.
// "metodos: metodosPago" significa: "Toma 'metodos' del store pero llámalo 'metodosPago' aquí".
const { metodos: metodosPago, cargando, error } = storeToRefs(pagoStore);

// Variables locales para el formulario (esto se queda igual)
const mostrandoFormulario = ref(false);
const enviando = ref(false); 
const formulario = ref({ tipo_metodo: "", es_predeterminado: false, cliente: perfilStore.id });

onMounted(async () => {
  if (!perfilStore.perfil) {
     await perfilStore.fetchPerfil();
  }
  // Llamamos a la acción (las acciones NO necesitan storeToRefs)
  pagoStore.fetchMetodos();
});

const guardarMetodo = async () => {
  // ... (tu código de guardar sigue igual) ...
  if (!formulario.value.tipo_metodo) return alert("Selecciona un tipo");

  formulario.value.cliente = perfilStore.id;

  const exito = await pagoStore.crearMetodo(formulario.value);

  if (exito) {
    mostrandoFormulario.value = false;
    formulario.value = { tipo_metodo: "", es_predeterminado: false };
    alert("¡Guardado!");
  }
};

// ... (tu función getTipoPago sigue igual) ...
const getTipoPago = (numTipo) => {
    if (!numTipo) return 'Desconocido';
    const diccionario = {
        1: { texto: 'Tarjeta' },
        2: { texto: 'Cuenta Bancaria' },
        3: { texto: 'Billetera Digital' },
    };
    return diccionario[numTipo]?.texto || 'Otro';
};
</script>

<template>
  <div class="container py-4">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Mis Métodos de Pago</h1>
      
      <button 
        class="btn" 
        :class="mostrandoFormulario ? 'btn-secondary' : 'btn-primary'"
        @click="mostrandoFormulario = !mostrandoFormulario">
        {{ mostrandoFormulario ? 'Cancelar' : 'Agregar Nuevo' }}
      </button>
    </div>

    <div v-if="mostrandoFormulario" class="card mb-4 bg-light border-0 shadow-sm">
      <div class="card-body">
        <h5 class="card-title mb-3">Nuevo Método de Pago</h5>
        
        <form @submit.prevent="guardarMetodo">
          
          <div class="mb-3">
            <label class="form-label">Tipo de Método</label>
            <select v-model="formulario.tipo_metodo" class="form-select" required>
              <option value="" disabled>Selecciona una opción...</option>
              <option value="1">Tarjeta de Crédito / Débito</option>
              <option value="2">Cuenta Bancaria</option>
              <option value="3">Billetera Digital</option>
            </select>
          </div>

          <div class="form-check mb-3">
            <input 
              v-model="formulario.es_predeterminado" 
              class="form-check-input" 
              type="checkbox" 
              id="checkPred"
            >
            <label class="form-check-label" for="checkPred">
              Marcar como predeterminado
            </label>
          </div>

          <button type="submit" class="btn btn-success" :disabled="enviando">
            <span v-if="enviando" class="spinner-border spinner-border-sm me-1"></span>
            {{ enviando ? 'Guardando...' : 'Guardar Método' }}
          </button>
        </form>
      </div>
    </div>
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Cargando métodos de pago...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger shadow-sm">
      {{ error }}
    </div>

    <div v-else>
      <div v-if="metodosPago.length === 0" class="alert alert-info">
        No tienes métodos de pago guardados. ¡Agrega uno arriba!
      </div>

      <div v-for="metodo in metodosPago" :key="metodo.id" class="card mb-3 shadow-sm">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 class="card-title fw-bold mb-1">
              {{ getTipoPago(metodo.tipo_metodo) }}
            </h5>
            <small class="text-muted">Agregado el: {{ metodo.fecha_agregado || 'Reciente' }}</small>
          </div>
          
          <span v-if="metodo.es_predeterminado" class="badge bg-success">
            Predeterminado
          </span>
        </div>
      </div>
    </div>
    
  </div>
</template>