<script setup>
import { onMounted, computed } from 'vue'
import { useCategoriasStore } from '@/stores/categoriasStore'
import { usePiezasStore } from '@/stores/piezasStore'
import api from '../services/axiosRequest';


const categoriasStore = useCategoriasStore()
const piezasStore = usePiezasStore()

// Cargar datos al montar
onMounted(async () => {
  // Si hay categoría seleccionada, cargar productos de esa categoría
  if (categoriasStore.categoriaSeleccionada) {
    console.log('📦 Cargando productos de categoría:', categoriasStore.categoriaSeleccionada.nombre)
    await cargarProductosPorCategoria()
  } else {
    // Si no hay categoría, cargar todos los productos
    console.log('📦 Cargando todos los productos')
    await piezasStore.fetchCatalogo()
  }
  
  // Cargar imágenes
  await piezasStore.fetchImagenesPieza()
})

// Función para cargar productos por categoría
const cargarProductosPorCategoria = async () => {
  piezasStore.cargando = true
  piezasStore.error = null
  
  try {
    const response = await api.get(
      `pieza/?categoria=${categoriasStore.categoriaSeleccionada.id}`
    )
    
    if (response.data.results) {
      piezasStore.listado = response.data.results
    } else {
      piezasStore.listado = response.data
    }
    
    console.log('✅ Productos cargados:', piezasStore.listado)
  } catch (err) {
    console.error('❌ Error al cargar productos:', err)
    piezasStore.error = 'Error al cargar los productos'
  } finally {
    piezasStore.cargando = false
  }
}

// Computed: Título dinámico basado en la categoría
const tituloCatalogo = computed(() => {
  if (categoriasStore.categoriaSeleccionada) {
    return `Catálogo - ${categoriasStore.categoriaSeleccionada.nombre}`
  }
  return 'Catálogo Completo'
})

// Función para ir al detalle del producto
const irAlDetalle = (idProducto) => {
  piezasStore.fetchPiezaDetalle(idProducto)
  // Aquí iría la navegación al detalle si tienes una ruta
}
</script>

<template>
  <div class="catalogo-wrapper">
    <!-- Encabezado del catálogo -->
    <div class="catalogo-header">
      <h1>{{ tituloCatalogo }}</h1>
      <p v-if="categoriasStore.categoriaSeleccionada" class="subtitle">
        Mostrando productos de: <strong>{{ categoriasStore.categoriaSeleccionada.nombre }}</strong>
      </p>
    </div>

    <!-- Estados de carga -->
    <div v-if="piezasStore.cargando" class="loading">
      <p>Cargando productos...</p>
    </div>

    <div v-else-if="piezasStore.error" class="error-message">
      <p>{{ piezasStore.error }}</p>
    </div>

    <div v-else-if="piezasStore.listado.length === 0" class="sin-productos">
      <p>No hay productos disponibles</p>
    </div>

    <!-- Grid de productos -->
    <div v-else class="productos-grid">
      <div
        v-for="producto in piezasStore.listado"
        :key="producto.id"
        class="producto-card"
        @click="irAlDetalle(producto.id)"
      >
        <!-- Imagen -->
        <div class="producto-imagen">
          <img 
            v-if="piezasStore.obtenerImagenPorPieza(producto.id)" 
            :src="piezasStore.obtenerImagenPorPieza(producto.id)" 
            :alt="producto.nombre"
          />
          <div v-else class="sin-imagen">
            <span>🔧</span>
          </div>
        </div>

        <!-- Info -->
        <div class="producto-info">
          <h3>{{ producto.nombre }}</h3>
          <button class="btn-ver-detalles">Ver Detalles</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalogo-wrapper {
  padding: 40px 20px;
  background: #f9f9f9;
  min-height: calc(100vh - 200px);
}

.catalogo-header {
  text-align: center;
  margin-bottom: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.catalogo-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.producto-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.producto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.producto-imagen {
  width: 100%;
  height: 180px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.producto-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sin-imagen {
  font-size: 40px;
}

.producto-info {
  padding: 15px;
}

.producto-info h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.producto-info p {
  margin: 5px 0;
  font-size: 12px;
  color: #666;
}

.marca {
  font-weight: 600;
}

.precio {
  font-size: 16px !important;
  font-weight: bold;
  color: #e74c3c;
  margin: 10px 0 8px 0 !important;
}

.btn-ver-detalles {
  width: 100%;
  padding: 8px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
  transition: background 0.3s;
}

.btn-ver-detalles:hover {
  background: #c0392b;
}

.loading,
.error-message,
.sin-productos {
  text-align: center;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 20px auto;
  border-radius: 8px;
}

.error-message {
  background: #fadbd8;
  color: #e74c3c;
}

.sin-productos {
  background: white;
  color: #999;
}

@media (max-width: 768px) {
  .productos-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 15px;
  }
}
</style>