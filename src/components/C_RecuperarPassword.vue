<template>
  <div class="recovery-container d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
    
    <div class="card border-0 shadow-lg animate-fade-up w-100" style="max-width: 450px;">
      <div class="card-body p-4 p-md-5">
        
        <div class="text-center mb-4">
          <div class="icon-bg mb-3 mx-auto">
            <i class="bi bi-key-fill text-white fs-2"></i>
          </div>
          <h3 class="fw-bold text-dark">¿Olvidaste tu contraseña?</h3>
          <p class="text-muted small">
            No te preocupes. Introduce tu correo electrónico y te enviaremos las instrucciones para restablecerla.
          </p>
        </div>

        <form>
          
          <div class="form-floating mb-4">
            <input 
              type="email" 
              class="form-control" 
              id="recoveryEmail" 
              placeholder="name@example.com" 
              required
            >
            <label for="recoveryEmail">Correo Electrónico</label>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-100 py-3 fw-bold shadow-sm button-hover"
          >
            Recuperar Contraseña
          </button>

        </form>

        <div class="text-center mt-4 pt-3 border-top">
          <a href="/login" class="text-decoration-none fw-bold text-secondary d-flex justify-content-center align-items-center gap-2 back-link">
            <i class="bi bi-arrow-left"></i> Volver al Inicio de Sesión
          </a>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
/* Fondo degradado consistente con Login/Registro */
.recovery-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Círculo del icono */
.icon-bg {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #0d6efd, #0dcaf0); /* Azul Bootstrap */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
}

/* Animación de entrada */
.animate-fade-up {
  animation: fadeUp 0.6s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Efecto Hover en Botón */
.button-hover {
  transition: transform 0.2s;
}
.button-hover:hover:not(:disabled) {
  transform: translateY(-2px);
}

/* Inputs flotantes Focus */
.form-floating > .form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Enlace de Volver */
.back-link {
  transition: color 0.2s;
}
.back-link:hover {
  color: #0d6efd !important; /* Cambia a azul al pasar el ratón */
}
</style>