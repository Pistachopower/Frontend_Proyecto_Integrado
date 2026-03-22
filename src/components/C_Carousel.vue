<script setup>
import { ref, watch} from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
})

const currentIndex = ref(0) //Numero de imagen actual

//Si currentIndex.value es 0 → (0 + 1) % 3 = 1 → muestra la imagen 1.
//Si currentIndex.value es 1 → (1 + 1) % 3 = 2 → muestra la imagen 2.
//Si currentIndex.value es 2 → (2 + 1) % 3 = 0 → vuelve a la imagen 0 (la primera).
function next() { //Avanza a la siguiente imagen
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

//Si currentIndex.value es 0: (0 - 1 + 3) % 3 = 2 → vas a la última imagen.
//Si currentIndex.value es 2: (2 - 1 + 3) % 3 = 1 → vas a la imagen anterior.
function prev() { //Retrocede a la imagen anterior
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}


function goTo(idx) { //Ir a una imagen específica al hacer clic en un indicador
  currentIndex.value = idx
}

// Reiniciar índice si cambia la lista de imágenes
//Recuerda que la utilidad de esto es que si el componente recibe un nuevo 
// conjunto de imágenes (por ejemplo, al cambiar de categoría), el carrusel se reiniciará automáticamente a la primera imagen del nuevo conjunto.
watch(() => props.images, () => {
  currentIndex.value = 0
})
</script>


<template>
  <div class="carousel-container">
    <div class="carousel-wrapper">
      <button v-if="images.length > 1" class="carousel-btn prev" @click="prev">‹</button>
      <img
        v-if="images.length"
        :src="images[currentIndex]"
        class="carousel-image"
        :alt="`Imagen ${currentIndex + 1}`"
      />
      <button v-if="images.length > 1" class="carousel-btn next" @click="next">›</button>
    </div>
    <div v-if="images.length > 1" class="carousel-indicators">
      <span
        v-for="(img, idx) in images"
        :key="idx"
        :class="['indicator', { active: idx === currentIndex }]"
        @click="goTo(idx)"
      ></span>
    </div>
  </div>
</template>



<style scoped>
.carousel-container {
  width: 100%;
  max-width: 500px;      /* Ajusta el ancho máximo */
  min-height: 220px;     /* Ajusta la altura mínima */
  margin: 24px auto;     /* Centrado y espacio arriba/abajo */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #18181a;   /* Fondo oscuro opcional */
  border-radius: 6px;
  box-sizing: border-box;
}
.carousel-wrapper {
  width: 100%;
  min-height: 180px;     /* Altura mínima para la imagen */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.carousel-image {
  width: 100%;
  max-height: 200px;     /* Ajusta la altura máxima de la imagen */
  object-fit: contain;
  background: #18181a;
  border-radius: 0;
  box-shadow: none;
}
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.7);
  border: none;
  font-size: 2rem;
  cursor: pointer;
  z-index: 2;
  padding: 0 12px;
  border-radius: 50%;
  transition: background 0.2s;
}
.carousel-btn:hover {
  background: #fff;
}
.carousel-btn.prev {
  left: 10px;
}
.carousel-btn.next {
  right: 10px;
}
.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.indicator {
  width: 10px;
  height: 10px;
  background: #ccc;
  border-radius: 50%;
  margin: 0 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.indicator.active {
  background: #333;
}
</style>
