import { defineStore } from 'pinia';
import axios from '../services/axiosRequest';

export const useCarritoStore = defineStore('carrito', {
	state: () => ({
		items: [], // [{ id, cantidad, nombre, imagen, precio, precio_total_piezas }]
		precioTotal: 0
	}),
	actions: {
		async agregarProducto(pieza_id, cantidad) {
			// Agregar a la API
			try {
				const payload = { pieza_id, cantidad };
				await axios.post('/carrito', payload);
				// Actualizar el carrito completo después de agregar
				await this.obtenerCarrito();
			} catch (error) {
				// Manejo de error (puedes personalizarlo)
				console.error('Error al agregar producto al carrito:', error);
				throw error;
			}
		},

		async obtenerCarrito() {
			try {
				const response = await axios.get('/carrito');
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
