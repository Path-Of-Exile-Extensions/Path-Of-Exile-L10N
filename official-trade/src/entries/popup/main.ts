import {createApp} from 'vue'
import App from './App.vue'
import i18n from "./i18n";
import { createPinia } from 'pinia'
import appPlugins from "@/components/app-plugins";
import {Ext, ExtMessageDirections, ExtMessagePortID} from "@poe-vela/core/ext";

Ext.message.connect(ExtMessagePortID.Popup, ExtMessageDirections.Runtime)

const app = createApp(App)
app.use(appPlugins)

app.use(i18n)
app.use(createPinia())
app.mount('#app')
