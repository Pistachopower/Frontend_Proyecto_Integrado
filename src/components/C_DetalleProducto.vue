<script setup>
import { onMounted, onUnmounted, ref,  watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePiezasStore } from '@/stores/piezasStore';
import { useCarritoStore } from '@/stores/carritoStore';
import { storeToRefs } from 'pinia';
import C_ProductosRelacionados from '@/components/C_OtrosProductos.vue';
import C_Valoraciones from '@/components/C_Valoraciones.vue';
import { useValoracionesStore } from '@/stores/valoracionesStore';
import { EVENTOS, trackEvento } from '@/services/trackingService';
import api from '@/services/axiosRequest';

// Store de valoraciones para refrescar tras comentar
const valoracionesStore = useValoracionesStore();

//Útil para saber qué pieza cargar y ruta es dinámica (ej: /producto/5)
const route = useRoute();

//acceder a acciones/estado de piezas (fetchPiezaDetalle, piezaSeleccionada, etc.)
const store = usePiezasStore();

//agregar al carrito con agregarOActualizar.
const carritoStore = useCarritoStore();

//Traemos la instancia completa del store piezas y la desestructuramos para obtener solo lo que necesitamos (piezaSeleccionada, cargando, error).
//piezaSeleccionada: pieza: piezaSeleccionada pasa a llamarse pieza para simplificar su uso en el template.
const { piezaSeleccionada: pieza, cargando, error } = storeToRefs(store);


const cantidad = ref(1);

// controlar pestaña activa (descripción/envío).
const tabActiva = ref('descripcion');

// Evita enviar producto_visto duplicado para la misma pieza.
const ultimaPiezaTrackeada = ref(null);

// --- ENVIAR VALORACIÓN ---
const erroresValoracion = ref({});

// controlar estado de envío (deshabilitar botón, evitar doble submit)
const enviandoValoracion = ref(false);

const enviarValoracion = async () => {
  if (!pieza.value?.id) return;
  
  enviandoValoracion.value = true;
  
  erroresValoracion.value = {};
  
  try {
    await api.post('valoracion/', {
      pieza: pieza.value.id,
      puntuacion: Number(valoracion.value.puntuacion),
      titulo: valoracion.value.titulo,
      comentario: valoracion.value.comentario
    });
    valoracion.value = { titulo: '', puntuacion: '', comentario: '' };
    
    await valoracionesStore.fetchValoracionesPorPieza(pieza.value.id);
    
    alert('¡Gracias por tu valoración!');
  } catch (e) {
    if (e.response && e.response.data) {
      erroresValoracion.value = e.response.data;
    } else {
      alert('Error al enviar la valoración');
    }
  
  } finally {
    enviandoValoracion.value = false;
  }
};

// El backend ya devuelve categoria_id directamente en la pieza.
const obtenerCategoriaId = (piezaActual) => {
  if (!piezaActual) {
    return null;
  }

  return piezaActual.categoria_id ?? null;
};

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
    //console.log('ID cambió a:', route.params.id);
    cargarProducto();
});

watch(
  () => pieza.value?.id,
  (piezaId) => {
    if (!piezaId || piezaId === ultimaPiezaTrackeada.value) { //sino hay id no trackea, o si es la misma pieza que ya se trackeo, no trackea de nuevo.
      return;
    }

    ultimaPiezaTrackeada.value = piezaId; //actualiza la última pieza trackeada para evitar duplicados en el mismo producto.
    
    // Evento de detalle visto: se dispara cuando cambia la pieza mostrada.
    void trackEvento(EVENTOS.PRODUCTO_VISTO, {
      pieza_id: piezaId,
      referencia: pieza.value.referencia,
      categoria_id: obtenerCategoriaId(pieza.value),
      precio: Number(pieza.value.precio_base)
    });
  }
);

onUnmounted(() => {
    store.limpiarSeleccion();
});


// --- FORMULARIO DE VALORACIÓN ---
const valoracion = ref({
  titulo: '',
  puntuacion: '',
  comentario: ''
});


const incrementar = () => cantidad.value++;

const decrementar = () => {
    if (cantidad.value > 1) cantidad.value--;
};

// --- AGREGAR AL CARRITO ---
const agregarAlCarrito = async () => {
    try {
        await carritoStore.agregarOActualizar(pieza.value.id, cantidad.value);
  
    //Evento de carrito: refleja la accion del boton Anadir al Carrito.
    void trackEvento(EVENTOS.AGREGADO_CARRITO, {
      pieza_id: pieza.value.id,
      cantidad: cantidad.value,
      precio_unitario: Number(pieza.value.precio_base)
    });
        // Feedback visual 
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
          <!-- Formulario de comentario (solo diseño) -->
          <div class="card border-0 shadow-sm mt-4">
            <div class="card-body">
              <h5 class="fw-bold mb-3">Deja un comentario sobre esta pieza</h5>
              <form @submit.prevent="enviarValoracion">
                <div v-if="Object.keys(erroresValoracion).length" class="alert alert-danger">
                  <div v-for="(msgs, campo) in erroresValoracion" :key="campo">
                    <div v-for="msg in (Array.isArray(msgs) ? msgs : [msgs])" :key="msg">
                      {{ campo }}: {{ msg }}
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="titulo" class="form-label">Título</label>
                  <input id="titulo" type="text" class="form-control" placeholder="Título de tu comentario" required v-model="valoracion.titulo">
                </div>
                <div class="mb-3">
                  <label for="puntuacion" class="form-label">Puntuación</label>
                  <select id="puntuacion" class="form-select" required v-model="valoracion.puntuacion">
                    <option value="" disabled>Selecciona una puntuación</option>
                    <option value="5">5 - Excelente</option>
                    <option value="4">4 - Muy bueno</option>
                    <option value="3">3 - Bueno</option>
                    <option value="2">2 - Regular</option>
                    <option value="1">1 - Malo</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="comentario" class="form-label">Comentario</label>
                  <textarea id="comentario" class="form-control" rows="3" placeholder="Escribe tu comentario aquí..." required v-model="valoracion.comentario"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="enviandoValoracion || !valoracion.titulo || !valoracion.puntuacion || !valoracion.comentario">Enviar comentario</button>
              </form>
            </div>
          </div>
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