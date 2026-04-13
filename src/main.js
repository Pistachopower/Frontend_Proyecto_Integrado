import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap-icons/font/bootstrap-icons.css'
import { inicializarTracking } from '@/services/trackingService'

const app = createApp(App)

inicializarTracking()

app.use(createPinia())   
app.use(router)
app.mount('#app')