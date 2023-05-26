import {createApp} from "vue";
import App from "./App.vue";
import appPlugins from "@/compoments/app-plugins";
import {createPinia} from "pinia";

const app = createApp(App)
app.use(appPlugins)
app.use(createPinia())
app.mount("#app");
