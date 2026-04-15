import { useState, useCallback } from "react";

/**
 * useProductsInMeal Hook
 *
 * Shared logic for managing a list of products with weights/quantities
 * and calculating macronutrients. Used by MealForm and QuickCalc.
 *
 * @param {Array} products - Full product list from useProducts()
 */
export const useProductsInMeal = (products) => {
  const [productsInMeal, setProductsInMeal] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [highlightedProductIndex, setHighlightedProductIndex] = useState(0);

  const [showQuickProductModal, setShowQuickProductModal] = useState(false);
  const [quickProductName, setQuickProductName] = useState("");

  /**
   * Initialize products from an existing meal (for edit mode).
   * @param {Array} mealProducts - Array of { id, product, weight } from meal.productsInMeal
   */
  const initializeProducts = useCallback((mealProducts) => {
    if (!mealProducts) {
      setProductsInMeal([]);
      return;
    }
    setProductsInMeal(
      mealProducts.map((pim) => {
        const unitWeight = pim.product?.weight > 0 ? pim.product.weight : 0;
        const weight = pim.weight || 100;
        const quantity = unitWeight > 0 ? +(weight / unitWeight).toFixed(3) : "";

        return {
          id: pim.id || null,
          tempId: pim.id ? String(pim.id) : String(Date.now() + Math.random()),
          product: pim.product,
          weight: weight,
          quantity: quantity,
        };
      })
    );
  }, []);

  /**
   * Get products filtered by search term, excluding already-added products.
   */
  const getFilteredProducts = useCallback(() => {
    const searchTerm = productSearchTerm.toLowerCase();
    const availableProducts = products.filter(
      (p) => !productsInMeal.some((pim) => pim.product.id === p.id)
    );
    if (!searchTerm) return availableProducts;
    return availableProducts.filter((product) => product.name?.toLowerCase().includes(searchTerm));
  }, [products, productsInMeal, productSearchTerm]);

  /**
   * Add a product by ID to the list.
   */
  const addProduct = useCallback(
    (productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const initialWeight = 100;
        const unitWeight = product.weight > 0 ? product.weight : 0;
        const initialQuantity = unitWeight > 0 ? +(initialWeight / unitWeight).toFixed(3) : "";

        setProductsInMeal((prev) => [
          {
            id: null,
            tempId: String(Date.now() + Math.random()),
            product: product,
            weight: initialWeight,
            quantity: initialQuantity,
          },
          ...prev,
        ]);
        setProductSearchTerm("");
        setHighlightedProductIndex(0);
        setShowProductDropdown(true);
      }
    },
    [products]
  );

  /**
   * Remove a product by tempId.
   */
  const removeProduct = useCallback((tempId) => {
    setProductsInMeal((prev) => prev.filter((p) => p.tempId !== tempId));
  }, []);

  /**
   * Change product weight by tempId — recalculates quantity.
   */
  const changeProductWeight = useCallback((tempId, weightStr) => {
    setProductsInMeal((prev) =>
      prev.map((p) => {
        if (p.tempId === tempId) {
          const numWeight = parseFloat(weightStr);
          if (isNaN(numWeight)) return { ...p, weight: weightStr, quantity: "" };

          const unitWeight = p.product.weight > 0 ? p.product.weight : 0;
          const quantity = unitWeight > 0 ? numWeight / unitWeight : 0;
          return { ...p, weight: weightStr, quantity: quantity !== 0 ? +quantity.toFixed(3) : "" };
        }
        return p;
      })
    );
  }, []);

  /**
   * Change product quantity by tempId — recalculates weight.
   */
  const changeProductQuantity = useCallback((tempId, quantityStr) => {
    setProductsInMeal((prev) =>
      prev.map((p) => {
        if (p.tempId === tempId) {
          const numQuantity = parseFloat(quantityStr);
          if (isNaN(numQuantity)) return { ...p, quantity: quantityStr, weight: "" };

          const unitWeight = p.product.weight > 0 ? p.product.weight : 0;
          const weight = numQuantity * unitWeight;
          return { ...p, quantity: quantityStr, weight: weight !== 0 ? Math.round(weight) : "" };
        }
        return p;
      })
    );
  }, []);

  /**
   * Handle keyboard navigation for product search dropdown.
   */
  const handleSearchKeyDown = useCallback(
    (e) => {
      const filtered = getFilteredProducts();
      const hasAddOption = productSearchTerm.trim() !== "";
      const totalOptions = filtered.length + (hasAddOption ? 1 : 0);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedProductIndex((prev) => Math.min(prev + 1, totalOptions - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedProductIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Tab") {
        if (hasAddOption) {
          e.preventDefault();
          setHighlightedProductIndex(filtered.length);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedProductIndex < filtered.length) {
          if (filtered[highlightedProductIndex]) {
            addProduct(filtered[highlightedProductIndex].id);
          }
        } else if (hasAddOption && highlightedProductIndex === filtered.length) {
          setQuickProductName(productSearchTerm);
          setShowProductDropdown(false);
          setShowQuickProductModal(true);
        }
      } else if (e.key === "Escape") {
        setShowProductDropdown(false);
      }
    },
    [getFilteredProducts, productSearchTerm, highlightedProductIndex, addProduct]
  );

  /**
   * Handle quick-create product submit — adds the newly created product.
   */
  const handleQuickProductSubmit = useCallback((newProductData) => {
    const initialWeight = 100;
    const unitWeight = newProductData.weight > 0 ? newProductData.weight : 0;
    const initialQuantity = unitWeight > 0 ? +(initialWeight / unitWeight).toFixed(3) : "";

    setProductsInMeal((prev) => [
      {
        id: null,
        tempId: String(Date.now() + Math.random()),
        product: newProductData,
        weight: initialWeight,
        quantity: initialQuantity,
      },
      ...prev,
    ]);
    setShowQuickProductModal(false);
    setProductSearchTerm("");
  }, []);

  /**
   * Clear all products (used by QuickCalc's "Clear All" button).
   */
  const clearAll = useCallback(() => {
    setProductsInMeal([]);
    setProductSearchTerm("");
    setShowProductDropdown(false);
    setHighlightedProductIndex(0);
  }, []);

  /**
   * Calculate total macronutrients for all products in the list.
   */
  const calculateTotalMacros = useCallback(() => {
    return productsInMeal.reduce(
      (totals, item) => {
        const factor = (parseFloat(item.weight) || 0) / 100;
        const p = item.product || {};
        return {
          calories: totals.calories + (p.kcalPer100 || 0) * factor,
          proteins: totals.proteins + (p.proteins || 0) * factor,
          carbs: totals.carbs + (p.sugarAndCarb || ((p.sugar || 0) + (p.carbohydrates || 0))) * factor,
          fats: totals.fats + (p.fat || 0) * factor,
          fiber: totals.fiber + (p.fiber || 0) * factor,
        };
      },
      { calories: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0 }
    );
  }, [productsInMeal]);

  return {
    // State
    productsInMeal,
    productSearchTerm,
    showProductDropdown,
    highlightedProductIndex,
    showQuickProductModal,
    quickProductName,

    // Setters
    setProductSearchTerm,
    setShowProductDropdown,
    setHighlightedProductIndex,
    setShowQuickProductModal,

    // Actions
    initializeProducts,
    addProduct,
    removeProduct,
    changeProductWeight,
    changeProductQuantity,
    handleSearchKeyDown,
    handleQuickProductSubmit,
    clearAll,

    // Derived
    getFilteredProducts,
    calculateTotalMacros,
  };
};
