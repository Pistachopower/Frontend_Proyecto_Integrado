import { defineStore } from 'pinia';
import axios from '../services/axiosRequest';

export const useCarritoStore = defineStore('carrito', {
	state: () => ({
		items: [], // [{ id, cantidad, nombre, imagen, precio, precio_total_piezas }]
		precioTotal: 0,
		es_primer_pedido: false,
		total_original_sin_descuento: 0,
		descuento_bienvenida: 0

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

				this.es_primer_pedido = response.data.es_primer_pedido;

				this.total_original_sin_descuento = response.data.total_original_sin_descuento;

				this.descuento_bienvenida = response.data.descuento_bienvenida;
				
				return response.data;
			} catch (error) {
				console.error('Error al obtener el carrito:', error);
				throw error;
			}
		},

		async finalizarCompra(direccion_envio, metodo_pago_id = null) {
			try {
				const payload = { direccion_envio };
				
				// Solo incluir metodo_pago_id si se proporciona
				if (metodo_pago_id) {
					payload.metodo_pago_id = metodo_pago_id;
				}
				
				const response = await axios.post('/carrito/finalizar/', payload);
				
				// Limpiar el carrito local después de finalizar
				this.items = [];
				this.precioTotal = 0;
				this.es_primer_pedido = false;
				this.total_original_sin_descuento = 0;
				this.descuento_bienvenida = 0;
				return response.data;
			} catch (error) {
				console.error('Error al finalizar la compra:', error);
				throw error;
			}
		}
	}
});
