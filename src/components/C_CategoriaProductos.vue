<script setup>
import { useCategoriasStore } from '@/stores/categoriasStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const categoriasStore = useCategoriasStore();
const { listado } = storeToRefs(categoriasStore);

onMounted(async () => {
    await categoriasStore.fetchCategorias();
});
</script>

<template>
    <section class="categorias-section py-5">
        <div class="container-fluid px-3 px-md-4">
            <!-- Encabezado -->
            <div class="mb-5">
                <h2 class="fw-bold mb-2">Categorías de Productos</h2>
                <p class="text-muted">Descubre nuestras categorías disponibles</p>
            </div>

            <!-- Grid de categorías -->
            <div class="row g-4">
                <div v-for="categoria in listado" :key="categoria.id" class="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <div class="categoria-card">
                        <!-- Contenedor de imagen con overlay -->
                        <div class="imagen-container">
                            <img 
                                :src="categoria.imagen_categoria" 
                                :alt="categoria.nombre" 
                                class="categoria-imagen"
                                loading="lazy"
                            >
                            <div class="overlay"></div>
                        </div>

                        <!-- Contenido de la tarjeta -->
                        <div class="card-content">
                            
                            <a :href="`/categoria/${categoria.id}`" class="categoria-enlace">
                                {{ categoria.nombre }}
                             
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.categorias-section {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 400px;
}

.categoria-card {
    height: 100%;
    border: none;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    background: white;
    display: flex;
    flex-direction: column;
}

.categoria-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.imagen-container {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    overflow: hidden;
    background: #e9ecef;
}

.categoria-imagen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.categoria-card:hover .categoria-imagen {
    transform: scale(1.08);
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.categoria-card:hover .overlay {
    opacity: 1;
}

.card-content {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}



.categoria-enlace {
    display: inline-flex;
    align-items: center;
    color: #007bff;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;
    padding-bottom: 2px;
}

.categoria-enlace:hover {
    color: #0056b3;
    border-bottom-color: #0056b3;
    gap: 8px;
}

.categoria-enlace i {
    transition: transform 0.3s ease;
}

.categoria-card:hover .categoria-enlace i {
    transform: translateX(4px);
}

/* Responsive */
@media (max-width: 576px) {

    .categoria-titulo {
        font-size: 1rem;
    }

    .categoria-enlace {
        font-size: 0.9rem;
    }
}

@media (min-width: 768px) {
    .categoria-titulo {
        font-size: 1.15rem;
    }
}

@media (min-width: 1024px) {
    .card-content {
        padding: 25px;
    }

    .categoria-titulo {
        font-size: 1.2rem;
    }
}
</style>