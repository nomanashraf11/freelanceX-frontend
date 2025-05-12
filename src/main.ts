import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/css/main.css";
import Toast from "./plugin/toast";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast);
app.mount("#app");
