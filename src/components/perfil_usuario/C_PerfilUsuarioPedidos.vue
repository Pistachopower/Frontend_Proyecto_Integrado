<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '@/services/axiosRequest.js'; 
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';

// --- ESTADO LOCAL DEL COMPONENTE ---
const pedidos = ref([]);
const cargando = ref(false);
const error = ref(null);

// --- ACCESO AL STORE (SOLO PARA VIGILAR LA CARGA DEL PERFIL) ---
const perfilStore = usePerfilStore();

// Diccionario de estados para pintar los badges (Mantenido localmente)
const ESTADOS_PEDIDO_MAP = {
  1: { texto: 'Pendiente', color: 'bg-warning text-dark' },
  2: { texto: 'Pagado', color: 'bg-success' },
  3: { texto: 'Enviado', color: 'bg-info text-dark' },
  4: { texto: 'Entregado', color: 'bg-primary' },
  5: { texto: 'Cancelado', color: 'bg-danger' }
};

// Función de ayuda para formatear dinero
const formatoDinero = (val) => {
  if (val === null || val === undefined) return '';
  return Number(val).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
};

// --- LÓGICA DE CARGA LOCAL (Simplificada para CLIENTE) ---
const fetchPedidosLocal = async () => {
  // Evitar cargar si el perfil aún no está definido (aunque en el padre ya controlamos esto)
  if (perfilStore.cargando || !perfilStore.perfil) {
      console.warn('Perfil no cargado, posponiendo carga de pedidos.');
      return; 
  }
  
  // Endpoint Fijo para el Cliente
  const endpoint = 'pedido/' + perfilStore.perfil.usuario.id; 

  cargando.value = true;
  error.value = null;
  pedidos.value = []; // Limpiar antes de la nueva carga
  
  try {
    const response = await api.get(endpoint);
    pedidos.value = response.data;
  } catch (err) {
    console.error(`Error al cargar pedidos:`, err);
    // Mensaje de error fijo para el cliente
    error.value = 'No se pudo cargar el historial de pedidos.'; 
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
    // Si el perfil ya cargó, ejecutamos la petición.
    if (!perfilStore.cargando && perfilStore.perfil) {
      fetchPedidosLocal();
    }
});

// Watcher para asegurar que se carga la información tan pronto como el perfil esté listo
// Esto es necesario para el caso en que el componente se monta antes de que la llamada API del perfil termine.
watch(() => perfilStore.perfil, (newProfile) => {
    if (newProfile) {
        fetchPedidosLocal();
    }
}, { immediate: false });
</script>

<template>
  <div class="animate-fade">
    
    <div v-if="perfilStore.cargando || cargando" class="text-center py-5">
       <div class="spinner-border text-secondary" role="status"></div>
       <p class="mt-2 text-muted">Cargando pedidos...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger shadow-sm">{{ error }}</div>
    
    <div v-else-if="pedidos.length === 0" class="card border-0 shadow-sm py-5 text-center">
      <div class="display-1 text-muted opacity-25 mb-3"><i class="bi bi-inbox"></i></div>
      <h5>No hay registros de pedidos</h5>
    </div>
    
    <div v-else>
      <h5 class="mb-3 fw-bold ps-1">Mis Pedidos Recientes</h5>
      
      <div v-for="pedido in pedidos" :key="pedido.id" class="card border-0 shadow-sm mb-3 pedido-card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h6 class="fw-bold mb-1">Pedido #{{ pedido.id }}</h6>
              <small class="text-muted"><i class="bi bi-calendar3"></i> {{ pedido.fecha_pedido }}</small>
            </div>
            <span class="badge rounded-pill" :class="ESTADOS_PEDIDO_MAP[pedido.estado]?.color || 'bg-secondary'">
              {{ ESTADOS_PEDIDO_MAP[pedido.estado]?.texto || 'Desconocido' }}
            </span>
          </div>
          
          <div class="bg-light p-3 rounded mb-3">
            <small class="text-uppercase text-muted fw-bold" style="font-size: 0.7rem;">Artículos:</small>
            <ul class="list-unstyled mb-0 mt-2">
              <li v-for="linea in pedido.lineas_pedido" :key="linea.id" class="d-flex justify-content-between border-bottom py-2">
                <span><span class="fw-bold">{{ linea.cantidad }}x</span> {{ linea.pieza?.nombre }}</span>
                <span>{{ formatoDinero(linea.subtotal) }}</span>
              </li>
            </ul>
          </div>
          
          <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">Total:</small>
              <h4 class="fw-bold text-primary mb-0">{{ formatoDinero(pedido.total) }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pedido-card { transition: transform 0.2s; }
.pedido-card:hover { transform: translateY(-2px); }
.animate-fade { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>