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
   * Backend: POST /login
   * Check swagger.yaml for exact request/response format
   */
  async login(email, password) {
    try {
      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem("authToken", token);

      return { token, user };
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
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
};
