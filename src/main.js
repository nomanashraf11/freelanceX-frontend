wimport { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import Toast from "./plugins/toast";
import "./assets/main.css";

const app = createApp(App);

// All the middleware initiated 
app.use(createPinia());
app.use(router);
app.use(Toast);

app.mount("#app");
