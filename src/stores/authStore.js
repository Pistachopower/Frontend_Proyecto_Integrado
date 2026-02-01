import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isLoading: false,
    errorMessage: null,
  }),

  actions: {
    // Verificar si el usuario está autenticado (llamando al backend)
    async checkAuthStatus() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/auth/status/', {
          //const response = await fetch('http://34.238.73.57/api/v1/auth/status/', {
          method: 'GET',
          credentials: 'include', // Envía las cookies automáticamente
        })

        if (response.ok) {
          const data = await response.json()
          

          this.isLoggedIn = data.is_authenticated


        } else {
          this.isLoggedIn = false

        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        this.isLoggedIn = false
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
        //const response = await fetch('http://34.238.73.57/api/v1/login/', {
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


        
        // Login exitoso
        this.isLoggedIn = data.is_authenticated


      } catch (error) {
        this.isLoggedIn = false
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
         // await fetch('http://34.238.73.57/api/v1/logout/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
          },
          credentials: 'include',
        })

        //Limpiar datos al logout
        this.isLoggedIn = false

      } catch (error) {
        console.error('Error al cerrar sesión:', error)
        throw error
      }
    },
  },
})

