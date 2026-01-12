import { defineStore } from 'pinia';
import axios from '../services/axiosRequest';

export const useCarritoStore = defineStore('carrito', {
	state: () => ({
		items: [], // [{ id, cantidad, nombre, imagen, precio, precio_total_piezas }]
		precioTotal: 0
	}),
	actions: {
		async agregarOActualizar(pieza_id, cantidad) {
			// Agregar o actualizar la cantidad en la API
			try {
				const payload = { pieza_id, cantidad };
				await axios.post('/carrito/', payload);
				// Actualizar el carrito completo después de agregar/actualizar
				await this.obtenerCarrito();
			} catch (error) {
				// Manejo de error (puedes personalizarlo)
				console.error('Error al agregar/actualizar producto en el carrito:', error);
				throw error;
			}
		},

		async eliminarProducto(pieza_id) {
			// Eliminar de la API
			try {
				await axios.delete(`/carrito/${pieza_id}/`);
				// Actualizar el carrito completo después de eliminar
				await this.obtenerCarrito();
			} catch (error) {
				console.error('Error al eliminar producto del carrito:', error);
				throw error;
			}
		},

		async obtenerCarrito() {
			try {
				const response = await axios.get('/carrito/');
				// Se espera { items: [...], precio_total: number }
				this.items = response.data.items;
				this.precioTotal = response.data.precio_total;
				return response.data;
			} catch (error) {
				console.error('Error al obtener el carrito:', error);
				throw error;
			}
		}
	}
});
