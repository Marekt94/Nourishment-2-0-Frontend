/**
 * Custom hook for products management
 * Provides products state and operations
 */

import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";
// import { mockProducts } from '../services/mockProducts'; // Uncomment to use mock data

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all products
   */
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      console.log("🔍 useProducts - Raw data from backend:", data);
      console.log("🔍 useProducts - First product raw:", data?.[0]);
      console.log("🔍 useProducts - First product KEYS:", data?.[0] ? Object.keys(data[0]) : "No product");
      console.log("🔍 useProducts - Total products:", data?.length);

      // Log all values from first product
      if (data?.[0]) {
        const firstProduct = data[0];
        console.log("🔬 Detailed first product analysis:");
        console.log("  - id:", firstProduct.id);
        console.log("  - name:", firstProduct.name);
        console.log("  - kcalPer100:", firstProduct.kcalPer100, typeof firstProduct.kcalPer100);
        console.log("  - proteins:", firstProduct.proteins, typeof firstProduct.proteins);
        console.log("  - carbohydrates:", firstProduct.carbohydrates, typeof firstProduct.carbohydrates);
        console.log("  - fat:", firstProduct.fat, typeof firstProduct.fat);
        console.log("  - sugar:", firstProduct.sugar, typeof firstProduct.sugar);
        console.log("  - sugarAndCarb:", firstProduct.sugarAndCarb, typeof firstProduct.sugarAndCarb);
        console.log("  - fiber:", firstProduct.fiber, typeof firstProduct.fiber);
        console.log("  - salt:", firstProduct.salt, typeof firstProduct.salt);
        console.log("  - Complete object:", JSON.stringify(firstProduct, null, 2));

        // Alert for debugging
        alert(
          `🔍 Backend Data Check:\n\ncarbohydrates: ${firstProduct.carbohydrates}\nsugarAndCarb: ${firstProduct.sugarAndCarb}\nsugar: ${firstProduct.sugar}\n\nCheck console for full details!`,
        );
      }

      // Check if data has zero values
      if (data && data.length > 0 && data[0]) {
        const firstProduct = data[0];
        const hasZeroValues =
          (firstProduct.calories === 0 || !firstProduct.calories) &&
          (firstProduct.protein === 0 || !firstProduct.protein) &&
          (firstProduct.carbs === 0 || !firstProduct.carbs) &&
          (firstProduct.fat === 0 || !firstProduct.fat);

        if (hasZeroValues) {
          console.warn("⚠️ All macro values are 0! Backend might not have data or columns are not mapped correctly.");
          console.warn("⚠️ Uncomment mockProducts import to test with mock data");
        }
      }

      setProducts(data);
      // setProducts(mockProducts); // Uncomment to use mock data
    } catch (err) {
      setError(err.message || "Failed to fetch products");
      console.error("Fetch products error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create new product
   * Note: Backend POST /products returns only {id: number}, not full product
   */
  const createProduct = useCallback(async (productData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.createProduct(productData);
      // Backend returns {id: number}, merge with submitted data
      const newProduct = { ...productData, id: response.id };
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err.message || "Failed to create product");
      console.error("Create product error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update existing product
   * Note: Backend PUT /products returns 200 with no body, uses data we sent
   */
  const updateProduct = useCallback(async (productData) => {
    setIsLoading(true);
    setError(null);
    try {
      await productService.updateProduct(productData);
      // Backend returns 200 with no body, update with data we sent
      setProducts((prev) => prev.map((p) => (p.id === productData.id ? productData : p)));
      return productData;
    } catch (err) {
      setError(err.message || "Failed to update product");
      console.error("Update product error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete product
   */
  const deleteProduct = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete product");
      console.error("Delete product error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh products list
   */
  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch,
  };
};
