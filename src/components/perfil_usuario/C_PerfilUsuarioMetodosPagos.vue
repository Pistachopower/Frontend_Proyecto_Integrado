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

const formulario = ref({
  tipo_metodo: "",
  es_predeterminado: false,
  // Detalles para cada tipo
  detalles_tarjeta: {
    tipo_tarjeta: null,
    num_tarjeta_encriptado: "",
    propietario: "",
    fecha_caducidad: "",
    moneda: ""
  },
  detalles_cuenta: {
    iban: "",
    banco: "",
    moneda: ""
  },
  detalles_billetera: {
    proveedor: null,
    email: ""
  }
});

onMounted(async () => {
  if (!perfilStore.perfil) {
     await perfilStore.fetchPerfil();
  }
  // Llamamos a la acción (las acciones NO necesitan storeToRefs)
  pagoStore.fetchMetodos();
});

const guardarMetodo = async () => {
  if (!formulario.value.tipo_metodo) return alert("Selecciona un tipo");

  // Construir el objeto base
  const payload = {
    tipo_metodo: parseInt(formulario.value.tipo_metodo),
    es_predeterminado: formulario.value.es_predeterminado || false
  };

  // Según el tipo, incluir solo los detalles necesarios
  if (payload.tipo_metodo === 1) {
    payload.detalles_tarjeta = { ...formulario.value.detalles_tarjeta };
  } else if (payload.tipo_metodo === 2) {
    payload.detalles_cuenta = { ...formulario.value.detalles_cuenta };
  } else if (payload.tipo_metodo === 3) {
    payload.detalles_billetera = { ...formulario.value.detalles_billetera };
  }

  const exito = await pagoStore.crearMetodo(payload);

  if (exito) {
    mostrandoFormulario.value = false;
    formulario.value = {
      tipo_metodo: "",
      es_predeterminado: false,
      detalles_tarjeta: {
        tipo_tarjeta: null,
        num_tarjeta_encriptado: "",
        propietario: "",
        fecha_caducidad: "",
        moneda: ""
      },
      detalles_cuenta: {
        iban: "",
        banco: "",
        moneda: ""
      },
      detalles_billetera: {
        proveedor: null,
        email: ""
      }
    };
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

const eliminarMetodo = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
    await pagoStore.borrarMetodo(id);
  }
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

          <!-- Formulario dinámico para Tarjeta -->
          <div v-if="formulario.tipo_metodo === '1'">
            <div class="mb-3">
              <label class="form-label">Tipo de Tarjeta</label>
              <select v-model.number="formulario.detalles_tarjeta.tipo_tarjeta" class="form-select" required>
                <option :value="null" disabled>Selecciona tipo...</option>
                <option :value="1">Visa</option>
                <option :value="2">Mastercard</option>
                <option :value="3">American Express</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Número de Tarjeta</label>
              <input v-model="formulario.detalles_tarjeta.num_tarjeta_encriptado" type="text" class="form-control" required maxlength="255">
            </div>
            <div class="mb-3">
              <label class="form-label">Propietario</label>
              <input v-model="formulario.detalles_tarjeta.propietario" type="text" class="form-control" required maxlength="100">
            </div>
            <div class="mb-3">
              <label class="form-label">Fecha de Caducidad (MM/AA)</label>
              <input v-model="formulario.detalles_tarjeta.fecha_caducidad" type="text" class="form-control" required maxlength="7" placeholder="MM/AA">
            </div>
            <div class="mb-3">
              <label class="form-label">Moneda</label>
              <input v-model="formulario.detalles_tarjeta.moneda" type="text" class="form-control" required maxlength="10">
            </div>
          </div>

          <!-- Formulario dinámico para Cuenta Bancaria -->
          <div v-if="formulario.tipo_metodo === '2'">
            <div class="mb-3">
              <label class="form-label">IBAN</label>
              <input v-model="formulario.detalles_cuenta.iban" type="text" class="form-control" required maxlength="255">
            </div>
            <div class="mb-3">
              <label class="form-label">Banco</label>
              <input v-model="formulario.detalles_cuenta.banco" type="text" class="form-control" required maxlength="100">
            </div>
            <div class="mb-3">
              <label class="form-label">Moneda</label>
              <input v-model="formulario.detalles_cuenta.moneda" type="text" class="form-control" required maxlength="10">
            </div>
          </div>

          <!-- Formulario dinámico para Billetera Digital -->
          <div v-if="formulario.tipo_metodo === '3'">
            <div class="mb-3">
              <label class="form-label">Proveedor</label>
              <select v-model.number="formulario.detalles_billetera.proveedor" class="form-select" required>
                <option :value="null" disabled>Selecciona proveedor...</option>
                <option :value="1">PayPal</option>
                <option :value="2">Stripe</option>
                <option :value="3">Google Pay</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="formulario.detalles_billetera.email" type="email" class="form-control" required maxlength="255">
            </div>
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

      <div class="table-responsive">
        <table class="table table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th>Tipo</th>
              <th>Detalles</th>
              <th>Agregado</th>
              <th>Predeterminado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(metodo, idx) in metodosPago" :key="metodo.id || idx">
              <td>{{ getTipoPago(metodo.tipo_metodo) }}</td>
              <td>
                <!-- Tarjeta -->
                <template v-if="metodo.detalles_tarjeta">
                  <div><strong>Tipo:</strong> 
                    <span v-if="metodo.detalles_tarjeta.tipo_tarjeta === 1">Visa</span>
                    <span v-else-if="metodo.detalles_tarjeta.tipo_tarjeta === 2">Mastercard</span>
                    <span v-else-if="metodo.detalles_tarjeta.tipo_tarjeta === 3">American Express</span>
                    <span v-else>Otro</span>
                  </div>
                  <div><strong>Número:</strong> {{ metodo.detalles_tarjeta.num_tarjeta_encriptado }}</div>
                  <div><strong>Propietario:</strong> {{ metodo.detalles_tarjeta.propietario }}</div>
                  <div><strong>Caducidad:</strong> {{ metodo.detalles_tarjeta.fecha_caducidad }}</div>
                  <div><strong>Moneda:</strong> {{ metodo.detalles_tarjeta.moneda }}</div>
                </template>
                <!-- Cuenta Bancaria -->
                <template v-else-if="metodo.detalles_cuenta">
                  <div><strong>IBAN:</strong> {{ metodo.detalles_cuenta.iban }}</div>
                  <div><strong>Banco:</strong> {{ metodo.detalles_cuenta.banco }}</div>
                  <div><strong>Moneda:</strong> {{ metodo.detalles_cuenta.moneda }}</div>
                </template>
                <!-- Billetera Digital -->
                <template v-else-if="metodo.detalles_billetera">
                  <div><strong>Proveedor:</strong> 
                    <span v-if="metodo.detalles_billetera.proveedor === 1">PayPal</span>
                    <span v-else-if="metodo.detalles_billetera.proveedor === 2">Stripe</span>
                    <span v-else-if="metodo.detalles_billetera.proveedor === 3">Google Pay</span>
                    <span v-else>Otro</span>
                  </div>
                  <div><strong>Email:</strong> {{ metodo.detalles_billetera.email }}</div>
                </template>
                <template v-else>
                  <div class="text-muted">Sin detalles disponibles.</div>
                </template>
              </td>
              <td>{{ metodo.fecha_agregado || (metodo.metodo_pago?.fecha_agregado) || 'Reciente' }}</td>
              <td>
                <span v-if="metodo.es_predeterminado" class="badge bg-success">Sí</span>
                <span v-else class="text-muted">No</span>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-secondary me-1" title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="eliminarMetodo(metodo.id)" title="Eliminar">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
  </div>
</template>