<script setup>

import { ref } from 'vue'

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="#">
        <img :src="logo" alt="Logo" style="height: 40px;" />
        <span>MotorPartsExpress</span>
      </a>

      <!-- Botón hamburguesa -->
      <button class="navbar-toggler" type="button" @click="toggleMenu" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menú colapsable (controlado con Vue) -->
      <div :class="['collapse navbar-collapse', { show: isOpen }]" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-2 gap-lg-3">
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="closeMenu">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/productos" @click="closeMenu">Productos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about" @click="closeMenu">Sobre nosotros</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style>
</style>