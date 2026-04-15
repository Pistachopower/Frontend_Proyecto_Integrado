

<script setup>
// Importación de funciones y hooks de Vue y stores personalizados
import { onMounted, ref } from 'vue';
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js'; // Store para datos del perfil del usuario
import { usePedidosVendedorStore } from '../../stores/pedidosVendedorStore.js'; // Store para pedidos del vendedor
import api from '@/services/axiosRequest.js'; // Cliente Axios personalizado para peticiones HTTP

// Instancia de los stores
const perfilStore = usePerfilStore();
const pedidosStore = usePedidosVendedorStore();

// Estado reactivo para el filtro de estado de pedidos
const filtroEstado = ref('todos');
// Estado para controlar qué pedido está expandido en la tabla
const pedidoExpandido = ref(null);

// Filtros reactivos para buscar pedidos por distintos campos
const filtroId = ref('');
const filtroCliente = ref('');
const filtroMonto = ref('');
const filtroFecha = ref('');

// Mapeo de estados numéricos a sus nombres legibles
const estadosMap = {
  1: 'pendiente por enviar',
  2: 'pagado',
  3: 'enviado',
  4: 'entregado',
  5: 'cancelado'
};

// Función para filtrar pedidos del vendedor usando los filtros activos
const filtrarPedidosVendedor = async () => {
  // Si no hay perfil cargado, no hace nada
  if (!perfilStore.perfil || !perfilStore.perfil.id) return;

  // Construye los parámetros de búsqueda según los filtros
  const params = { vendedor_id: perfilStore.perfil.id };
  if (filtroId.value) params.id = filtroId.value;
  if (filtroCliente.value) params.nombre_cliente = filtroCliente.value;
  if (filtroMonto.value) params.monto = filtroMonto.value;
  if (filtroFecha.value) params.fecha = filtroFecha.value;
  try {
    // Llama al endpoint para filtrar pedidos
    const response = await api.get('pedido/filtrar_pedidosVendedor/', { params });
    pedidosStore.pedidos = response.data;
  } catch (err) {
    // Si hay error, deja la lista vacía
    pedidosStore.pedidos = [];
  }
};

// Método para mostrar todos los pedidos (limpia filtros y recarga la lista)
const verTodosPedidos = () => {
    filtroId.value = '';
    filtroCliente.value = '';
    filtroMonto.value = '';
    filtroFecha.value = '';
    filtroEstado.value = '';

    // Vuelve a cargar todos los pedidos del vendedor
    pedidosStore.fetchPedidosVendedor(perfilStore.perfil.id);
};



// Función para alternar la expansión de un pedido en la tabla (mostrar/ocultar detalles)
const togglePedido = (pedidoId) => {
  pedidoExpandido.value = pedidoExpandido.value === pedidoId ? null : pedidoId;
};

// Función para cambiar el estado de un pedido
// Llama al store para actualizar el estado en backend y muestra un mensaje
const cambiarEstado = async (pedidoId, nuevoEstado) => {
  try {
    const response = await pedidosStore.cambiarEstadoPedido(pedidoId, Number(nuevoEstado));
    alert(response.mensaje || 'Estado actualizado');
  } catch (error) {
    alert(error.response?.data?.error || 'Error al cambiar el estado del pedido');
  }
};

// Función para descargar la factura PDF de un pedido
const descargarFacturaPDF = async (idPedido) => {
    try {
        // Solicita el PDF como blob
        const response = await api.get(`pedido/${idPedido}/factura_cliente/`, {
            responseType: 'blob' // Indica que esperas un archivo binario (PDF)
        });

        // Convierte los datos binarios del PDF en una URL que el navegador puede abrir o descargar
        const url = window.URL.createObjectURL(
            new Blob(
                [response.data],
                { type: 'application/pdf' }));

        // Abre la URL en una nueva ventana o pestaña
        window.open(url, '_blank');

    } catch (err) {
        alert('No se pudo descargar la factura.');
    }
};

// Hook que se ejecuta al montar el componente
onMounted(() => {
  // Si no hay perfil cargado, lo solicita
  if (!perfilStore.perfil) {
    perfilStore.fetchPerfil();
  }
  // Si ya hay perfil, carga los pedidos del vendedor
  if (perfilStore.perfil && perfilStore.perfil.id) {
    pedidosStore.fetchPedidosVendedor(perfilStore.perfil.id);
  }
});



