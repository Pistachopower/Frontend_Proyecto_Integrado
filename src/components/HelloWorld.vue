<template>
  <div>
    <h2>Productos</h2>

    <div v-if="loading">Cargando productos…</div>

    <div v-else-if="error" class="error">
      Error: {{ error }}
    </div>

    <ul v-else>
      <li v-for="prod in productos" :key="prod.id">
        {{ prod.nombre }} - {{ prod.precio }}
      </li>
    </ul>
  </div>
</template>

<script>
import { listarProductos } from '@/services/listarProductos.js';

export default {
  name: 'HelloWorld',
  data() {
    return {
      productos: [],
      loading: false,
      error: null
    };
  },
  mounted() {
    this.fetchProductos();
  },
  methods: {
    async fetchProductos() {
      this.loading = true;
      this.error = null;
      try {
        const data = await listarProductos(); // tu función retorna JSON o lanza error
        // Asegúrate de adaptar según la forma del JSON (ej: data.results vs data)
        this.productos = data;
      } catch (err) {
        this.error = err.message || 'Error al obtener productos';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>


<style scoped>

</style>
