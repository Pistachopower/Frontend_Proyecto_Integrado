<script setup>
import { ref } from 'vue';

// --- DATOS SIMULADOS (ESTADO) ---

const usuario = ref({
  nombre: 'Carlos Empleado',
  rol: 'Vendedor Senior',
  avatar: 'https://placehold.co/100x100/png?text=CE'
});

// Estadísticas Superiores
const estadisticas = ref([
  { titulo: 'Ventas del día', valor: '1.250 €', icono: 'bi-cash-coin', color: 'text-success', bg: 'bg-success-subtle' },
  { titulo: 'Pedidos Pendientes', valor: '12', icono: 'bi-clock-history', color: 'text-warning', bg: 'bg-warning-subtle' },
  { titulo: 'Nuevos Clientes', valor: '5', icono: 'bi-person-plus-fill', color: 'text-primary', bg: 'bg-primary-subtle' },
]);

// Lista de Últimos Pedidos (Sidebar Derecho)
const ultimosPedidos = ref([
  { id: 1024, cliente: 'Taller Manolo', total: '150€', tiempo: 'Hace 10 min' },
  { id: 1023, cliente: 'Juan Pérez', total: '45€', tiempo: 'Hace 35 min' },
  { id: 1022, cliente: 'AutoReparaciones', total: '200€', tiempo: 'Hace 1h' },
  { id: 1021, cliente: 'María López', total: '80€', tiempo: 'Hace 2h' },
  { id: 1020, cliente: 'Transp. García', total: '500€', tiempo: 'Hace 3h' },
]);

const activeMenu = ref('dashboard');

// --- FUNCIONES ---
const navegar = (opcion) => {
  activeMenu.value = opcion;
  console.log(`Navegando a: ${opcion}`);
};

const gestionarPedidos = () => alert("Ir a gestión de pedidos...");
const nuevoProducto = () => alert("Abrir modal de nuevo producto...");

</script>

