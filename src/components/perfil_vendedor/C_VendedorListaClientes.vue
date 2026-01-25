<script setup>
import { onMounted } from 'vue';
import { usePerfilStore } from '../../stores/usuarioPerfilStore.js';
import { useClientesStore } from '../../stores/clientesStore.js';

const perfilStore= usePerfilStore();
const clientesStore = useClientesStore();

onMounted(() => {
    // Inicializamos la carga de los datos del perfil en el Store
    if (!perfilStore.perfil) {
        perfilStore.fetchPerfil();
    }
    // Cargar los clientes asociados al vendedor
    if (perfilStore.perfil && perfilStore.perfil.id) {
        clientesStore.fetchClientes(perfilStore.perfil.id);
    }
    });

    //console.log('Clientes del vendedor:', clientesStore.listado.map(c => c.usuario.username));
</script>

<template>
    <div class="container py-4">
        <h1 class="mb-4">Lista de Clientes</h1>
        
        <div v-if="clientesStore.cargando" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p>Cargando lista de clientes...</p>
        </div>
        
        <div v-else-if="clientesStore.error" class="alert alert-danger shadow-sm">{{ clientesStore.error }}</div>
    
        <div v-else>
        <div v-if="clientesStore.totalClientes === 0" class="alert alert-info shadow-sm">
            No tienes clientes asociados.
        </div>
        <div v-else class="list-group">
            <div 
            v-for="cliente in clientesStore.listado" 
            :key="cliente.id" 
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
            <div>
                <h5 class="mb-1">{{ cliente.usuario.first_name }} {{ cliente.usuario.last_name }}</h5>
                <p class="mb-1">Email: {{ cliente.usuario.email }}</p>
                <small>Teléfono: {{ cliente.usuario.telefono }}</small>
            </div>
            </div>
        </div>
        </div>
    </div>

</template>

<style scoped>

</style>