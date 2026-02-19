import { api } from "./api";

/**
 * LooseProductInDay Service
 *
 * Handles API communication for loose products in day.
 *
 * API Endpoints:
 * - GET /looseproductsinday?dayId={id} - Returns array of meal.LooseProductInDay
 * - GET /looseproductsinday/{id} - Returns single meal.LooseProductInDay
 * - POST /looseproductsinday - Returns {id: integer}
 * - PUT /looseproductsinday - Returns 200 with no body
 * - DELETE /looseproductsinday/{id} - Returns 200
 *
 * LooseProductInDay structure:
 * {
 *   id: integer,
 *   dayId: integer,
 *   product: meal.Product,
 *   weight: number (grams)
 * }
 */

const looseProductInDayService = {
  /**
   * Get all loose products for a specific day
   * @param {number} dayId - MealInDay ID
   * @returns {Promise<Array>} Array of LooseProductInDay objects
   */
  async getLooseProductsByDay(dayId) {
    const response = await api.get(`/looseproductsinday?dayId=${dayId}`);
    return response.data;
  },

  /**
   * Get single loose product by ID
   * @param {number} id - LooseProductInDay ID
   * @returns {Promise<Object>} LooseProductInDay object
   */
  async getLooseProduct(id) {
    const response = await api.get(`/looseproductsinday/${id}`);
    return response.data;
  },

  /**
   * Create new loose product in day
   * @param {Object} looseProductData - {dayId, product: {id}, weight}
   * @returns {Promise<Object>} Response with {id: integer}
   */
  async createLooseProductInDay(looseProductData) {
    const response = await api.post("/looseproductsinday", looseProductData);
    return response.data; // Returns {id: integer}
  },

  /**
   * Update existing loose product
   * @param {Object} looseProductData - LooseProductInDay data (must include id)
   * @returns {Promise<Object>} Response (200 with no body)
   */
  async updateLooseProductInDay(looseProductData) {
    const response = await api.put("/looseproductsinday", looseProductData);
    return response.data;
  },

  /**
   * Delete loose product
   * @param {number} id - LooseProductInDay ID
   * @returns {Promise<Object>} Response (200)
   */
  async deleteLooseProduct(id) {
    const response = await api.delete(`/looseproductsinday/${id}`);
    return response.data;
  },
};

export { looseProductInDayService };
