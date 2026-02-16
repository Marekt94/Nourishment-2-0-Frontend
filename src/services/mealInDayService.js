import { api } from "./api";

/**
 * MealInDay Service
 *
 * Handles API communication for meals in day (daily meal plans).
 *
 * API Endpoints:
 * - GET /mealsinday - Returns array of meal.MealInDay
 * - GET /mealsinday/{id} - Returns single meal.MealInDay
 * - POST /mealsinday - Returns {id: integer}
 * - PUT /mealsinday - Returns 200 with no body
 * - DELETE /mealsinday/{id} - Returns 200
 *
 * MealInDay structure:
 * {
 *   id: integer,
 *   name: string,
 *   for5Days: boolean,
 *   breakfast: meal.Meal,
 *   secondBreakfast: meal.Meal,
 *   lunch: meal.Meal,
 *   afternoonSnack: meal.Meal,
 *   dinner: meal.Meal,
 *   supper: meal.Meal,
 *   factorBreakfast: float,
 *   factorSecondBreakfast: float,
 *   factorLunch: float,
 *   factorAfternoonSnack: float,
 *   factorDinner: float,
 *   factorSupper: float
 * }
 */

const mealInDayService = {
  /**
   * Get all meals in day
   * @returns {Promise<Array>} Array of MealInDay objects
   */
  async getMealsInDay() {
    const response = await api.get("/mealsinday");
    return response.data;
  },

  /**
   * Get single meal in day by ID
   * @param {number} id - MealInDay ID
   * @returns {Promise<Object>} MealInDay object
   */
  async getMealInDay(id) {
    const response = await api.get(`/mealsinday/${id}`);
    return response.data;
  },

  /**
   * Create new meal in day
   * @param {Object} mealInDayData - MealInDay data
   * @returns {Promise<Object>} Response with {id: integer}
   */
  async createMealInDay(mealInDayData) {
    const response = await api.post("/mealsinday", mealInDayData);
    return response.data; // Returns {id: integer}
  },

  /**
   * Update existing meal in day
   * @param {Object} mealInDayData - MealInDay data (must include id)
   * @returns {Promise<Object>} Response (200 with no body)
   */
  async updateMealInDay(mealInDayData) {
    const response = await api.put("/mealsinday", mealInDayData);
    return response.data;
  },

  /**
   * Delete meal in day
   * @param {number} id - MealInDay ID
   * @returns {Promise<Object>} Response (200)
   */
  async deleteMealInDay(id) {
    const response = await api.delete(`/mealsinday/${id}`);
    return response.data;
  },
};

export { mealInDayService };
