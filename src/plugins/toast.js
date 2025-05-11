import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default {
  install: (app) => {
    app.config.globalProperties.$toast = useToast();
  },
};
