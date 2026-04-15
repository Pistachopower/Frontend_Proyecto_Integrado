import posthog from 'posthog-js';
import axios from 'axios';
import api from '@/services/axiosRequest';

// Catalogo de eventos compartido entre frontend y backend.
// Mantener estos nombres sincronizados evita errores de validacion en DRF.
export const EVENTOS = {
  PRODUCTO_VISTO: 'producto_visto',
  BUSQUEDA_REALIZADA: 'busqueda_realizada',
  AGREGADO_CARRITO: 'agregado_carrito',
  COMPRA_COMPLETADA: 'compra_completada' //OJO: No está implementada
};

// Clave usada para persistir el ID de sesion en el navegador agrupar los eventos del usuario en el backend
// (Puedes verlo en navegador, almacenamiento local). 
const SESSION_STORAGE_KEY = 'evento_cliente_sesion_id';

// Bandera para saber si PostHog ya fue inicializado correctamente.
let posthogInicializado = false;

// Cliente HTTP dedicado para tracking: timeout corto y sin interceptores.
// Asi evitamos que un fallo del endpoint de eventos bloquee la UX.
const trackingHttp = axios.create({ //si se quita la aplicacion se congela en modo debug
  baseURL: api.defaults.baseURL, //Construye la url completa para el backend
  timeout: 5000
});

// Inicializa PostHog con variables de entorno de Vue.
// Se llama una vez al arrancar la app (main.js).
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

// Genera un ID de sesion unico para tracking anonimo.
// Luego obtenerSesionId lo guarda/reutiliza y ese valor se envia como sesion_id para agrupar eventos en backend.
function generarSesionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback para navegadores sin crypto.randomUUID.
  return `ses_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function obtenerSesionId() {
  // Obtiene el ID de sesion guardado; si no existe, genera uno nuevo y lo persiste en localStorage.
  // Este valor se reutiliza en cada evento como sesion_id para agrupar comportamiento en backend.
  const sesionExistente = localStorage.getItem(SESSION_STORAGE_KEY);
  
  if (sesionExistente) {
    return sesionExistente;
  }

  const nuevaSesion = generarSesionId();
  localStorage.setItem(SESSION_STORAGE_KEY, nuevaSesion);
  return nuevaSesion;
}

// Envia un evento al backend propio para guardarlo en EventoCliente.
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

// Esta es la función que los componentes llaman para registrar eventos.
// 1) arma payload estandar, 2) envia a PostHog, 3) envia a backend.
export async function trackEvento(nombreEvento, propiedades = {}, opciones = {}) {
  if (!nombreEvento) {
    return;
  }

  // Estructura comun que espera el endpoint DRF de tracking.
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
      
      if (process.env.NODE_ENV !== 'production') { //ejecuta esto solo si la app no está en producción
        console.warn('No se pudo enviar el evento a PostHog:', nombreEvento);
      }
    }
  }

  if (opciones.enviarBackend !== false) {
    // Envio al backend propio para metricas internas.
    // Fire-and-forget: no bloquea la UI aunque falle el endpoint.
    void enviarEventoABackend(payload);
  }
}

// Vincula eventos a un usuario autenticado en PostHog.
// Recomendado llamarlo despues del login.
// export function identificarUsuarioTracking(userId, propiedades = {}) {
//   if (!posthogInicializado || !userId) {
//     return;
//   }

//   posthog.identify(String(userId), propiedades);
// }

// // Limpia la identidad del usuario en PostHog.
// // Recomendado llamarlo en logout.
// export function resetTrackingUsuario() {
//   if (posthogInicializado) {
//     posthog.reset();
//   }
// }