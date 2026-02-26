<script setup>
import { ref } from 'vue';
import api from '@/services/axiosRequest.js';

const form = ref(null);


const sendEmail = async () => {
  const nombre = form.value.nombre.value;
  const email = form.value.email.value;
  const numero_telefono = form.value.telefono.value;
  const asunto = form.value.asunto.value;
  const mensaje = form.value.mensaje.value;

  try {
    debugger;
    const response = await api.post('contacto-vendedor/', {
      nombre,
      email,
      numero_telefono,
      asunto,
      mensaje
    });
    // Limpiar formulario
    form.value.reset();
    
    //mostrar alerta de éxito
    if (response.status === 200) {
      alert('Mensaje enviado con éxito.');
    } else {
      alert('Error al enviar el mensaje. Inténtalo de nuevo.');
    }

  } catch (error) {
    alert('Error al enviar el mensaje. Inténtalo de nuevo.');
  }
};
</script>

<template>
  <div class="container py-5">
    <div class="row">
      <!-- Columna izquierda: imagen -->
      <div class="col-lg-5 mb-5">
        <img
          src="@/assets/logo.png"
          alt="Imagen formulario"
          class="img-fluid rounded"
          style="max-height: 500px; object-fit: cover;"
        />
      </div>

      <!-- Columna derecha: formulario -->
      <div class="col-lg-7">
        <h3 class="fw-bold mb-4">Escríbenos</h3>
        <form ref="form" @submit.prevent="sendEmail" id="formulario-contacto">
          <div class="row g-3">
            <div class="col-md-6 position-relative">
              <i class="bi bi-person"></i>
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="nombre"
                  name="username"
                  placeholder="Full Name"
                  required
                />
                <label for="nombre">Nombre completo</label>
              </div>
            </div>
            <div class="col-md-6 position-relative">
              <i class="bi bi-envelope"></i>
              <div class="form-floating">
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  required
                />
                <label for="email">Email</label>
              </div>
            </div>
            <div class="col-md-6 position-relative">
              <i class="bi bi-telephone"></i>
              <div class="form-floating">
                <input
                  type="tel"
                  class="form-control"
                  id="telefono"
                  name="user_phone"
                  placeholder="Phone Number"
                />
                <label for="telefono">Número de teléfono</label>
              </div>
            </div>
            <div class="col-md-6 position-relative">
              <i class="bi bi-chat-left-text"></i>
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  id="asunto"
                  name="subject"
                  placeholder="Subject"
                />
                <label for="asunto">Asunto</label>
              </div>
            </div>
            <div class="col-12 position-relative">
              <i class="bi bi-pencil-square"></i>
              <div class="form-floating">
                <textarea
                  class="form-control"
                  placeholder="Your Message"
                  id="mensaje"
                  name="message"
                  style="height: 150px;"
                  required
                ></textarea>
                <label for="mensaje">Mensaje</label>
              </div>
            </div>
          </div>
          <hr class="my-4" />
          <button
              type="submit"
              class="btn rounded-pill fw-bold px-4 py-2"
              style="background-color: #890b04; color: white;"
            >
            Enviar mensaje
          </button>
          <div class="mt-3"></div>
        </form>
      </div>
    </div>

    <!-- Toast de éxito -->
    <div
      class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-4"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref="successToast"
      style="z-index: 9999;"
    >
      <div class="d-flex">
        <div class="toast-body">
          ¡Mensaje enviado correctamente!
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>

    <!-- Información de contacto debajo, opcional -->
    <div class="row mt-5">
      <div class="col-12">
        <h5 class="fw-bold mb-3">Información de Contacto</h5>
        <ul class="list-unstyled">
          <li class="mb-3">
            <i class="bi bi-geo-alt-fill me-2"></i>
            Las Palmas de Gran Canarias, Vecindario
          </li>
          <li class="mb-3">
            <i class="bi bi-telephone-fill me-2"></i>602 55 8888
          </li>
          <li class="mb-3">
            <i class="bi bi-printer-fill me-2"></i>602 55 8888
          </li>
          <li class="mb-3">
            <i class="bi bi-envelope-fill me-2"></i>admin@uideck.com
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
</style>