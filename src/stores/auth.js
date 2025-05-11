import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export const useAuthStore = defineStore("auth", () => {
  const toast = useToast();
  const router = useRouter();
  const user = ref(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref(null);

  // Initialize from localStorage
  const initialize = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
      isAuthenticated.value = true;
    }
  };

  // Login function
  const login = async (credentials) => {
    loading.value = true;
    error.value = null;

    try {
      const response = {
        data: {
          user: {
            id: "123",
            firstName: credentials.email.split("@")[0],
            lastName: "Doe",
            email: credentials.email,
            role: "FREELANCER", // Default role for demo
            bio: "Sample bio",
          },
          token: "mock-token",
        },
      };

      user.value = response.data.user;
      isAuthenticated.value = true;
      localStorage.setItem("user", JSON.stringify(user.value));
      localStorage.setItem("token", response.data.token);

      // Redirect based on role
      switch (user.value.role) {
        case "ADMIN":
          router.push({ name: "admin-dashboard" });
          break;
        case "CLIENT":
          router.push({ name: "client-dashboard" });
          break;
        case "FREELANCER":
          router.push({ name: "freelancer-dashboard" });
          break;
        default:
          router.push({ name: "dashboard" });
      }

      toast.success("Login successful!");
    } catch (err) {
      error.value = err.response?.data?.message || "Login failed";
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Register function
  const register = async (userData) => {
    loading.value = true;
    error.value = null;

    try {
      // Replace with actual API call
      // const response = await axios.post('/api/auth/register', userData)

      // Mock response - remove when real API is ready
      const response = {
        data: {
          user: userData,
          token: "mock-token",
        },
      };

      user.value = response.data.user;
      isAuthenticated.value = true;
      localStorage.setItem("user", JSON.stringify(user.value));
      localStorage.setItem("token", response.data.token);

      // Redirect based on role
      switch (user.value.role) {
        case "ADMIN":
          router.push({ name: "admin-dashboard" });
          break;
        case "CLIENT":
          router.push({ name: "client-dashboard" });
          break;
        case "FREELANCER":
          router.push({ name: "freelancer-dashboard" });
          break;
        default:
          router.push({ name: "dashboard" });
      }

      toast.success("Registration successful!");
    } catch (err) {
      error.value = err.response?.data?.message || "Registration failed";
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Logout function
  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push({ name: "login" });
    toast.success("Logged out successfully");
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    initialize,
    login,
    register,
    logout,
  };
});
