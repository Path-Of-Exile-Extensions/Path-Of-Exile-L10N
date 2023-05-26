import {createApp} from "vue";
import App from "./App.vue";
import elementPlus from "@/compoments/element-plus";

const app = createApp(App)
app.use(elementPlus)
app.mount("#app");
