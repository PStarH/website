import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router'
import naive from 'naive-ui'

createApp(App).use(naive).use(router).mount('#app')
