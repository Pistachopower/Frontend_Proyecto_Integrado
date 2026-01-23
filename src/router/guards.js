// import { useAuthStore } from '../stores/authStore.js'

// // Guard: Solo vendedores pueden acceder
// export const requireVendedor = (to, from, next) => {
//   const authStore = useAuthStore()
  
//   if (authStore.isVendedor) {
//     next() // Permite acceso
//   } else if (!authStore.isLoggedIn) {
//     next('/login') // No autenticado → Login
//   } else {
//     next('/') // Autenticado pero no es vendedor → Home
//   }
// }

// // Guard: Solo clientes pueden acceder
// export const requireCliente = (to, from, next) => {
//   const authStore = useAuthStore()
  
//   if (authStore.isCliente) {
//     next() // Permite acceso
//   } else if (!authStore.isLoggedIn) {
//     next('/login') // No autenticado → Login
//   } else {
//     next('/') // Autenticado pero no es cliente → Home
//   }
// }

// // Guard: Cualquier usuario autenticado
// export const requireAuth = (to, from, next) => {
//   const authStore = useAuthStore()
  
//   if (authStore.isLoggedIn) {
//     next() // Permite acceso
//   } else {
//     next('/login') // No autenticado → Login
//   }
// }