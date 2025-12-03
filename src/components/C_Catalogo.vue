<script setup>

</script>

<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">
      Encuentra Recambios de Coche en Nuestro Catálogo</h2>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div class="col" v-for="(categoria, index) in categorias" :key="index">
      <router-link
        :to="`/productos/${categoria.nombre.toLowerCase().replace(/\s/g, '')}`"
        class="categoria h-100 d-flex flex-column align-items-center justify-content-center"
      >
        <img :src="categoria.img" :alt="categoria.nombre" class="categoria-img" />
        <div class="punto-rojo"></div>
        <h6 class="mt-2">{{ categoria.nombre }}</h6>
      </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.categoria {
  text-align: center;
  padding: 2rem 1rem 1.5rem 1rem;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  background: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
  min-height: 320px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.categoria:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.categoria-img {
  max-width: 220px;
  width: 100%;
  height: 140px;
  object-fit: contain;
  margin-bottom: 16px;
  margin-top: 8px;
  transition: transform 0.3s;
}
.categoria:hover .categoria-img {
  transform: scale(1.08);
}
.punto-rojo {
  width: 10px;
  height: 10px;
  background-color: rgb(221, 42, 11);
  border-radius: 50%;
  margin: 0 auto 10px;
}

.categoria, .categoria:visited, .categoria:active, .categoria:focus {
  color: inherit;
  text-decoration: none;
}

</style>