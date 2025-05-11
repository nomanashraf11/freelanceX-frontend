import { defineStore } from "pinia";
import { postAPI } from "../utils/api";
import { useUserStore } from "./user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || (null as string | null),
    isAuthenticated: false,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await postAPI<{ token: string }>(
          "/auth/login",
          { email, password },
          { is_auth_required: false }
        );
        this.token = response.data.token;
        localStorage.setItem("token", this.token);
        this.isAuthenticated = true;
        const userStore = useUserStore();
        await userStore.fetchUser();
      } catch (error) {
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem("token");
        console.log(error);
      }
    },
    async register(username: string, email: string, password: string) {
      try {
        await postAPI<{ token: string }>(
          "/auth/register",
          { username, email, password },
          { is_auth_required: false }
        );
      } catch (error) {
        console.log(error);
      }
    },
    logout() {
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
      const userStore = useUserStore();
      userStore.clearUser();
    },
  },
});
