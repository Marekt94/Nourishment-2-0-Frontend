/**
 * ProductForm Component
 * Form for creating and editing products
 */

import React, { useState, useEffect } from "react";
import { categoryService } from "../../../services/categoryService";
import "./ProductForm.css";

export const ProductForm = ({ product, onSubmit, onCancel, isLoading }) => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    category: null, // Will store category object {id, name}
    kcalPer100: "",
    proteins: "",
    carbohydrates: "",
    fat: "",
    sugar: "",
    fiber: "",
    weight: "",
    unit: "g",
    description: "",
  });

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await categoryService.getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      // Handle category - it might be an object or just an ID
      let categoryValue = null;
      if (product.category) {
        if (typeof product.category === "object" && product.category.id) {
          categoryValue = product.category;
        } else if (typeof product.category === "number") {
          // Find category by ID in loaded categories
          categoryValue = categories.find((cat) => cat.id === product.category) || null;
        }
      }

      setFormData({
        name: product.name || "",
        category: categoryValue,
        kcalPer100: product.kcalPer100 || "",
        proteins: product.proteins || "",
        carbohydrates: product.carbohydrates || "",
        fat: product.fat || "",
        sugar: product.sugar || "",
        fiber: product.fiber || "",
        weight: product.weight || "",
        unit: product.unit || "g",
        description: product.description || "",
      });
    }
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for category dropdown
    if (name === "category") {
      const selectedCategory = categories.find((cat) => cat.id === parseInt(value));
      setFormData((prev) => ({
        ...prev,
        category: selectedCategory || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert numeric fields - use backend field names
    const submitData = {
      ...formData,
      kcalPer100: formData.kcalPer100 ? parseFloat(formData.kcalPer100) : 0,
      proteins: formData.proteins ? parseFloat(formData.proteins) : 0,
      carbohydrates: formData.carbohydrates ? parseFloat(formData.carbohydrates) : 0,
      fat: formData.fat ? parseFloat(formData.fat) : 0,
      sugar: formData.sugar ? parseFloat(formData.sugar) : 0,
      fiber: formData.fiber ? parseFloat(formData.fiber) : 0,
      weight: formData.weight ? parseFloat(formData.weight) : 0,
    };

    // Include ID if editing
    if (product?.id) {
      submitData.id = product.id;
    }

    onSubmit(submitData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3 className="product-form__title">{product ? "Edit Product" : "Create New Product"}</h3>

      <div className="product-form__row">
        <div className="product-form__group">
          <label className="product-form__label" htmlFor="name">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="product-form__input"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="e.g., Chicken Breast"
          />
        </div>

        <div className="product-form__group">
          <label className="product-form__label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="product-form__input"
            value={formData.category?.id || ""}
            onChange={handleChange}
            disabled={isLoading || categoriesLoading}
          >
            <option value="">-- Select Category --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {categoriesLoading && <span className="product-form__hint">Loading categories...</span>}
        </div>
      </div>

      <div className="product-form__row">
        <div className="product-form__group">
          <label className="product-form__label" htmlFor="kcalPer100">
            Calories (kcal/100g)
          </label>
          <input
            type="number"
            id="kcalPer100"
            name="kcalPer100"
            className="product-form__input"
            value={formData.kcalPer100}
            onChange={handleChange}
            disabled={isLoading}
            min="0"
            step="0.1"
            placeholder="0"
          />
        </div>

        <div className="product-form__group">
          <label className="product-form__label" htmlFor="proteins">
            Protein (g)
          </label>
          <input
            type="number"
            id="proteins"
            name="proteins"
            className="product-form__input"
            value={formData.proteins}
            onChange={handleChange}
            disabled={isLoading}
            min="0"
            step="0.1"
            placeholder="0"
          />
        </div>
      </div>

      <div className="product-form__row">
        <div className="product-form__group">
          <label className="product-form__label" htmlFor="carbohydrates">
            Carbs (g)
          </label>
          <input
            type="number"
            id="carbohydrates"
            name="carbohydrates"
            className="product-form__input"
            value={formData.carbohydrates}
            onChange={handleChange}
            disabled={isLoading}
            min="0"
            step="0.1"
            placeholder="0"
          />
        </div>

        <div className="product-form__group">
          <label className="product-form__label" htmlFor="fat">
            Fat (g)
          </label>
          <input
            type="number"
            id="fat"
            name="fat"
            className="product-form__input"
            value={formData.fat}
            onChange={handleChange}
            disabled={isLoading}
            min="0"
            step="0.1"
            placeholder="0"
          />
        </div>
      </div>

      <div className="product-form__row">
        <div className="product-form__group">
          <label className="product-form__label" htmlFor="sugar">
            Sugar (g)
          </label>
          <input
            type="number"
            id="sugar"
            name="sugar"
            className="product-form__input"
            value={formData.sugar}
            onChange={handleChange}
            disabled={isLoading}
            min="0"
            step="0.1"
            placeholder="0"
          />
        </div>

        <div className="product-form__group">
          <label className="product-form__label" htmlFor="fiber">
            Fiber (g)
          </label>
          <input
            type="number"
            id="fiber"
            name="fiber"
            className="product-form__input"
            value={formData.fiber}
            onChange={handleChange}
            disabled={isLoading}
            min="0"
            step="0.1"
            placeholder="0"
          />
        </div>
      </div>

      <div className="product-form__row">
        <div className="product-form__group">
          <label className="product-form__label" htmlFor="weight">
            Weight
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            className="product-form__input"
            value={formData.weight}
            onChange={handleChange}
            disabled={isLoading}
            min="0"
            step="0.1"
            placeholder="100"
          />
        </div>

        <div className="product-form__group">
          <label className="product-form__label" htmlFor="unit">
            Unit
          </label>
          <select
            id="unit"
            name="unit"
            className="product-form__input"
            value={formData.unit}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="g">g (grams)</option>
            <option value="ml">ml (milliliters)</option>
            <option value="oz">oz (ounces)</option>
            <option value="lb">lb (pounds)</option>
          </select>
        </div>
      </div>

      <div className="product-form__group">
        <label className="product-form__label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="product-form__textarea"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          rows="3"
          placeholder="Optional description..."
        />
      </div>

      <div className="product-form__actions">
        <button
          type="button"
          className="product-form__button product-form__button--cancel"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" className="product-form__button product-form__button--submit" disabled={isLoading}>
          {isLoading ? "Saving..." : product ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};
