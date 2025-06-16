import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router'
import naive from 'naive-ui'
import gsap from 'gsap'

createApp(App)
    .use(naive)
    .use(router)
    .use(gsap)
    .mount('#app')
