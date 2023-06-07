import {createApp} from "vue";
import App from "./App.vue";
import appPlugins from "@/components/app-plugins";
import {createPinia} from "pinia";
import {Ext, ExtMessagePortID} from "@poe-vela/core/browser";
import {globalx} from "@/classifed/globalx";

const port = Ext.message.connect(ExtMessagePortID.ContentScript)
globalx.port = port;

const app = createApp(App)
app.use(appPlugins)
app.use(createPinia())
app.mount("#app");
