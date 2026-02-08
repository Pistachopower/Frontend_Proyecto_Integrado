import { defineStore } from 'pinia'
import api from '@/services/axiosRequest'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isLoading: false,
    errorMessage: null,
    user: null,
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
  }),

  actions: {
    // Verificar si el usuario está autenticado
    async checkAuthStatus() {
      // Si hay token, intentamos verificar
      if (this.accessToken) {
        try {
          const response = await api.get('auth/status/')
          this.isLoggedIn = response.data.is_authenticated
          if (response.data.user) {
            this.user = response.data.user
          }
        } catch (error) {
          console.error('Error verificando autenticación:', error)
          // Si falla, intentar refresh o limpiar
          if (error.response?.status === 401) {
            await this.tryRefreshToken()
          } else {
            this.isLoggedIn = false
          }
        }
      } else {
        this.isLoggedIn = false
      }
    },

    // Guardar tokens en localStorage y state
    setTokens(access, refresh) {
      this.accessToken = access
      this.refreshToken = refresh
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
    },

    // Limpiar tokens
    clearTokens() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },



    // Iniciar sesión
    async login(username, password) {
      this.errorMessage = null
      this.isLoading = true

      try {
        
        const response = await api.post('login/', {
          username,
          password,
        })

        const data = response.data

        // Guardar tokens JWT
        this.setTokens(data.access, data.refresh)
        
        // Guardar datos del usuario
        this.user = data.user
        this.isLoggedIn = data.is_authenticated

      } catch (error) {
        this.isLoggedIn = false
        console.error('Error en el login:', error)
        this.errorMessage = error.response?.data?.error || 'Usuario o contraseña incorrectos.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Cerrar sesión
    async logout() {
      try {
        await api.post('logout/', {
          refresh: this.refreshToken
        })
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      } finally {
        // Siempre limpiar tokens aunque falle la petición
        this.clearTokens()
        this.isLoggedIn = false
      }
    },
  },
})

