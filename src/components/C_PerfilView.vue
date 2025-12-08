<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const perfil = ref(null);
const pedidos = ref([]); // <--- 1. guardamos la lista
const error = ref(null);
const cargando = ref(true);
const cargandoPedidos = ref(false); // <--- 2. Spinner para pedidos
const activeTab = ref('datos'); 

// --- DICCIONARIO DE ESTADOS (Para que se vea bonito) ---
const ESTADOS_PEDIDO = {
  1: { texto: 'Pendiente', color: 'bg-warning text-dark' },
  2: { texto: 'Pagado', color: 'bg-success' },
  3: { texto: 'Enviado', color: 'bg-info text-dark' },
  4: { texto: 'Entregado', color: 'bg-primary' },
  5: { texto: 'Cancelado', color: 'bg-danger' }
};

const nombreCompleto = computed(() => {
  if (!perfil.value) return 'Usuario';
  return `${perfil.value.nombre || 'Usuario'} ${perfil.value.apellido || ''}`;
});

const iniciales = computed(() => {
  if (!perfil.value || !perfil.value.nombre) return 'U';
  return (perfil.value.nombre[0] + (perfil.value.apellido?.[0] || '')).toUpperCase();
});

const esEmpleado = computed(() => perfil.value?.tipo_usuario === 'empleado');

// --- CARGA INICIAL DEL PERFIL ---
onMounted(async () => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/mi-perfil/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include' 
    });

    if (response.status === 403) throw new Error("Sesión expirada.");
    if (!response.ok) throw new Error("Error: " + response.status);

    perfil.value = await response.json();
    
  } catch (err) {
    console.error(err);
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
});

// --- 3. DESCARGAR PEDIDOS ---
async function fetchPedidos() {
  cargandoPedidos.value = true;
  try {
    // Django usará la cookie para saber quién eres y filtrar tus pedidos (gracias al cambio que hicimos en el backend)
    const res = await fetch("http://localhost:8000/api/v1/pedido/", {
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    });
    if (res.ok) {
      pedidos.value = await res.json();
    }
  } catch (e) {
    console.error("Error cargando pedidos", e);
  } finally {
    cargandoPedidos.value = false;
  }
}

// --- 4. Si cambias de pestaña, carga los datos ---
watch(activeTab, (newTab) => {
  if ((newTab === 'pedidos' || newTab === 'ventas') && pedidos.value.length === 0) {
    fetchPedidos();
  }
});

const setTab = (tab) => activeTab.value = tab;

// Ayuda para formato de moneda
const formatoDinero = (valor) => {
  return Number(valor).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}
</script>

