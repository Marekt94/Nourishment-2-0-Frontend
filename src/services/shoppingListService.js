import { api } from "./api";

/**
 * ShoppingList Service
 * 
 * Handles API communication for shopping lists and their products.
 */
const shoppingListService = {
  /**
   * Get all shopping lists
   * @returns {Promise<Array>}
   */
  async getShoppingLists() {
    const response = await api.get("/shopping-lists");
    return response.data;
  },

  /**
   * Get single shopping list with products
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async getShoppingList(id) {
    const response = await api.get(`/shopping-lists/${id}`);
    return response.data;
  },

  /**
   * Create new shopping list
   * @param {Object} listData 
   * @returns {Promise<Object>} {id: number}
   */
  async createShoppingList(listData) {
    const response = await api.post("/shopping-lists", listData);
    return response.data;
  },

  /**
   * Update shopping list metadata
   * @param {Object} listData 
   */
  async updateShoppingList(listData) {
    const response = await api.put("/shopping-lists", listData);
    return response.data;
  },

  /**
   * Generate shopping list from meal plans
   * @param {Object} requestData { name, mealPlans: [{mealInDayId, days}], looseProducts: [{productId, weight}] }
   * @returns {Promise<Object>} {id: number}
   */
  async generateShoppingList(requestData) {
    const response = await api.post("/shopping-lists/generate", requestData);
    return response.data;
  },

  /**
   * Delete shopping list
   * @param {number} id 
   */
  async deleteShoppingList(id) {
    const response = await api.delete(`/shopping-lists/${id}`);
    return response.data;
  },

  /**
   * Add product to shopping list
   * @param {Object} productData 
   * @returns {Promise<Object>} {id: number}
   */
  async addProductToList(productData) {
    const response = await api.post("/shopping-list-products", productData);
    return response.data;
  },

  /**
   * Update product on list (weight, bought status)
   * @param {Object} productData 
   */
  async updateProductOnList(productData) {
    const response = await api.put("/shopping-list-products", productData);
    return response.data;
  },

  /**
   * Remove product from list
   * @param {number} id - Product Entry ID
   */
  async deleteProductFromList(id) {
    const response = await api.delete(`/shopping-list-products/${id}`);
    return response.data;
  }
};

export { shoppingListService };
