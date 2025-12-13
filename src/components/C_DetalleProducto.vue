<script setup>
import { ref, onMounted } from 'vue';
//import { useRoute } from 'vue-router'; // Si usas router para obtener el ID

// --- ESTADO Y DATOS SIMULADOS ---
const cantidad = ref(1);
const imagenActual = ref('');
const activeTab = ref('descripcion'); // 'descripcion', 'envio'

// Datos simulados del producto (esto vendría de tu API)
const producto = ref({
  id: 1,
  titulo: 'Alternador Bosch 12V',
  precio: 150.00,
  descripcion_corta: 'Alternador de alto rendimiento para modelos sedán 2018-2022.',
  descripcion_larga: 'Este alternador ofrece una carga estable y duradera. Fabricado con materiales de alta calidad, garantiza el funcionamiento óptimo de todos los sistemas eléctricos de su vehículo. Compatible con series X, Y, Z.',
  imagenes: [
    'https://placehold.co/600x600/png?text=Imagen+Principal', // Placeholder
    'https://placehold.co/600x600/e9ecef/495057?text=Vista+Lateral',
    'https://placehold.co/600x600/e9ecef/495057?text=Conectores'
  ],
  garantia: '2 años',
  envio: '24/48 horas'
});

// Datos simulados para productos relacionados
const relacionados = ref([
  { id: 2, titulo: 'Batería 60Ah', precio: 80.00, img: 'https://placehold.co/400x300?text=Bateria' },
  { id: 3, titulo: 'Correa Distribución', precio: 35.50, img: 'https://placehold.co/400x300?text=Correa' },
  { id: 4, titulo: 'Filtro Aceite', precio: 12.00, img: 'https://placehold.co/400x300?text=Filtro' },
]);

// Datos simulados para opiniones
const opiniones = ref([
  { id: 1, usuario: 'Pedro Pérez', avatar: 'https://placehold.co/50x50', comentario: 'La pieza está en buen estado y llegó rápido.' }
]);

// --- FUNCIONES ---
onMounted(() => {
  // Inicializamos la imagen principal
  if (producto.value.imagenes.length > 0) {
    imagenActual.value = producto.value.imagenes[0];
  }
});

const cambiarImagen = (img) => {
  imagenActual.value = img;
};

const incrementar = () => cantidad.value++;
const decrementar = () => {
  if (cantidad.value > 1) cantidad.value--;
};

const agregarAlCarrito = () => {
  console.log(`Agregado: ${producto.value.titulo}, Cantidad: ${cantidad.value}`);
  alert('Producto añadido al carrito');
};
</script>

<template>
  <div class="container py-4 fade-in">
    
    <div class="row g-4 mb-5">
      
      <div class="col-12 col-lg-7">
        <div class="card border-0 shadow-sm mb-3 main-image-container">
          <img :src="imagenActual" class="card-img-top img-fluid rounded" alt="Producto Principal">
        </div>
        
        <div class="d-flex gap-2 overflow-auto">
          <div 
            v-for="(img, index) in producto.imagenes" 
            :key="index"
            class="thumbnail-box cursor-pointer border rounded"
            :class="{ 'border-primary border-2': imagenActual === img }"
            @click="cambiarImagen(img)"
          >
            <img :src="img" class="img-fluid rounded" alt="Miniatura">
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="ps-lg-4">
          <h1 class="fw-bold mb-2">{{ producto.titulo }}</h1>
          <p class="text-muted mb-3">{{ producto.descripcion_corta }}</p>
          <h2 class="text-primary fw-bold mb-4">{{ producto.precio.toFixed(2) }} €</h2>

          <div class="d-flex align-items-center gap-3 mb-4">
            <div class="input-group" style="width: 130px;">
              <button class="btn btn-outline-secondary" type="button" @click="decrementar">-</button>
              <input type="text" class="form-control text-center" :value="cantidad" readonly>
              <button class="btn btn-outline-secondary" type="button" @click="incrementar">+</button>
            </div>
            <button class="btn btn-dark flex-grow-1 py-2" @click="agregarAlCarrito">
              Añadir al Carrito
            </button>
          </div>

          <div class="row g-2 mb-4">
            <div class="col-6">
              <div class="p-3 border rounded text-center bg-light h-100">
                <i class="bi bi-truck fs-4 text-primary d-block mb-1"></i>
                <small class="fw-bold d-block">Envío Rápido</small>
                <small class="text-muted">{{ producto.envio }}</small>
              </div>
            </div>
            <div class="col-6">
              <div class="p-3 border rounded text-center bg-light h-100">
                <i class="bi bi-shield-check fs-4 text-primary d-block mb-1"></i>
                <small class="fw-bold d-block">Garantía</small>
                <small class="text-muted">{{ producto.garantia }}</small>
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
                <a class="nav-link" :class="{ active: activeTab === 'descripcion' }" href="#" @click.prevent="activeTab = 'descripcion'">Descripción</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'envio' }" href="#" @click.prevent="activeTab = 'envio'">Envío y Devoluciones</a>
              </li>
            </ul>
          </div>
          <div class="card-body">
            <div v-if="activeTab === 'descripcion'">
              <h5 class="fw-bold">Detalles del producto</h5>
              <p class="text-muted">{{ producto.descripcion_larga }}</p>
              <p class="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div v-if="activeTab === 'envio'">
              <h5 class="fw-bold">Política de envíos</h5>
              <p class="text-muted">Envíos gratuitos a partir de 100€. Las devoluciones se aceptan dentro de los 30 días posteriores a la compra.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-5">
      <h4 class="fw-bold mb-4">Productos Relacionados</h4>
      <div class="row g-3">
        <div v-for="rel in relacionados" :key="rel.id" class="col-6 col-md-4 col-lg-4">
          <div class="card h-100 border-0 shadow-sm product-card">
            <div class="card-img-top bg-light ratio ratio-4x3">
               <img :src="rel.img" class="object-fit-cover rounded-top" :alt="rel.titulo">
            </div>
            <div class="card-body">
              <h6 class="card-title text-truncate">{{ rel.titulo }}</h6>
              <p class="card-text text-primary fw-bold">{{ rel.precio.toFixed(2) }} €</p>
              <button class="btn btn-sm btn-outline-primary w-100">Ver</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-5">
      <h4 class="fw-bold mb-4">Opiniones del producto</h4>
      <div class="card border-0 shadow-sm">
        <div class="list-group list-group-flush">
          <div v-for="op in opiniones" :key="op.id" class="list-group-item p-4">
            <div class="d-flex align-items-center mb-2">
              <img :src="op.avatar" class="rounded-circle me-3" width="50" height="50" alt="Avatar">
              <div>
                <h6 class="mb-0 fw-bold">{{ op.usuario }}</h6>
                <div class="text-warning small">
                  <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                </div>
              </div>
            </div>
            <p class="text-muted mb-0 ps-5 ms-3">{{ op.comentario }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Transición suave de entrada */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

/* Contenedor de la imagen principal */
.main-image-container {
  background-color: #f8f9fa; /* Gris claro de fondo */
  overflow: hidden;
}

/* Estilos para las miniaturas */
.thumbnail-box {
  width: 80px;
  height: 80px;
  flex-shrink: 0; /* Evita que se encojan */
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s, border-color 0.2s;
}

.thumbnail-box:hover, .thumbnail-box.border-primary {
  opacity: 1;
}

.cursor-pointer {
  cursor: pointer;
}

/* Animación simple */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Ajustes para tarjetas de productos relacionados */
.product-card {
  transition: transform 0.2s;
}
.product-card:hover {
  transform: translateY(-5px);
}
</style>