</script>

<template>
  <!-- Tarjeta principal de gestión de pedidos -->
  <div class="card border-0 shadow-sm">
    <!-- Cabecera -->
    <div class="card-header bg-white border-0 py-3">
      <h5 class="fw-bold mb-0">Gestión de Pedidos</h5>
    </div>

    <!-- Botón para ver todos los pedidos (limpia filtros) -->
    <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-outline-primary btn-sm" type="button" @click="verTodosPedidos">
            <i class="bi bi-arrow-counterclockwise"></i>Ver todos los pedidos
        </button>
    </div>

    <!-- Tabla de pedidos -->
    <div class="table-responsive">
      <table class="table table-hover mb-0">
        <thead class="table-light">
          <tr>
            <th class="border-0"></th> <!-- Columna para expandir -->
            <th class="border-0">ID Pedido</th>
            <th class="border-0">Cliente</th>
            <th class="border-0">Monto</th>
            <th class="border-0">Items</th>
            <th class="border-0">Estado</th>
            <th class="border-0">Fecha</th>
          </tr>
          <!-- Fila de filtros para buscar por campos -->
          <tr>
            <th></th>
            <th>
              <!-- Filtro por ID -->
              <input type="text" class="form-control form-control-sm" placeholder="ID" v-model="filtroId" @keyup.enter="filtrarPedidosVendedor" @blur="filtrarPedidosVendedor" />
            </th>
            <th>
              <!-- Filtro por nombre de cliente -->
              <input type="text" class="form-control form-control-sm" placeholder="Cliente" v-model="filtroCliente" @keyup.enter="filtrarPedidosVendedor" @blur="filtrarPedidosVendedor" />
            </th>
            <th>
              <!-- Filtro por monto -->
              <input type="text" class="form-control form-control-sm" placeholder="Monto" v-model="filtroMonto" @keyup.enter="filtrarPedidosVendedor" @blur="filtrarPedidosVendedor" />
            </th>
            <th></th>
            <th></th>
            <th>
              <!-- Filtro por fecha -->
              <input type="date" class="form-control form-control-sm" v-model="filtroFecha" @change="filtrarPedidosVendedor" />
            </th>
          </tr>
        </thead>
        <tbody v-if="pedidosStore.pedidos.length > 0">
          <!-- Itera sobre los pedidos -->
          <template v-for="pedido in pedidosStore.pedidos" :key="pedido.url">
            <tr class="align-middle">
              <!-- Icono para expandir/cerrar detalles del pedido -->
              <td class="align-middle" style="cursor: pointer;" @click="togglePedido(pedido.id)">
                <i :class="pedidoExpandido === pedido.id ? 'bi bi-chevron-down' : 'bi bi-chevron-right'"></i>
              </td>
              <!-- ID del pedido -->
              <td class="align-middle fw-bold">{{ pedido.id }}</td>
              <!-- Nombre del cliente -->
              <td class="align-middle">
                <strong>{{ pedido.cliente_nombre }} {{ pedido.cliente_apellido }} </strong><br>
              </td>
              <!-- Total del pedido -->
              <td class="align-middle fw-bold">{{ pedido.total }}€</td>
              <!-- Número de ítems -->
              <td class="align-middle">{{ pedido.lineas_pedido.length }}</td>
              <!-- Selector para cambiar el estado del pedido -->
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
              <!-- Fecha del pedido -->
              <td class="align-middle text-muted small">{{ pedido.fecha_pedido }}</td>
            </tr>
            
            <!-- Fila expandible con detalles de las líneas de pedido -->
            <tr v-if="pedidoExpandido === pedido.id" class="table-light">
              <td colspan="8" class="p-3">
              <!-- Botón para descargar factura PDF -->
              <button class="btn btn-outline-primary btn-sm"
                  @click.stop="descargarFacturaPDF(pedido.id)">
                  <i class="bi bi-printer"></i> Imprimir Factura
              </button>
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
                      <!-- Itera sobre las líneas de pedido -->
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

    <!-- Mensaje si no hay pedidos -->
    <div v-if="pedidosStore.pedidos.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-inbox fs-1 mb-3 d-block"></i>
      <p>No hay pedidos</p>
    </div>
  </div>
</template>