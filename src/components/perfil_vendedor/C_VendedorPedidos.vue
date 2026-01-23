<script setup>
import { ref } from 'vue';

</script>

<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-0 py-3">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="fw-bold mb-0">Gestión de Pedidos</h5>
        <select v-model="filtroEstado" class="form-select form-select-sm" style="width: 150px;">
          <option value="todos">Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="completado">Completados</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-hover mb-0">
        <thead class="table-light">
          <tr>
            <th class="border-0">ID Pedido</th>
            <th class="border-0">Cliente</th>
            <th class="border-0">Monto</th>
            <th class="border-0">Items</th>
            <th class="border-0">Estado</th>
            <th class="border-0">Fecha</th>
            <th class="border-0">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="align-middle fw-bold">#pedido.id</td>
            <td class="align-middle">pedido.cliente</td>
            <td class="align-middle fw-bold">pedido.monto€</td>
            <td class="align-middle">pedido.items</td>
            <td class="align-middle">
              <span>pedido.estado</span>
            </td>
            <td class="align-middle text-muted small">pedido.fecha</td>
            <td class="align-middle">
              <button class="btn btn-sm btn-outline-primary" title="Ver detalles">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-success ms-1" title="Procesar">
                <i class="bi bi-check"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-center py-5 text-muted">
      <i class="bi bi-inbox fs-1 mb-3 d-block"></i>
      <p>No hay pedidos con ese estado</p>
    </div>
  </div>
</template>