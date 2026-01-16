<script setup>
import { onMounted, onUnmounted, ref,  watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePiezasStore } from '@/stores/piezasStore';
import { useCarritoStore } from '@/stores/carritoStore';
import { storeToRefs } from 'pinia';
import C_ProductosRelacionados from '@/components/C_OtrosProductos.vue';
import C_Valoraciones from '@/components/C_Valoraciones.vue';


const route = useRoute();
const store = usePiezasStore();
const carritoStore = useCarritoStore();
const { piezaSeleccionada: pieza, cargando, error } = storeToRefs(store);


const cantidad = ref(1);
const tabActiva = ref('descripcion');

// --- HELPER ---
const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(valor);
};



// --- FUNCIÓN PARA CARGAR PRODUCTO ---
const cargarProducto = () => {
    store.fetchPiezaDetalle(route.params.id);
};

// --- LIFECYCLE ---
onMounted(() => {
        cargarProducto();

});

// ESTO ES IMPORTANTE: Observar cambios en la ruta
watch(() => route.params.id, () => {
    console.log('ID cambió a:', route.params.id);
    cargarProducto();
});

onUnmounted(() => {
    store.limpiarSeleccion();
});

// --- CONTADOR ---
const incrementar = () => cantidad.value++;
const decrementar = () => {
    if (cantidad.value > 1) cantidad.value--;
};

// --- AGREGAR AL CARRITO ---
const agregarAlCarrito = async () => {
    try {
        await carritoStore.agregarOActualizar(pieza.value.id, cantidad.value);
        // Feedback visual (opcional)
        alert(`${cantidad.value} ${pieza.value.nombre} añadido al carrito`);
        cantidad.value = 1; // Reiniciar contador
    } catch (error) {
        alert('Error al agregar el producto al carrito');
    }
};


</script>

<template>
  <div class="container py-4 fade-in">
    
    <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
        {{ error }}
        <br>
        <router-link to="/catalogo-productos" class="btn btn-outline-danger mt-3 btn-sm">Volver al catálogo</router-link>
    </div>

    <div v-else-if="pieza">
        <div class="row g-4 mb-5">
          
          <div class="col-12 col-lg-7">
            <div class="card border-0 shadow-sm mb-3 main-image-container">
              <img :src="pieza.imagen" class="card-img-top img-fluid rounded" :alt="pieza.nombre">
            </div>
            
            <div class="d-flex gap-2 overflow-auto">
              <div class="thumbnail-box border rounded">
                <img :src="pieza.imagen" class="img-fluid rounded" alt="Miniatura">
                              
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-5">
            <div class="ps-lg-4">
              <h1 class="fw-bold mb-2">{{ pieza.nombre }}</h1>
              
              <p class="text-muted mb-3">
                  <span class="badge bg-light text-dark border me-2">{{ pieza.marca }} {{ pieza.anio }}</span>
                  <span class="small"><i class="bi bi-upc-scan"></i> Ref: {{ pieza.referencia }}</span>
              </p>

              <h2 class="text-primary fw-bold mb-4">{{ formatoMoneda(pieza.precio_base) }}</h2>

              <div class="d-flex align-items-center gap-3 mb-4">
                <div class="input-group" style="width: 130px;">
                  <button class="btn btn-outline-secondary" @click="decrementar" type="button">-</button>
                  <input type="text" class="form-control text-center" :value="cantidad" readonly>
                  <button class="btn btn-outline-secondary" @click="incrementar" type="button">+</button>
                </div>
                <button class="btn btn-dark flex-grow-1 py-2" @click="agregarAlCarrito">
                  <i class="bi bi-cart-plus me-2"></i> Añadir al Carrito
                </button>
              </div>

              <div class="row g-2 mb-4">
                <div class="col-6">
                  <div class="p-3 border rounded text-center bg-light h-100">
                    <i class="bi bi-truck fs-4 text-primary d-block mb-1"></i>
                    <small class="fw-bold d-block">Envío Rápido</small>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-3 border rounded text-center bg-light h-100">
                    <i class="bi bi-shield-check fs-4 text-primary d-block mb-1"></i>
                    <small class="fw-bold d-block">Garantía</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-5">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-bottom-0">
                <ul class="nav nav-tabs card-header-tabs">
                  <li class="nav-item">
                    <a class="nav-link cursor-pointer" :class="{active: tabActiva === 'descripcion'}" @click="tabActiva = 'descripcion'">Descripción</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link cursor-pointer" :class="{active: tabActiva === 'envio'}" @click="tabActiva = 'envio'">Envío y Devoluciones</a>
                  </li>
                </ul>
              </div>
              <div class="card-body">
                <div v-if="tabActiva === 'descripcion'" class="animate-fade">
                    <h5 class="fw-bold">Detalles de la pieza</h5>
                    <p class="text-muted">{{ pieza.descripcion }}</p>
                </div>
                <div v-else class="animate-fade">
                    <h5 class="fw-bold">Política de envíos</h5>
                    <p class="text-muted">Envíos a toda la península en 24-48 horas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <C_ProductosRelacionados :piezaId="pieza.id"/>

        <C_Valoraciones />
        </div> 
  </div>
</template>

<style scoped>
.fade-in { animation: fadeIn 0.5s ease-in; }
.animate-fade { animation: fadeIn 0.3s ease-in; }
.main-image-container { background-color: #f8f9fa; }
.thumbnail-box { width: 80px; height: 80px; flex-shrink: 0; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; }
.thumbnail-box:hover { opacity: 1; border-color: var(--bs-primary) !important; }
.product-card { transition: transform 0.2s; }
.product-card:hover { transform: translateY(-5px); }
.cursor-pointer { cursor: pointer; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>