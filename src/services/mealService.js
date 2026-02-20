/**
 * Meal Service
 * Handles all meal-related API calls
 *
 * Backend: GET /meals, POST /meals, PUT /meals, DELETE /meals/:id
 * Swagger: swagger/swagger.yaml
 * Model: meal.Meal {id: integer, name: string, recipe: string, productsInMeal: array}
 */

import { api } from "./api";

const mealService = {
  /**
   * Fetch all meals
   * @returns {Promise<Array>} Array of meals
   */
  async getMeals() {
    try {
      const response = await api.get("/meals");
      return response.data;
    } catch (error) {
      console.error("Get meals error:", error);
      throw error;
    }
  },

  /**
   * Fetch single meal by ID
   * @param {string|number} id - Meal ID
   * @returns {Promise<Object>} Meal object
   */
  async getMeal(id) {
    try {
      const response = await api.get(`/meals/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get meal error:", error);
      throw error;
    }
  },

  /**
   * Create new meal
   * @param {Object} mealData - Meal data {name: string, recipe: string, productsInMeal: array}
   * @returns {Promise<Object>} Response with {id: number}
   */
  async createMeal(mealData) {
    try {
      const response = await api.post("/meals", mealData);
      // Backend returns {id: number}, not full meal
      return response.data;
    } catch (error) {
      console.error("Create meal error:", error);
      throw error;
    }
  },

  /**
   * Update existing meal
   * @param {Object} mealData - Updated meal data (must include ID)
   * @returns {Promise<void>} Returns 200 with no body on success
   */
  async updateMeal(mealData) {
    try {
      const response = await api.put("/meals", mealData);
      return response.data; // Usually empty/null on 200 success
    } catch (error) {
      console.error("Update meal error:", error);
      throw error;
    }
  },

  /**
   * Delete meal
   * @param {string|number} id - Meal ID
   * @returns {Promise<void>}
   */
  async deleteMeal(id) {
    try {
      await api.delete(`/meals/${id}`);
    } catch (error) {
      console.error("Delete meal error:", error);
      throw error;
    }
  },
};

export { mealService };
