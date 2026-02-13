/**
 * Category Service
 * Handles all category-related API calls
 *
 * Backend: GET /categories, POST /categories, PUT /categories, DELETE /categories/:id
 * Swagger: swagger/swagger.yaml
 * Model: meal.Category {id: integer, name: string}
 */

import { api } from "./api";

const categoryService = {
  /**
   * Fetch all categories
   * @returns {Promise<Array>} Array of categories
   */
  async getCategories() {
    try {
      const response = await api.get("/categories");
      console.log("📂 categoryService - Categories fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get categories error:", error);
      throw error;
    }
  },

  /**
   * Create new category
   * @param {Object} categoryData - Category data {name: string}
   * @returns {Promise<Object>} Response with {id: number}
   */
  async createCategory(categoryData) {
    try {
      const response = await api.post("/categories", categoryData);
      // Backend returns {id: number}, not full category
      return response.data;
    } catch (error) {
      console.error("Create category error:", error);
      throw error;
    }
  },

  /**
   * Update existing category
   * @param {Object} categoryData - Updated category data (must include ID)
   * @returns {Promise<void>} Returns 200 with no body on success
   */
  async updateCategory(categoryData) {
    try {
      const response = await api.put("/categories", categoryData);
      return response.data; // Usually empty/null on 200 success
    } catch (error) {
      console.error("Update category error:", error);
      throw error;
    }
  },

  /**
   * Delete category
   * @param {string|number} id - Category ID
   * @returns {Promise<void>}
   */
  async deleteCategory(id) {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      console.error("Delete category error:", error);
      throw error;
    }
  },
};

export { categoryService };
