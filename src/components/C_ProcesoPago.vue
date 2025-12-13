<script setup>
import { ref, computed } from 'vue';

// --- ESTADO DEL FORMULARIO ---
const formulario = ref({
  nombre: '',
  apellido: '',
  direccion: '',
  ciudad: '',
  codigoPostal: ''
});

// --- ESTADO DEL ENVÍO ---
// 1 = Estándar, 2 = Express
const metodoEnvio = ref(1);

const opcionesEnvio = [
  { 
    id: 1, 
    titulo: 'Envío Estándar', 
    tiempo: '4-5 días laborables', 
    precio: 0 
  },
  { 
    id: 2, 
    titulo: 'Envío Express', 
    tiempo: '24-48 horas', 
    precio: 9.99 
  }
];

// --- DATOS SIMULADOS DEL CARRITO (Resumen) ---
// En una app real, esto vendría de Pinia o props
const carritoResumen = ref([
  { 
    id: 1, 
    titulo: 'Alternador Bosch 12V', 
    precio: 150.00, 
    cantidad: 1,
    imagen: 'https://placehold.co/80x80/png?text=Alt' 
  },
  { 
    id: 2, 
    titulo: 'Batería 60Ah', 
    precio: 80.00, 
    cantidad: 1,
    imagen: 'https://placehold.co/80x80/png?text=Bat' 
  }
]);

// --- CÁLCULOS (Computed) ---
const subtotal = computed(() => {
  return carritoResumen.value.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
});

const precioEnvio = computed(() => {
  const opcion = opcionesEnvio.find(op => op.id === metodoEnvio.value);
  return opcion ? opcion.precio : 0;
});

const impuestos = computed(() => subtotal.value * 0.21); // Ejemplo 21% IVA
const total = computed(() => subtotal.value + precioEnvio.value + impuestos.value);

// --- FUNCIONES ---
const formatoDinero = (valor) => {
  return valor.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
};

const irAPago = () => {
  // Aquí validarías los campos antes de seguir
  if(!formulario.value.direccion) {
    alert("Por favor completa la dirección");
    return;
  }
  console.log("Datos guardados:", formulario.value);
  console.log("Método envío:", metodoEnvio.value);
  alert("Redirigiendo a la pasarela de pago...");
};
</script>

<template>
  <div class="container py-5 fade-in">
    
    <div class="row mb-5 justify-content-center">
      <div class="col-12 col-md-8">
        <div class="d-flex justify-content-between position-relative align-items-center">
          <div class="position-absolute w-100 bg-light" style="height: 4px; z-index: 0;"></div>
          
          <div class="step-item text-center active">
            <div class="step-circle bg-primary text-white fw-bold mx-auto mb-2">1</div>
            <span class="fw-bold small">Envío</span>
          </div>
          <div class="step-item text-center text-muted opacity-50">
            <div class="step-circle bg-light border text-dark fw-bold mx-auto mb-2">2</div>
            <span class="small">Pago</span>
          </div>
          <div class="step-item text-center text-muted opacity-50">
            <div class="step-circle bg-light border text-dark fw-bold mx-auto mb-2">3</div>
            <span class="small">Revisión</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-5">
      
      <div class="col-12 col-lg-7">
        <h4 class="fw-bold mb-4">1. Información de Envío</h4>
        
        <form @submit.prevent="irAPago">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <h6 class="mb-3 text-muted text-uppercase small fw-bold">Dirección de Entrega</h6>
              
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label">Nombre</label>
                  <input v-model="formulario.nombre" type="text" class="form-control bg-light" placeholder="Tu nombre">
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Apellido</label>
                  <input v-model="formulario.apellido" type="text" class="form-control bg-light" placeholder="Tus apellidos">
                </div>

                <div class="col-12">
                  <label class="form-label">Dirección</label>
                  <input v-model="formulario.direccion" type="text" class="form-control bg-light" placeholder="Calle, número, piso...">
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Ciudad</label>
                  <input v-model="formulario.ciudad" type="text" class="form-control bg-light">
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Código Postal</label>
                  <input v-model="formulario.codigoPostal" type="text" class="form-control bg-light">
                </div>
              </div>
            </div>
          </div>

          <h4 class="fw-bold mb-3 mt-5">Método de Envío</h4>
          <div class="row g-3 mb-4">
            <div v-for="opcion in opcionesEnvio" :key="opcion.id" class="col-12 col-md-6">
              <div 
                class="card h-100 cursor-pointer shipping-card"
                :class="{ 'border-primary ring-active': metodoEnvio === opcion.id }"
                @click="metodoEnvio = opcion.id"
              >
                <div class="card-body p-4">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold mb-0">{{ opcion.titulo }}</h6>
                    <i v-if="metodoEnvio === opcion.id" class="bi bi-check-circle-fill text-primary fs-5"></i>
                    <i v-else class="bi bi-circle text-muted fs-5"></i>
                  </div>
                  <p class="text-muted small mb-0">{{ opcion.tiempo }}</p>
                  <hr class="my-2 border-light">
                  <p class="fw-bold text-primary mb-0">
                    {{ opcion.precio === 0 ? 'GRATIS' : formatoDinero(opcion.precio) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-dark py-3 px-5 fw-bold shadow-hover">
              Continuar Pago <i class="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </form>
      </div>

      <div class="col-12 col-lg-5">
        <div class="card border-0 shadow-sm bg-light sticky-summary">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Resumen de tu cesta</h5>
            
            <div class="cart-items mb-4">
              <div v-for="item in carritoResumen" :key="item.id" class="d-flex gap-3 mb-3 bg-white p-2 rounded shadow-sm">
                <img :src="item.imagen" class="rounded bg-light" width="60" height="60" style="object-fit: cover;">
                <div class="flex-grow-1">
                  <h6 class="mb-0 fw-bold small text-truncate">{{ item.titulo }}</h6>
                  <div class="d-flex justify-content-between align-items-center mt-1">
                    <small class="text-muted">Cant: {{ item.cantidad }}</small>
                    <small class="fw-bold">{{ formatoDinero(item.precio * item.cantidad) }}</small>
                  </div>
                </div>
              </div>
            </div>

            <hr>

            <div class="d-flex justify-content-between mb-2 small">
              <span class="text-muted">Subtotal</span>
              <span class="fw-bold">{{ formatoDinero(subtotal) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2 small">
              <span class="text-muted">Envío</span>
              <span class="fw-bold" :class="precioEnvio === 0 ? 'text-success' : ''">
                {{ precioEnvio === 0 ? 'Gratis' : formatoDinero(precioEnvio) }}
              </span>
            </div>
            <div class="d-flex justify-content-between mb-3 small">
              <span class="text-muted">Impuestos (est.)</span>
              <span class="fw-bold">{{ formatoDinero(impuestos) }}</span>
            </div>

            <hr>

            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold fs-5">Total</span>
              <span class="fw-bold fs-3 text-primary">{{ formatoDinero(total) }}</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Animación de entrada */
.fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Estilos de la Barra de Progreso */
.step-item {
  position: relative;
  z-index: 1;
  width: 80px;
}
.step-circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

/* Tarjetas de Envío Seleccionables */
.shipping-card {
  transition: all 0.2s;
  border: 2px solid transparent;
}
.cursor-pointer {
  cursor: pointer;
}
.shipping-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.ring-active {
  border-color: #0d6efd !important; /* Color primario Bootstrap */
  background-color: #f8fbff;
}

/* Sticky Summary en Desktop */
@media (min-width: 992px) {
  .sticky-summary {
    position: sticky;
    top: 2rem;
  }
}

/* Botón Hover */
.shadow-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
</style>