<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/axiosRequest.js';


const listaDeseos = ref(null);
const cargando = ref(true);
const error = ref(null);
const eliminando = ref(null); // pieza_id en proceso
const pasandoCarrito = ref(false);
const exitoCarrito = ref(false);
const seleccionados = ref([]); // piezas seleccionadas para pasar

const toggleSeleccion = (pieza_id) => {

  if (seleccionados.value.includes(pieza_id)) {
    seleccionados.value = seleccionados.value.filter(id => id !== pieza_id);
  } else {
    seleccionados.value.push(pieza_id);
  }
};

const pasarAlCarrito = async (soloSeleccionados = false) => {

  pasandoCarrito.value = true;
  error.value = null;
  try {

    
    const body = {};
    
    if (soloSeleccionados && seleccionados.value.length > 0) {
      body.piezas_ids = seleccionados.value;
    }

    body.eliminar_de_lista = true;

    await api.post('lista_deseo/pasar_al_carrito/', body);
    
    exitoCarrito.value = true;
    
    seleccionados.value = [];
    
    await fetchListaDeseos();
    
    setTimeout(() => { exitoCarrito.value = false; }, 1500);
  
  } catch (err) {
    
    error.value = 'No se pudo pasar al carrito.';

  } finally {
    pasandoCarrito.value = false;
  }
};

const fetchListaDeseos = async () => {
  cargando.value = true;
  error.value = null;
  try {
    const response = await api.get('lista_deseo/mi_lista/');
    listaDeseos.value = response.data;

  } catch (err) {
    error.value = 'No se pudo cargar la lista de deseos.';
    
  } finally {
    cargando.value = false;
  }
};

const eliminarPieza = async (pieza_id) => {
  eliminando.value = pieza_id;
  try {
    await api.delete('lista_deseo/eliminar_pieza/', { data: { pieza_id } });
    await fetchListaDeseos();
  } catch (err) {
    error.value = 'No se pudo eliminar el producto de la lista.';
  } finally {
    eliminando.value = null;
  }
};

onMounted(() => {
  fetchListaDeseos();
});

const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(valor);
};
</script>

<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
      <h5 class="mb-0 fw-bold text-primary">Mi Lista de Deseos</h5>
    </div>
    <div class="card-body">
      <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted small">Cargando lista de deseos...</p>
      </div>
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <div>{{ error }}</div>
      </div>
      <div v-else-if="!listaDeseos || !listaDeseos.items || listaDeseos.items.length === 0" class="text-center py-5">
        <i class="bi bi-heart display-1 text-muted opacity-25"></i>
        <h5 class="mt-3 text-muted">No tienes productos en tu lista de deseos.</h5>
      </div>
      <div v-else>
        <div class="mb-3">
          <h6 class="fw-bold mb-1">{{ listaDeseos.nombre }}</h6>
          <span class="text-muted small">Total productos: {{ listaDeseos.total_items }} | Creada: {{ listaDeseos.fecha_creacion }}</span>
        </div>

        <div class="mb-3 d-flex gap-2">
          <button class="btn btn-success btn-sm" :disabled="pasandoCarrito || !listaDeseos.items.length" @click="pasarAlCarrito(false)">
            <span v-if="pasandoCarrito" class="spinner-border spinner-border-sm me-1"></span>
            Pasar <b>todos</b> al carrito
          </button>

          <button class="btn btn-primary btn-sm" :disabled="pasandoCarrito || seleccionados.length === 0" @click="pasarAlCarrito(true)">
            <span v-if="pasandoCarrito" class="spinner-border spinner-border-sm me-1"></span>
            Pasar seleccionados al carrito
          </button>

          <span v-if="exitoCarrito" class="text-success small fw-bold ms-2">¡Productos pasados al carrito!</span>
        </div>

        <div class="row g-3">
          <div v-for="item in listaDeseos.items" :key="item.id" class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm">
              <img :src="item.imagen" :alt="item.nombre" class="card-img-top object-fit-cover" style="height: 180px;">
              <div class="card-body p-2">
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" :id="'sel-' + item.pieza_id" :value="item.pieza_id" v-model="seleccionados" />
                  <label class="form-check-label small" :for="'sel-' + item.pieza_id">Seleccionar</label>
                </div>
                <h6 class="fw-bold mb-1 text-primary">{{ item.nombre }}</h6>
                <div class="text-muted small mb-1">Marca: {{ item.marca }}</div>
                <div class="mb-1">Precio: <span class="fw-bold">{{ formatoMoneda(item.precio) }}</span></div>
                <div class="mb-1">Stock: <span :class="item.stock > 0 ? 'text-success' : 'text-danger'">{{ item.stock }}</span></div>
                <div class="mb-1">Agregado: {{ item.fecha_agregado }}</div>
                <div class="mb-1">
                  <span class="badge" :class="item.disponible ? 'bg-success' : 'bg-danger'">
                    {{ item.disponible ? 'Disponible' : 'No disponible' }}
                  </span>
                </div>
                <div class="d-flex gap-2 mt-2">
                  <button class="btn btn-outline-danger btn-sm w-100" :disabled="eliminando === item.pieza_id" @click="eliminarPieza(item.pieza_id)" title="Eliminar de la lista">
                    <span v-if="eliminando === item.pieza_id" class="spinner-border spinner-border-sm me-1"></span>
                    <i class="bi bi-trash"></i> Quitar
                  </button>
                  <a :href="'/detalle-producto/' + item.pieza_id" class="btn btn-outline-primary btn-sm w-100" title="Ver producto">
                    <i class="bi bi-eye"></i> Ver
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
