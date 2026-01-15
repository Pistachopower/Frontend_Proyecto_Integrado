<script setup>


import Contacto from '@/components/C_Contacto.vue'
import CategoriaProductos from '@/components/C_CategoriaProductos.vue'

</script>

<template>
  <main class="home-main">
    <section class="home-section home-carousel">
   
      
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

.home-products {
  align-items: stretch;
  justify-content: flex-start;
  background: #f9f9f9;
  padding: 0 !important;
}
</style>