<script setup>
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
</script>


<template>
  <div>
    <h2>Productos</h2>

  </div>

  <div>
    <h2>Contador: {{ counter.count }}</h2>
    <button @click="counter.increment()">Incrementar</button>
  </div>
</template>


<style scoped>

</style>