<template>
  <div class="container py-4">
    
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger shadow-sm">
      <h4 class="alert-heading">Error</h4>
      <p>{{ error }}</p>
    </div>

    <div v-else class="row g-4">
      
      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center pt-5 pb-4">
            
            <div class="avatar-circle mb-3 mx-auto shadow-sm" 
                 :class="esEmpleado ? 'bg-warning-gradient' : 'bg-primary-gradient'">
              {{ iniciales }}
            </div>
            
            <h3 class="card-title fw-bold mb-1">{{ nombreCompleto }}</h3>
            <p class="text-muted mb-2">{{ perfil.usuario?.email }}</p>
            
            <span v-if="esEmpleado" class="badge rounded-pill bg-warning text-dark px-3 py-2">
              <i class="bi bi-briefcase-fill"></i> Vendedor Autorizado
            </span>
            <span v-else class="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2">
              <i class="bi bi-person-check-fill"></i> Cliente Verificado
            </span>
            
            <div v-if="esEmpleado" class="mt-3 p-2 bg-light rounded border text-start small">
                <div><strong>Tienda:</strong> {{ perfil.tienda?.nombre || 'Central' }}</div>
                <div><strong>ID Empleado:</strong> #{{ perfil.id }}</div>
            </div>
          </div>
          
          <div class="list-group list-group-flush d-none d-lg-block mt-3">
            <button @click="setTab('datos')" class="list-group-item list-group-item-action border-0 px-4 py-3" :class="{ 'active-link': activeTab === 'datos' }">
              <i class="bi bi-person-lines-fill me-2"></i> Mis Datos
            </button>
            
            <button v-if="!esEmpleado" @click="setTab('pedidos')" class="list-group-item list-group-item-action border-0 px-4 py-3" :class="{ 'active-link': activeTab === 'pedidos' }">
              <i class="bi bi-box-seam me-2"></i> Mis Pedidos
            </button>
            <button v-else @click="setTab('ventas')" class="list-group-item list-group-item-action border-0 px-4 py-3" :class="{ 'active-link': activeTab === 'ventas' }">
              <i class="bi bi-graph-up-arrow me-2"></i> Mis Ventas
            </button>

            <button @click="setTab('seguridad')" class="list-group-item list-group-item-action border-0 px-4 py-3" :class="{ 'active-link': activeTab === 'seguridad' }">
              <i class="bi bi-shield-lock me-2"></i> Configuración
            </button>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-8">
        
        <ul class="nav nav-pills nav-fill mb-4 d-lg-none bg-white p-2 rounded shadow-sm">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'datos' }" @click.prevent="setTab('datos')" href="#">Datos</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'pedidos' || activeTab === 'ventas' }" 
               @click.prevent="setTab(esEmpleado ? 'ventas' : 'pedidos')" href="#">
               {{ esEmpleado ? 'Ventas' : 'Pedidos' }}
            </a>
          </li>
        </ul>

        <div v-if="activeTab === 'datos'" class="card border-0 shadow-sm animate-fade">
          <div class="card-header bg-white border-0 py-3">
            <h5 class="mb-0 fw-bold" :class="esEmpleado ? 'text-warning' : 'text-primary'">Información Personal</h5>
          </div>
          <div class="card-body">
            <form class="row g-3">
               <div class="col-md-6">
                  <label class="form-label text-muted small text-uppercase">Usuario</label>
                  <input type="text" class="form-control bg-light" :value="perfil.usuario?.username" readonly>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small text-uppercase">Email</label>
                  <input type="text" class="form-control bg-light" :value="perfil.usuario?.email" readonly>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small text-uppercase">Nombre</label>
                  <input type="text" class="form-control" :value="perfil.nombre" readonly>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small text-uppercase">Apellido</label>
                  <input type="text" class="form-control" :value="perfil.apellido" readonly>
                </div>
                <div class="col-12">
                   <label class="form-label text-muted small text-uppercase">Teléfono</label>
                   <input type="text" class="form-control" :value="perfil.telefono" readonly>
                </div>
            </form>
          </div>
        </div>

        <div v-if="activeTab === 'pedidos' || activeTab === 'ventas'" class="animate-fade">
          
          <div v-if="cargandoPedidos" class="text-center py-5">
             <div class="spinner-border text-secondary" role="status"></div>
          </div>

          <div v-else-if="pedidos.length === 0" class="card border-0 shadow-sm py-5 text-center">
            <div class="display-1 text-muted opacity-25 mb-3"><i class="bi bi-inbox"></i></div>
            <h5>No hay registros</h5>
            <p class="text-muted">Aún no hay movimientos en tu historial.</p>
          </div>

          <div v-else>
            <h5 class="mb-3 fw-bold ps-1">{{ esEmpleado ? 'Historial de Ventas' : 'Mis Pedidos Recientes' }}</h5>
            
            <div v-for="pedido in pedidos" :key="pedido.id" class="card border-0 shadow-sm mb-3 pedido-card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 class="fw-bold mb-1">Pedido #{{ pedido.id }}</h6>
                    <small class="text-muted"><i class="bi bi-calendar3"></i> {{ pedido.fecha_pedido }}</small>
                  </div>
                  <span class="badge rounded-pill" :class="ESTADOS_PEDIDO[pedido.estado]?.color || 'bg-secondary'">
                    {{ ESTADOS_PEDIDO[pedido.estado]?.texto || 'Desconocido' }}
                  </span>
                </div>

                <div class="bg-light p-3 rounded mb-3">
                  <small class="text-uppercase text-muted fw-bold" style="font-size: 0.7rem;">Artículos:</small>
                  <ul class="list-unstyled mb-0 mt-2">
                    <li v-for="linea in pedido.lineas_pedido" :key="linea.id" class="d-flex justify-content-between border-bottom py-2">
                      <span>
                        <span class="fw-bold">{{ linea.cantidad }}x</span> 
                        {{ linea.pieza?.nombre || 'Pieza' }}
                      </span>
                      <span>{{ formatoDinero(linea.subtotal) }}</span>
                    </li>
                  </ul>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                  <div v-if="esEmpleado">
                    <small class="text-muted">Cliente:</small> 
                    <strong>{{ pedido.cliente?.nombre }} {{ pedido.cliente?.apellido }}</strong>
                  </div>
                  <div v-else>
                    <small class="text-muted">Total:</small>
                  </div>
                  <h4 class="fw-bold text-primary mb-0">{{ formatoDinero(pedido.total) }}</h4>
                </div>
              </div>
            </div>
          </div>
          </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Gradientes para diferenciar roles */
.bg-primary-gradient { background: linear-gradient(135deg, #0d6efd, #0dcaf0); color: white; }
.bg-warning-gradient { background: linear-gradient(135deg, #ffc107, #fd7e14); color: white; }

.avatar-circle {
  width: 100px; height: 100px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 2.5rem; font-weight: bold;
}

.active-link {
  background-color: #f8f9fa;
  font-weight: 600;
  border-left: 4px solid transparent; 
}
.active-link { border-color: #0d6efd !important; color: #0d6efd; }

.animate-fade { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.form-control:read-only { background-color: #f8f9fa; opacity: 1; }
.text-uppercase { font-size: 0.75rem; letter-spacing: 0.5px; }
.pedido-card { transition: transform 0.2s; }
.pedido-card:hover { transform: translateY(-2px); }
</style>