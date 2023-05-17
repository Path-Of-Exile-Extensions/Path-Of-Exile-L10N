import {createApp} from 'vue'
import App from './App.vue'
import i18n from "./i18n";
import {DB} from "@poel10n/extra";
await DB.Instance.initialize();

const app = createApp(App)
app.use(i18n)
app.mount('#app')
