import { defineStore } from "pinia";
import { getAPI, postAPI } from "../utils/api";
import type { RegisterUser, User } from "../types/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    users: [] as User[],
    token: localStorage.getItem("token") || (null as string | null),
    isAuthenticated: false,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await postAPI<{ token: string }>(
          "/auth/login",
          { email, password },
          { isAuthRequired: false }
        );
        console.log(response.status);
        if (response.status !== 200) {
          throw new Error(response?.data?.message || "Login failed");
        }
        this.token = response.data.token;
        localStorage.setItem("token", this.token);
        await this.fetchUser();
      } catch (error) {
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem("token");
        console.error(error);
        throw new Error(error?.message || "Login failed");
      }
    },

    async register(user: RegisterUser) {
      try {
        await postAPI<{ token: string }>("/auth/register", user, {
          isAuthRequired: false,
        });
      } catch (error) {
        throw new Error(error?.message || "Register failed");
        console.error("Registration failed:", error);
      }
    },

    logout() {
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
      this.user = null;
    },

    async fetchUser() {
      try {
        const response = await getAPI<User>("/user/profile");
        this.user = response.data;
        this.isAuthenticated = true;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
        this.token = null;
        localStorage.removeItem("token");
        console.error(error);
      }
    },

    async fetchUsers() {
      try {
        const response = await getAPI<User[]>("/admin/users");
        this.users = response.data;
      } catch (error) {
        this.users = [];
        console.error("Failed to fetch users:", error);
      }
    },
  },
});
