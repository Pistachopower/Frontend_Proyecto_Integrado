<script setup>

import Carousel from '@/components/C_Catalogo.vue'
import Contacto from '@/components/C_Contacto.vue'

</script>

<template>
  <main class="home-main">
    <section class="home-section home-carousel">
     <Carousel></Carousel>
      
    </section>
    
    
    <section class="home-section home-products">
      <!-- Aquí irá el componente Productos más vendidos -->
      <Catalogo></Catalogo>
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