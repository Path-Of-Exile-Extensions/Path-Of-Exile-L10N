import {createApp} from 'vue'
import App from './App.vue'
import i18n from "./i18n";
import { createPinia } from 'pinia'
import elementPlus from "@/compoments/element-plus";

const app = createApp(App)
app.use(elementPlus)
app.use(i18n)
app.use(createPinia())
app.mount('#app')
