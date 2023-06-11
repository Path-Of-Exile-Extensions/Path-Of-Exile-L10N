import {createApp} from 'vue'
import App from './App.vue'
import i18n from "./i18n";
import {createPinia} from 'pinia'
import appPlugins from "@/components/app-plugins";
import {Ext, ExtMessagePortID} from "@poe-vela/core/browser";
import {globalx} from "@/classifed/globalx";

const port = Ext.message.connect(ExtMessagePortID.Popup)
globalx.port = port;

const app = createApp(App)
app.use(appPlugins)

app.use(i18n)
app.use(createPinia())
app.mount('#app')
