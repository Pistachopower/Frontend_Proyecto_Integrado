<script setup>
import { ref, watch, nextTick } from 'vue';
import api from '../services/axiosRequest';

const openModal = ref(false);
const userInput = ref('');
const messages = ref([]);
const chatInput = ref(null);
const messagesContainer = ref(null);
const conversationHistory = ref([]); // [{user: "...", bot: "..."}]

// async function sendMessage() {
// 	const pregunta = userInput.value.trim();
// 	if (!pregunta) return;
// 	messages.value.push({ text: pregunta, from: 'user' });
// 	userInput.value = '';
// 	try {
// 		const res = await api.post('chatbot/', { pregunta });
// 		messages.value.push({ text: res.data.respuesta, from: 'bot' });
// 	} catch (e) {
// 		messages.value.push({ text: 'Error al conectar con el chatbot.', from: 'bot' });
// 	}
// 	nextTick(() => {
// 		const el = messagesContainer.value;
// 		if (el) el.scrollTop = el.scrollHeight;
// 	});
// }


async function sendMessage() {
    const pregunta = userInput.value.trim();
    if (!pregunta) return;
    messages.value.push({ text: pregunta, from: 'user' });
    userInput.value = '';

    // Prepara el historial para el backend
    const history = conversationHistory.value;

    try {
        const res = await api.post('chatbot/', {
            message: pregunta,
            history: history
        });
        const respuesta = res.data.response || res.data.respuesta || 'Sin respuesta';
        messages.value.push({ text: respuesta, from: 'bot' });

        // Añade el intercambio al historial
        conversationHistory.value.push({ user: pregunta, bot: respuesta });
    } catch (e) {
        messages.value.push({ text: 'Error al conectar con el chatbot.', from: 'bot' });
    }
    nextTick(() => {
        const el = messagesContainer.value;
        if (el) el.scrollTop = el.scrollHeight;
    });
}

watch(openModal, (val) => {
	if (val) {
		// (Mensaje de bienvenida eliminado a petición del usuario)
		nextTick(() => {
			if (chatInput.value) {
				chatInput.value.focus();
			}
		});
	}
});
</script>



<template>
	<div>
		<!-- Botón flotante Bootstrap -->
		<button class="btn btn-danger rounded-circle chatbot-fab d-flex align-items-center justify-content-center shadow" @click="openModal = true">
			<i class="bi bi-chat-dots" style="font-size: 1.7rem;"></i>
		</button>

		<!-- Modal Bootstrap -->
		<div class="modal fade show" style="display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); z-index: 2000;" v-if="openModal">
			<!-- Fondo para cerrar modal (detrás del modal) -->
			<div class="modal-backdrop fade show" @click="openModal = false" style="position: fixed;"></div>
			<div class="modal-dialog chatbot-modal-centered" style="margin: 0; max-width: 500px; width: 100vw; z-index: 2001;" @click.stop>
				<div class="modal-content chatbot-modal-content">
					<div class="modal-header bg-danger text-white py-2 px-3">
						<h5 class="modal-title mb-0">Chatbot</h5>
                        <!--<button type="button" class="btn-close btn-close-white" aria-label="Cerrar" @click="openModal.value = false"></button>-->
						<button type="button" class="btn-close btn-close-white" aria-label="Cerrar" @click="openModal = false"></button>
					</div>
					<div class="modal-body p-3 chatbot-modal-body" ref="messagesContainer">
						<div v-for="(msg, idx) in messages" :key="idx" :class="['mb-3', msg.from === 'user' ? 'text-end' : 'text-start']">
							<span :class="msg.from === 'user' ? 'chatbot-user-msg' : 'chatbot-bot-msg'">
								<i v-if="msg.from === 'user'" class="bi bi-person-circle me-1"></i>
								<i v-else class="bi bi-robot me-1"></i>
								{{ msg.text }}
							</span>
						</div>
					</div>
					<form class="modal-footer py-3 px-3 gap-2 chatbot-modal-footer" @submit.prevent="sendMessage">
						<input ref="chatInput" v-model="userInput" type="text" class="form-control chatbot-input-field" placeholder="Escribe tu mensaje..." autocomplete="off" autofocus />
						<button type="submit" class="btn btn-primary d-flex align-items-center chatbot-send-btn">
							<i class="bi bi-send me-1"></i> Enviar
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.chatbot-fab {
	position: fixed;
	left: 24px;
	bottom: 24px;
	width: 56px;
	height: 56px;
	z-index: 1055;
}
.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 1050;
}
.chatbot-modal-centered {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 80vh;
}
.chatbot-modal-content {
	background: #dc3545;
	border-radius: 16px;
	box-shadow: 0 8px 32px rgba(0,0,0,0.25);
	min-width: 350px;
	max-width: 500px;
	width: 100%;
}
.chatbot-modal-body {
	background: #fff;
	max-height: 50vh;
	overflow-y: auto;
	border-radius: 0 0 12px 12px;
}
.chatbot-modal-footer {
	border-top: 1px solid #eee;
	background: #fff;
	border-radius: 0 0 12px 12px;
}
.chatbot-user-msg {
	display: inline-block;
	background: #fff;
	color: #dc3545;
	border: 2px solid #dc3545;
	border-radius: 16px 16px 4px 16px;
	padding: 8px 14px;
	font-weight: 500;
	margin-left: auto;
	max-width: 80%;
	word-break: break-word;
}
.chatbot-bot-msg {
	display: inline-block;
	background: #dc3545;
	color: #fff;
	border-radius: 16px 16px 16px 4px;
	padding: 8px 14px;
	font-weight: 500;
	margin-right: auto;
	max-width: 80%;
	word-break: break-word;
}
.chatbot-input-field {
	font-size: 1.1rem;
	border-radius: 8px;
	border: 1.5px solid #dc3545;
}
.chatbot-send-btn {
	font-size: 1.1rem;
	border-radius: 8px;
}
</style>

