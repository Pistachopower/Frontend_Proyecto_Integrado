<script setup>
import Contacto from '@/components/C_Contacto.vue'
import CategoriaProductos from '@/components/C_CategoriaProductos.vue'
import Carousel from '@/components/C_Carousel.vue'

// Define una función para importar automáticamente todos los archivos encontrados 
// por require.context
const importAll = (r) => r.keys().map(r)

// Carga automáticamente todas las imágenes de src/assets/carousel en un array

const images = importAll(require.context('@/assets/carousel', false, /\.(png|jpe?g|webp)$/))

</script>

<template>
  <main class="home-main">
    <section class="home-section home-carousel">
      <Carousel :images="images" />
    </section>
    
    
    <section class="home-section home-products">
      <CategoriaProductos></CategoriaProductos>
      
    </section>
    
    
    <section class="home-section home-contact">
      <!-- Aquí irá el componente Formulario de contacto -->
      <Contacto></Contacto>

    </section>
  </main>
</template>


<style scoped>
.home-main {
  display: flex;
  flex-direction: column;
  /* Elimina el gap */
}

.home-section {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ccc;
  border-radius: 0;
  background: #fff;
  margin: 0;
  padding: 0;
}

/* Quita el borde inferior de la última sección */
.home-section:last-child {
  border-bottom: none;
}

</style>