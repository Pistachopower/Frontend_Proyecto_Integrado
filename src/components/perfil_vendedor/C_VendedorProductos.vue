<script setup>
import { ref } from 'vue';

</script>

<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
      <h5 class="fw-bold mb-0">Mis Productos</h5>
      <button class="btn btn-sm btn-primary">
        <i class="bi bi-plus-circle me-1"></i> Nuevo Producto
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover mb-0">
        <thead class="table-light">
          <tr>
            <th class="border-0">Nombre</th>
            <th class="border-0">Categoría</th>
            <th class="border-0">Precio</th>
            <th class="border-0">Stock</th>
            <th class="border-0">Ventas</th>
            <th class="border-0">Estado</th>
            <th class="border-0">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="align-middle fw-bold">producto.nombre</td>
            <td class="align-middle">producto.categoria</td>
            <td class="align-middle fw-bold">producto.precio€</td>
            <td class="align-middle">
              <span>
                
              </span>
            </td>
            <td class="align-middle">producto.ventas</td>
            <td class="align-middle">
              <span>producto.estado</span>
            </td>
            <td class="align-middle">
              <button class="btn btn-sm btn-outline-primary" title="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger ms-1" title="Eliminar">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-center py-5 text-muted">
      <i class="bi bi-box-seam fs-1 mb-3 d-block"></i>
      <p>No tienes productos registrados</p>
    </div>
  </div>
</template>