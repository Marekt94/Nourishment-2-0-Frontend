/**
 * Product Service
 * Handles all product-related API calls
 *
 * Backend: GET /products, POST /products, PUT /products, DELETE /products/:id
 * Swagger: ../nourishment_20/docs/swagger.yaml
 * Handler: ../nourishment_20/internal/api/products.go
 * Model: ../nourishment_20/internal/mealDomain/mealTypes.go
 */

import { api } from "./api";

const productService = {
  /**
   * Fetch all products
   * @returns {Promise<Array>} Array of products
   */
  async getProducts() {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      console.error("Get products error:", error);
      throw error;
    }
  },

  /**
   * Fetch single product by ID
   * @param {string|number} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get product error:", error);
      throw error;
    }
  },

  /**
   * Create new product
   * @param {Object} productData - Product data (without ID)
   * @returns {Promise<Object>} Response with {id: number}
   */
  async createProduct(productData) {
    try {
      const response = await api.post("/products", productData);
      // Backend returns {id: number}, not full product
      return response.data;
    } catch (error) {
      console.error("Create product error:", error);
      throw error;
    }
  },

  /**
   * Update existing product
   * @param {Object} productData - Updated product data (must include ID)
   * @returns {Promise<void>} Returns 200 with no body on success
   */
  async updateProduct(productData) {
    try {
      const response = await api.put("/products", productData);
      return response.data; // Usually empty/null on 200 success
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    }
  },

  /**
   * Delete product
   * @param {string|number} id - Product ID
   * @returns {Promise<void>}
   */
  async deleteProduct(id) {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error("Delete product error:", error);
      throw error;
    }
  },
};

export { productService };
