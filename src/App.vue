<script setup>
import Footer from './components/C_Footer.vue'
import Header from './components/C_Header.vue'
import Chatbot from './components/C_Chatbot.vue'



</script>

<template>
  <div class="app-layout">
    <Header />
    <main class="main-content">
      <RouterView />
      <Chatbot />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
