/**
 * Authentication service
 * Backend: POST /login
 * Swagger: ../nourishment_20/docs/swagger.yaml
 * Handler: ../nourishment_20/internal/api/ (check for auth handler)
 */
import { api } from "./api";

export const authService = {
  /**
   * Login user
   * Backend: POST /login (without /api prefix)
   * Request: { login: string, password: string }
   * Response: { token: string, user?: object }
   */
  async login(username, password) {
    console.log("🔍 authService.login called with:", { username, password: password ? "***" : undefined });

    try {
      // Try main login endpoint first with username format
      const requestBody = { login: username, password };
      console.log("📤 Sending request to /login:", { ...requestBody, password: "***" });

      const response = await api.post("/login", requestBody);

      // Handle different response formats
      const data = response.data;

      // Format 1: { token, user }
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        return { token: data.token, user: data.user };
      }

      // Format 2: { access_token, user }
      if (data.access_token) {
        localStorage.setItem("authToken", data.access_token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        return { token: data.access_token, user: data.user };
      }

      // Format 3: Direct token string
      if (typeof data === "string") {
        localStorage.setItem("authToken", data);
        return { token: data, user: null };
      }

      throw new Error("Invalid response format from server");
    } catch (error) {
      console.error("Login failed:", error);

      // Try alternative endpoint if first fails (unlikely for this backend)
      if (error.response?.status === 404) {
        try {
          const altResponse = await api.post("/auth/login", {
            username,
            password,
          });

          const data = altResponse.data;
          if (data.token || data.access_token) {
            const token = data.token || data.access_token;
            localStorage.setItem("authToken", token);
            if (data.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
            }
            return { token, user: data.user };
          }
        } catch (altError) {
          console.error("Alternative login endpoint also failed:", altError);
        }
      }

      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  },

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem("authToken");
  },

  /**
   * Get stored user
   */
  getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
