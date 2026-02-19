<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '@/services/axiosRequest.js';
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';
//import { storeToRefs } from 'pinia';

const perfilStore = usePerfilStore();

//console.log("Perfil store", perfilStore.perfil.id);



// --- ESTADO ---
const pedidos = ref([]);
const cargando = ref(true);
const error = ref(null);
const pedidoExpandido = ref(null);

// Filtros reactivos
const filtroId = ref('');
const filtroFecha = ref('');
const filtroEstado = ref('');

// Método para filtrar pedidos por id, fecha y estado
const filtrarPedidos = async () => {
    cargando.value = true;
    error.value = null;
    try {
        // Construir objeto de parámetros
        const params = {};
        if (filtroId.value) params.id = filtroId.value;
        if (filtroFecha.value) params.fecha_pedido = filtroFecha.value;
        if (filtroEstado.value) params.estado = filtroEstado.value;

        // Si no hay filtros, cargar todos los pedidos del cliente
        if (Object.keys(params).length === 0) {
            fetchPedidos();
            return;
        }

        const response = await api.get('pedido/filtrar_pedidosCliente/', { params });
        pedidos.value = response.data;
    } catch (err) {
        error.value = 'No se pudo filtrar los pedidos.';
    } finally {
        cargando.value = false;
    }
};


// --- HELPER: Formato de Moneda ---
const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(valor);
};

// --- HELPER: Formato de Fecha ---
const formatoFecha = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// --- HELPER: Traducir Estado ---
const getEstadoInfo = (numEstado) => {
    const diccionario = {
        1: { texto: 'Pendiente', clase: 'bg-warning text-dark' },
        2: { texto: 'Pagado', clase: 'bg-info text-dark' },
        3: { texto: 'Enviado', clase: 'bg-primary text-white' },
        4: { texto: 'Entregado', clase: 'bg-success text-white' },
        5: { texto: 'Cancelado', clase: 'bg-danger text-white' },
        6: { texto: 'En carrito', clase: 'bg-secondary text-dark' }
    };
    return diccionario[numEstado] || { texto: 'Desconocido', clase: 'bg-secondary text-white' };
};

// Método para mostrar todos los pedidos (limpia filtros y recarga)
const verTodosPedidos = () => {
    filtroId.value = '';
    filtroFecha.value = '';
    filtroEstado.value = '';
    fetchPedidos();
};

// --- LÓGICA: Cargar Datos ---
const fetchPedidos = async () => {
    cargando.value = true;
    error.value = null;
    try {
        // Asegúrate que sea 'pedidos/' o 'pedido/' según tu urls.py
        //console.log("Perfil:", perfilStore.perfil);

        const response = await api.get('pedido/?cliente_id=' + perfilStore.perfil.id);

        pedidos.value = response.data;
        //console.log("📦 Datos recibidos:", response.data);

    } catch (err) {
        console.error("Error obteniendo pedidos:", err);
        error.value = 'No se pudo cargar el historial de pedidos.';
    } finally {
        cargando.value = false;
    }
};

// --- LÓGICA: Abrir/Cerrar Acordeón ---
const toggleDetalle = (idPedido) => {
    pedidoExpandido.value = pedidoExpandido.value === idPedido ? null : idPedido;
};



const descargarFacturaPDF = async (idPedido) => {
    try {
        const response = await api.get(`pedido/${idPedido}/factura_cliente/`, {
            responseType: 'blob' // Indica que esperas un archivo binario (PDF)
        });

        //convierte los datos binarios del PDF en una URL que el navegador puede abrir o descargar.
        const url = window.URL.createObjectURL(
            new Blob(
                [response.data],
                { type: 'application/pdf' }));

        // Abre la URL en una nueva ventana o pestaña
        const win = window.open(url, '_blank');

    } catch (err) {
        alert('No se pudo descargar la factura.');
    }
};



onMounted(() => {
    fetchPedidos();
});


</script>

