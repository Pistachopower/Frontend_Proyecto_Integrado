import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isLoading: false,
    errorMessage: null,
    user: null, // ← AÑADE ESTO



  }),



  actions: {
    // Verificar si el usuario está autenticado (llamando al backend)
    async checkAuthStatus() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/auth/status/', {
          method: 'GET',
          credentials: 'include', // Envía las cookies automáticamente
        })

        if (response.ok) {
          const data = await response.json()
          // Restructurar según lo que devuelva tu endpoint
          this.user = {
            username: data.user || data.username,
            email: data.email,
            tipo_usuario: data.tipo_usuario,
            perfil: data.perfil,
          }
          this.isLoggedIn = true
          console.log('Usuario autenticado')
        } else {
          this.isLoggedIn = false
          this.user = null

          console.log('Usuario no autenticado')
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        this.isLoggedIn = false
        this.user = null
      }
    },

    // Obtener una cookie por nombre
    getCookie(name) {
      let cookieValue = null
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim()
          if (cookie.substring(0, name.length + 1) === name + '=') {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
            break
          }
        }
      }
      return cookieValue
    },

    // Iniciar sesión
    async login(username, password) {
      this.errorMessage = null
      this.isLoading = true

      try {
        const csrftoken = this.getCookie('csrftoken')
        const response = await fetch('http://localhost:8000/api/v1/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
          },
          credentials: 'include',
          body: JSON.stringify({
            username,
            password,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Usuario o contraseña incorrectos.')
        }

        const data = await response.json()

        //Log para ver exactamente qué devuelve el backend
        console.log('🔐 Respuesta completa del backend:', data)

        //Mapear de forma más robusta
        this.user = {
          username: data.username || data.user, // Algunos backends devuelven 'user', otros 'username'
          email: data.email || '',
          tipo_usuario: data.tipo_usuario || data.tipoUsuario || '', // Algunos con underscore, otros camelCase
          perfil: data.perfil || data.profile || null,
          id: data.id || null, // Asegúrate de que tienes el ID
        }

        console.log('✅ Usuario logueado:', this.user)

        // Login exitoso
        this.isLoggedIn = true




      } catch (error) {
        console.error('Error en el login:', error)
        this.errorMessage = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Cerrar sesión
    async logout() {
      try {
        const csrftoken = this.getCookie('csrftoken')
        await fetch('http://localhost:8000/api/v1/logout/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
          },
          credentials: 'include',
        })

        //Limpiar datos al logout
        this.isLoggedIn = false

        this.user = null // ← LIMPIA EL USUARIO


      } catch (error) {
        console.error('Error al cerrar sesión:', error)
        throw error
      }
    },
  },
})