<template>
  <div class="container-fluid py-4 bg-light min-vh-100 fade-in">
    
    <div class="row g-4">
      
      <div class="col-12 col-lg-2">
        <div class="card border-0 shadow-sm h-100 sidebar-card">
          <div class="card-body text-center">
            <div class="mb-4">
              <img :src="usuario.avatar" class="rounded-circle mb-2 border border-3 border-white shadow-sm" width="80">
              <h6 class="fw-bold mb-0">{{ usuario.nombre }}</h6>
              <small class="text-muted">{{ usuario.rol }}</small>
            </div>
            
            <div class="list-group list-group-flush text-start">
              <button 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-menu': activeMenu === 'dashboard' }"
                @click="navegar('dashboard')"
              >
                <i class="bi bi-speedometer2 me-2"></i> Dashboard
              </button>
              <button 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-menu': activeMenu === 'pedidos' }"
                @click="navegar('pedidos')"
              >
                <i class="bi bi-box-seam me-2"></i> Pedidos
              </button>
              <button 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-menu': activeMenu === 'productos' }"
                @click="navegar('productos')"
              >
                <i class="bi bi-tags me-2"></i> Productos
              </button>
              <button 
                class="list-group-item list-group-item-action border-0 rounded mb-1"
                :class="{ 'active-menu': activeMenu === 'clientes' }"
                @click="navegar('clientes')"
              >
                <i class="bi bi-people me-2"></i> Clientes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-7">
        
        <div class="row g-3 mb-4">
          <div v-for="(stat, index) in estadisticas" :key="index" class="col-12 col-md-4">
            <div class="card border-0 shadow-sm stat-card">
              <div class="card-body d-flex align-items-center">
                <div class="rounded-circle p-3 me-3" :class="stat.bg">
                  <i class="bi fs-4" :class="[stat.icono, stat.color]"></i>
                </div>
                <div>
                  <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem;">{{ stat.titulo }}</small>
                  <h4 class="fw-bold mb-0">{{ stat.valor }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">Rendimiento Semanal</h5>
            <select class="form-select form-select-sm w-auto border-0 bg-light">
              <option>Esta semana</option>
              <option>Este mes</option>
            </select>
          </div>
          <div class="card-body">
            <div class="chart-container d-flex justify-content-around align-items-end" style="height: 250px;">
              <div class="bar-group text-center">
                <div class="bar bg-primary rounded-top" style="height: 40%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Lun</small>
              </div>
              <div class="bar-group text-center">
                <div class="bar bg-primary rounded-top" style="height: 60%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Mar</small>
              </div>
              <div class="bar-group text-center">
                <div class="bar bg-primary rounded-top" style="height: 30%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Mié</small>
              </div>
              <div class="bar-group text-center">
                <div class="bar bg-primary rounded-top opacity-50" style="height: 80%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Jue</small>
              </div>
              <div class="bar-group text-center">
                <div class="bar bg-primary rounded-top opacity-50" style="height: 50%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Vie</small>
              </div>
              <div class="bar-group text-center">
                <div class="bar bg-secondary rounded-top opacity-25" style="height: 90%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Sáb</small>
              </div>
              <div class="bar-group text-center">
                <div class="bar bg-secondary rounded-top opacity-25" style="height: 20%; width: 20px;"></div>
                <small class="text-muted mt-2 d-block">Dom</small>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-12 col-md-6">
            <button class="btn btn-outline-primary w-100 py-3 border-dashed" @click="nuevoProducto">
              <i class="bi bi-plus-circle fs-4 d-block mb-1"></i>
              Añadir Nuevo Producto
            </button>
          </div>
          <div class="col-12 col-md-6">
            <button class="btn btn-dark w-100 py-3" @click="gestionarPedidos">
              <i class="bi bi-list-check fs-4 d-block mb-1"></i>
              Gestionar Pedidos
            </button>
          </div>
        </div>

      </div>

      <div class="col-12 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-0 py-3">
            <h6 class="fw-bold mb-0 text-uppercase text-muted small">Últimos Pedidos Pendientes</h6>
          </div>
          <div class="list-group list-group-flush overflow-auto" style="max-height: 500px;">
            
            <div 
              v-for="pedido in ultimosPedidos" 
              :key="pedido.id" 
              class="list-group-item px-3 py-3 border-bottom-0"
            >
              <div class="d-flex w-100 justify-content-between align-items-center mb-1">
                <span class="badge bg-warning text-dark rounded-pill">#{{ pedido.id }}</span>
                <small class="text-muted" style="font-size: 0.7rem;">{{ pedido.tiempo }}</small>
              </div>
              <h6 class="mb-1 fw-bold text-truncate">{{ pedido.cliente }}</h6>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Total:</small>
                <span class="fw-bold text-success">{{ pedido.total }}</span>
              </div>
              <button class="btn btn-sm btn-light w-100 mt-2 text-muted" style="font-size: 0.8rem;">
                Ver detalle
              </button>
            </div>

          </div>
          <div class="card-footer bg-white border-0 text-center pb-3">
            <a href="#" class="text-decoration-none small fw-bold">Ver todos los pendientes</a>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Transición de entrada */
.fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Menú Activo */
.active-menu {
  background-color: #e9ecef;
  color: #0d6efd; /* Azul primario */
  font-weight: bold;
}

/* Efecto Hover en tarjetas de estadísticas */
.stat-card {
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-3px);
}

/* Borde discontinuo para botón de añadir */
.border-dashed {
  border-style: dashed !important;
  border-width: 2px;
}

/* Animación simple de las barras del gráfico */
.bar {
  transition: height 1s ease-out;
  width: 100%;
}

/* Sidebar izquierda siempre alta en desktop */
@media (min-width: 992px) {
  .sidebar-card {
    min-height: calc(100vh - 2rem);
  }
}
</style>