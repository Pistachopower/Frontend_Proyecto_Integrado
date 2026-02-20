
<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';
import { usePedidosVendedorStore } from '../../stores/pedidosVendedorStore.js';
import api from '@/services/axiosRequest.js';


const perfilStore= usePerfilStore();
const pedidosStore = usePedidosVendedorStore();
const filtroEstado = ref('todos');
const pedidoExpandido = ref(null);

// Filtros reactivos para el endpoint
const filtroId = ref('');
const filtroCliente = ref('');
const filtroMonto = ref('');
const filtroFecha = ref('');

//Mapeo de estados numericos a strings
const estadosMap = {
  1: 'pendiente por enviar',
  2: 'pagado',
  3: 'enviado',
  4: 'entregado',
  5: 'cancelado'
};


// Función para filtrar pedidos del vendedor usando el endpoint
const filtrarPedidosVendedor = async () => {
  if (!perfilStore.perfil || !perfilStore.perfil.id) return;
  const params = { vendedor_id: perfilStore.perfil.id };
  if (filtroId.value) params.id = filtroId.value;
  if (filtroCliente.value) params.nombre_cliente = filtroCliente.value;
  if (filtroMonto.value) params.monto = filtroMonto.value;
  if (filtroFecha.value) params.fecha = filtroFecha.value;
  try {
    const response = await api.get('pedido/filtrar_pedidosVendedor/', { params });
    pedidosStore.pedidos = response.data;
  } catch (err) {
    // Manejo de error simple
    pedidosStore.pedidos = [];
  }
};



// Función para alternar expansión del pedido
const togglePedido = (pedidoId) => {
  pedidoExpandido.value = pedidoExpandido.value === pedidoId ? null : pedidoId;
};

// Función para cambiar el estado del pedido
const cambiarEstado = async (pedidoId, nuevoEstado) => {
  try {
    const response = await pedidosStore.cambiarEstadoPedido(pedidoId, Number(nuevoEstado));
    alert(response.mensaje || 'Estado actualizado');
  } catch (error) {
    alert(error.response?.data?.error || 'Error al cambiar el estado del pedido');
  }
}; 


// Monitorear cambios en pedidos
watch(() => pedidosStore.pedidos, (newVal) => {
  console.log('Pedidos cargados:', newVal);
  console.log('Cantidad de pedidos:', newVal?.length);
}, { deep: true });

onMounted(() => {
  console.log('Store perfil:', perfilStore.perfil);
  
  if (!perfilStore.perfil) {
    perfilStore.fetchPerfil();
  }
  
  if (perfilStore.perfil && perfilStore.perfil.id) {
    console.log('Cargando pedidos para vendedor:', perfilStore.perfil.id);
    pedidosStore.fetchPedidosVendedor(perfilStore.perfil.id);
    console.log('Pedidos después de fetch:', pedidosStore.pedidos);
  }
});



</script>

<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-0 py-3">
      <h5 class="fw-bold mb-0">Gestión de Pedidos</h5>
    </div>

    <div class="table-responsive">
      <table class="table table-hover mb-0">
        <thead class="table-light">
          <tr>
            <th class="border-0"></th>
            <th class="border-0">ID Pedido</th>
            <th class="border-0">Cliente</th>
            <th class="border-0">Monto</th>
            <th class="border-0">Items</th>
            <th class="border-0">Estado</th>
            <th class="border-0">Fecha</th>
          </tr>
          <!-- Fila de filtros -->
          <tr>
            <th></th>
            <th>
              <input type="text" class="form-control form-control-sm" placeholder="ID" v-model="filtroId" @keyup.enter="filtrarPedidosVendedor" @blur="filtrarPedidosVendedor" />
            </th>
            <th>
              <input type="text" class="form-control form-control-sm" placeholder="Cliente" v-model="filtroCliente" @keyup.enter="filtrarPedidosVendedor" @blur="filtrarPedidosVendedor" />
            </th>
            <th>
              <input type="text" class="form-control form-control-sm" placeholder="Monto" v-model="filtroMonto" @keyup.enter="filtrarPedidosVendedor" @blur="filtrarPedidosVendedor" />
            </th>
            <th></th>
            <th></th>
            <th>
              <input type="date" class="form-control form-control-sm" v-model="filtroFecha" @change="filtrarPedidosVendedor" />
            </th>
          </tr>
        </thead>
        <tbody v-if="pedidosStore.pedidos.length > 0">
          <template v-for="pedido in pedidosStore.pedidos" :key="pedido.url">
            <tr class="align-middle">
              <td class="align-middle" style="cursor: pointer;" @click="togglePedido(pedido.id)">
                <i :class="pedidoExpandido === pedido.id ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"></i>
              </td>
              <td class="align-middle fw-bold">{{ pedido.id }}</td>
              <td class="align-middle">
                <strong>{{ pedido.cliente_nombre }} {{ pedido.cliente_apellido }} </strong><br>
              </td>
              <td class="align-middle fw-bold">{{ pedido.total }}€</td>
              <td class="align-middle">{{ pedido.lineas_pedido.length }}</td>
              <td class="align-middle">
                <select 
                  class="form-select form-select-sm" 
                  :value="pedido.estado"
                  @change="cambiarEstado(pedido.id, $event.target.value)"
                  style="min-width: 140px;"
                >
                  <option v-for="(nombre, valor) in estadosMap" :key="valor" :value="valor">
                    {{ nombre }}
                  </option>
                </select>
              </td>
              <td class="align-middle text-muted small">{{ pedido.fecha_pedido }}</td>
            </tr>
            <!-- Fila expandible con líneas de pedido -->
            <tr v-if="pedidoExpandido === pedido.id" class="table-light">
              <td colspan="8" class="p-3">
                <h6 class="mb-3 fw-bold">Líneas de Pedido</h6>
                <div class="table-responsive">
                  <table class="table table-sm table-bordered mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>Producto</th>
                        <th>Marca</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Descuento</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="linea in pedido.lineas_pedido" :key="linea.url">
                        <td>{{ linea.pieza.nombre }}</td>
                        <td>{{ linea.pieza.marca }}</td>
                        <td class="text-center">{{ linea.cantidad }}</td>
                        <td class="text-right">{{ linea.precio_unitario }}€</td>
                        <td class="text-right">{{ linea.descuento_aplicado }}€</td>
                        <td class="fw-bold text-right">{{ linea.subtotal }}€</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="pedidosStore.pedidos.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-inbox fs-1 mb-3 d-block"></i>
      <p>No hay pedidos</p>
    </div>
  </div>
</template>