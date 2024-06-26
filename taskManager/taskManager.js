import '../src/assets/css/reset.css'
import 'animate.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import manager from 'manager/taskManager.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const pinia = createPinia()
const app = createApp(manager)

app.use(pinia)
app.use(ElementPlus)
// app.use(router)
app.mount('#task-manager-root')
