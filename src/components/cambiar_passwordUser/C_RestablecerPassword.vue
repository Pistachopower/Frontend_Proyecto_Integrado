<script setup>
import { ref } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const nuevaPassword = ref('')
const confirmarPassword = ref('')
const mensaje = ref('')
const cargando = ref(false)
const authStore = useAuthStore()

//useRoute() te da acceso a la información de la ruta actual 
// (parámetros, query, path, etc.), pero no permite navegar 
// o cambiar de ruta.
const route = useRoute() 

//useRouter() te da acceso al router, es decir, puedes navegar, 
// redirigir, usar push, replace, etc.
const router = useRouter()

async function restablecerPassword() {

    mensaje.value = ''
    if (nuevaPassword.value !== confirmarPassword.value) {
        mensaje.value = 'Las contraseñas no coinciden.'
        return
    }
    cargando.value = true
    const uid = route.query.uid
    const token = route.query.token
    if (!uid || !token) {
        mensaje.value = 'Faltan datos de validación en el enlace.'
        cargando.value = false
        return
    }
    const result = await authStore.resetPasswordConfirm({
        uid,
        token,
        new_password: nuevaPassword.value
    })

    if (result.success) {
        mensaje.value = result.message

        setTimeout(() => {
            router.push({ name: 'login' })
        }, 2000) // Espera 2 segundos antes de redirigir


    } else {
        mensaje.value = result.error
    }
    cargando.value = false
}
</script>

<template>
    <div class="container min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div class="row w-100 justify-content-center">
            <div class="col-12 col-md-8 col-lg-5">
                <div class="card shadow-lg border-0 animate-fade-up">
                    <div class="card-body p-4 p-md-5">
                        <div class="text-center mb-4">
                            <div class="icon-bg mb-3 mx-auto d-flex align-items-center justify-content-center"
                                style="width:70px;height:70px;background:linear-gradient(135deg,#0d6efd,#0dcaf0);border-radius:50%;box-shadow:0 4px 10px rgba(13,110,253,0.3);">
                                <i class="bi bi-shield-lock-fill text-white fs-2"></i>
                            </div>
                            <h3 class="fw-bold text-dark">Restablecer Contraseña</h3>
                            <p class="text-muted small mb-0">Ingresa tu nueva contraseña y confírmala.</p>
                        </div>
                        <form @submit.prevent="restablecerPassword">
                            <div class="mb-3">
                                <label for="newPassword" class="form-label">Nueva Contraseña</label>
                                <input v-model="nuevaPassword" type="password" class="form-control" id="newPassword"
                                    placeholder="Nueva contraseña" required>
                            </div>
                            <div class="mb-4">
                                <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                                <input v-model="confirmarPassword" type="password" class="form-control"
                                    id="confirmPassword" placeholder="Confirmar contraseña" required>
                            </div>
                            <button type="submit" :disabled="cargando" class="btn btn-primary w-100 fw-bold shadow-sm">
                                <span v-if="cargando">
                                    <span class="spinner-border spinner-border-sm me-2" role="status"
                                        aria-hidden="true"></span>
                                    Restableciendo...
                                </span>
                                <span v-else>Restablecer</span>
                            </button>
                            <p v-if="mensaje" class="mt-3 text-center">{{ mensaje }}</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Animación fade-up opcional */
.animate-fade-up {
    animation: fadeUp 0.6s ease-out;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
