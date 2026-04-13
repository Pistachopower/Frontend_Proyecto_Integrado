import posthog from 'posthog-js';
import axios from 'axios';
import api from '@/services/axiosRequest';

// Catalogo de eventos compartido entre frontend y backend.
export const EVENTOS = {
  PRODUCTO_VISTO: 'producto_visto',
  BUSQUEDA_REALIZADA: 'busqueda_realizada',
  AGREGADO_CARRITO: 'agregado_carrito',
  COMPRA_COMPLETADA: 'compra_completada'
};

const SESSION_STORAGE_KEY = 'evento_cliente_sesion_id';
let posthogInicializado = false;

// Cliente HTTP dedicado para tracking: timeout corto y sin interceptores.
// Asi evitamos que un fallo del endpoint de eventos bloquee la UX.
const trackingHttp = axios.create({
  baseURL: api.defaults.baseURL,
  timeout: 5000
});

function generarSesionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `ses_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function obtenerSesionId() {
  // Reutiliza la sesion para relacionar eventos anonimos del mismo navegador.
  const sesionExistente = localStorage.getItem(SESSION_STORAGE_KEY);
  if (sesionExistente) {
    return sesionExistente;
  }

  const nuevaSesion = generarSesionId();
  localStorage.setItem(SESSION_STORAGE_KEY, nuevaSesion);
  return nuevaSesion;
}

export function inicializarTracking() {
  const posthogKey = process.env.VUE_APP_POSTHOG_KEY;
  const posthogHost = process.env.VUE_APP_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!posthogKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('PostHog no se inicializo: falta VUE_APP_POSTHOG_KEY.');
    }
    return;
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    autocapture: false,
    capture_pageview: false,
    persistence: 'localStorage+cookie',
    person_profiles: 'identified_only'
  });

  posthogInicializado = true;
}

async function enviarEventoABackend(payload) {
  try {
    // Guarda el evento tambien en DRF para el dashboard interno.
    const token = localStorage.getItem('access_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await trackingHttp.post('eventos/track/', payload, { headers });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const detalle = error?.response?.data || error.message;
      console.warn('No se pudo registrar el evento en backend:', payload.nombre_evento, detalle);
    }
  }
}

export async function trackEvento(nombreEvento, propiedades = {}, opciones = {}) {
  if (!nombreEvento) {
    return;
  }

  const sesionId = obtenerSesionId();
  const payload = {
    nombre_evento: nombreEvento,
    sesion_id: sesionId,
    propiedades
  };

  if (posthogInicializado) {
    try {
      // Envio a PostHog para analitica y paneles.
      posthog.capture(nombreEvento, {
        ...propiedades,
        sesion_id: sesionId
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('No se pudo enviar el evento a PostHog:', nombreEvento);
      }
    }
  }

  if (opciones.enviarBackend !== false) {
    // Envio al backend propio para metricas internas.
    void enviarEventoABackend(payload);
  }
}

export function identificarUsuarioTracking(userId, propiedades = {}) {
  if (!posthogInicializado || !userId) {
    return;
  }

  posthog.identify(String(userId), propiedades);
}

export function resetTrackingUsuario() {
  if (posthogInicializado) {
    posthog.reset();
  }
}