<template>
    <div class="card border-0 shadow-sm animate-fade">

        <div class="card-header bg-white border-0 py-3">
            <h5 class="mb-0 fw-bold text-primary">Historial de Pedidos</h5>
        </div>

        <div class="card-body">
            <div class="d-flex justify-content-end mb-2">
                <button class="btn btn-outline-primary btn-sm" type="button" @click="verTodosPedidos">
                    <i class="bi bi-arrow-counterclockwise"></i> Ver todos los pedidos
                </button>
            </div>

            <div v-if="cargando" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted small">Cargando tus pedidos...</p>
            </div>

            <div v-else-if="error" class="alert alert-danger d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{{ error }}</div>
            </div>

            <div v-else-if="pedidos.length === 0" class="text-center py-5">
                <i class="bi bi-cart-x display-1 text-muted opacity-25"></i>
                <h5 class="mt-3 text-muted">Aún no has realizado pedidos.</h5>
            </div>

            <div v-else class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="border-0 text-muted small text-uppercase ps-3">Pedido </th>
                            <th class="border-0 text-muted small text-uppercase">Fecha</th>
                            <th class="border-0 text-muted small text-uppercase">Estado</th>
                            <th class="border-0 text-muted small text-uppercase text-end">Total</th>
                            <th class="border-0"></th>
                        </tr>

                        <!-- Fila de filtros 
                        @keyup.enter: se ejecuta el método indicado cuando el usuario presiona la tecla Enter
                        @blur: se ejecuta el método indicado cuando el campo de entrada pierde el foco (cuando el usuario hace clic fuera del campo o navega a otro elemento)
                        -->
                        <tr>
                            <th class="ps-3">
                                <input type="text" class="form-control form-control-sm"
                                    placeholder="Filtrar por ID (presiona Enter)"
                                    v-model="filtroId"
                                    @keyup.enter="filtrarPedidos"
                                    @blur="filtrarPedidos"
                                />
                            </th>
                            <th>
                                <input type="date" class="form-control form-control-sm"
                                    v-model="filtroFecha"
                                    @change="filtrarPedidos"
                                />
                            </th>
                            <th>
                                <div class="d-flex align-items-center gap-2">
                                    <select class="form-select form-select-sm"
                                        v-model="filtroEstado"
                                        @change="filtrarPedidos">
                                        <option value="">Todos</option>
                                        <option :value="1">Pendiente</option>
                                        <option :value="2">Pagado</option>
                                        <option :value="3">Enviado</option>
                                        <option :value="4">Entregado</option>
                                        <option :value="5">Cancelado</option>
                                        <option :value="6">En carrito</option>
                                    </select>

                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        <template v-for="pedido in pedidos" :key="pedido.id">

                            <tr class="cursor-pointer transition-bg"
                                :class="{ 'table-active': pedidoExpandido === pedido.id }"
                                @click="toggleDetalle(pedido.id)">
                                <td class="fw-bold ps-3 text-primary">{{ pedido.id }}</td>
                                <td>{{ formatoFecha(pedido.fecha_pedido) }}</td>
                                <td>
                                    <span class="badge rounded-pill" :class="getEstadoInfo(pedido.estado).clase">
                                        {{ getEstadoInfo(pedido.estado).texto }}
                                    </span>
                                </td>
                                <td class="text-end fw-bold">{{ formatoMoneda(pedido.total) }}</td>
                                <td class="text-end pe-3">
                                    <i class="bi"
                                        :class="pedidoExpandido === pedido.id ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                                </td>
                            </tr>

                            <tr v-if="pedidoExpandido === pedido.id" class="bg-light-subtle">
                                <td colspan="5" class="p-0 border-0">
                                    <div class="p-4 animate-slide">

                                        <h6 class="fw-bold text-muted small mb-3 border-bottom pb-2">
                                            <i class="bi bi-box-seam me-1"></i> DETALLES DEL PEDIDO
                                        </h6>

                                        <!-- Botón para descargar factura PDF -->
                                        <button class="btn btn-outline-primary btn-sm"
                                            @click.stop="descargarFacturaPDF(pedido.id)">
                                            <i class="bi bi-printer"></i> Imprimir Factura
                                        </button>

                                        <div v-if="pedido.lineas_pedido && pedido.lineas_pedido.length > 0">
                                            <div v-for="linea in pedido.lineas_pedido" :key="linea.id"
                                                class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                                                <div>
                                                    <div class="fw-bold text-dark fs-6">
                                                        {{ linea.pieza.nombre }}
                                                        <span class="badge bg-secondary ms-2"
                                                            title="ID Línea de Pedido">
                                                            Línea #{{ linea.id }}
                                                        </span>
                                                    </div>

                                                    <div class="mt-1">
                                                        <span class="badge bg-light text-dark border me-2">
                                                            {{ linea.pieza.marca }} {{ linea.pieza.anio }}
                                                        </span>
                                                        <span class="text-muted small" style="font-size: 0.8rem;">
                                                            <i class="bi bi-upc-scan me-1"></i>Ref: {{
                                                                linea.pieza.referencia }}
                                                        </span>
                                                    </div>

                                                    <div class="text-muted small mt-1">
                                                        Cant: <strong>{{ linea.cantidad }}</strong> x {{
                                                            formatoMoneda(linea.precio_unitario) }}
                                                    </div>
                                                </div>

                                                <div class="text-end">
                                                    <div class="fw-bold fs-6">
                                                        {{ formatoMoneda(linea.subtotal) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-else class="text-muted small fst-italic">
                                            No hay líneas de productos asociadas a este pedido.
                                        </div>

                                        <div class="mt-3 pt-2 text-end small">
                                            <span class="text-muted me-1">Enviado a:</span>
                                            <span class="fw-bold text-dark">{{ pedido.direccion_envio }}</span>
                                        </div>

                                    </div>
                                </td>
                            </tr>

                        </template>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}

.text-uppercase {
    font-size: 0.75rem;
    letter-spacing: 0.5px;
}

/* Animación de entrada suave del componente */
.animate-fade {
    animation: fadeIn 0.4s ease-in-out;
}

/* Animación de despliegue del acordeón */
.animate-slide {
    animation: slideDown 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Efecto hover suave */
.transition-bg {
    transition: background-color 0.2s;
}
</style>