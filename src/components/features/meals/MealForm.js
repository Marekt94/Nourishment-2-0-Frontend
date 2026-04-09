import React, { useState, useEffect } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { ProductForm } from "../products/ProductForm";
import "./MealForm.css";

export const MealForm = ({ meal, onSubmit, onCancel, isLoading }) => {
  const { products, isLoading: productsLoading } = useProducts();

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    recipe: "",
  });

  const [productsInMeal, setProductsInMeal] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [highlightedProductIndex, setHighlightedProductIndex] = useState(0);

  const [showQuickProductModal, setShowQuickProductModal] = useState(false);
  const [quickProductName, setQuickProductName] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (meal) {
      setFormData({
        id: meal.id,
        name: meal.name || "",
        recipe: meal.recipe || "",
      });

      if (meal.productsInMeal) {
        setProductsInMeal(
          meal.productsInMeal.map((pim) => {
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
      }
    } else {
      setFormData({
        id: null,
        name: "",
        recipe: "",
      });
      setProductsInMeal([]);
    }
  }, [meal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getFilteredProducts = () => {
    const searchTerm = productSearchTerm.toLowerCase();
    const availableProducts = products.filter(
      (p) => !productsInMeal.some((pim) => pim.product.id === p.id)
    );
    if (!searchTerm) return availableProducts;
    return availableProducts.filter((product) => product.name?.toLowerCase().includes(searchTerm));
  };

  const handleAddProduct = (productId) => {
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
      // We keep the dropdown open or allow it to be easily reopened
      setShowProductDropdown(true);
    }
  };

  const handleProductSearchKeyDown = (e) => {
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
          handleAddProduct(filtered[highlightedProductIndex].id);
        }
      } else if (hasAddOption && highlightedProductIndex === filtered.length) {
        setQuickProductName(productSearchTerm);
        setShowProductDropdown(false);
        setShowQuickProductModal(true);
      }
    } else if (e.key === "Escape") {
      setShowProductDropdown(false);
    }
  };

  const handleQuickProductSubmit = (newProductData) => {
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
  };

  const handleRemoveProduct = (tempId) => {
    setProductsInMeal((prev) => prev.filter((p) => p.tempId !== tempId));
  };

  const handleProductWeightChange = (tempId, weightStr) => {
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
  };

  const handleProductQuantityChange = (tempId, quantityStr) => {
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
  };

  const calculateTotalMacros = () => {
    return productsInMeal.reduce(
      (totals, item) => {
        const factor = (parseFloat(item.weight) || 0) / 100;
        const p = item.product || {};
        return {
          calories: totals.calories + (p.kcalPer100 || 0) * factor,
          proteins: totals.proteins + (p.proteins || 0) * factor,
          carbs: totals.carbs + (p.sugarAndCarb || ((p.sugar || 0) + (p.carbohydrates || 0))) * factor,
          fats: totals.fats + (p.fat || 0) * factor,
        };
      },
      { calories: 0, proteins: 0, carbs: 0, fats: 0 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      productsInMeal: productsInMeal.map((pim) => {
        const payload = {
          product: pim.product,
          weight: parseFloat(pim.weight) || 0,
        };
        if (pim.id) payload.id = pim.id;
        return payload;
      }),
    };

    if (formData.id) {
      submitData.id = formData.id;
    }

    onSubmit(submitData);
  };

  const totals = calculateTotalMacros();

  return (
    <>
      <form className="meal-form" onSubmit={handleSubmit}>
      <h3 className="meal-form__title">{meal ? "✏️ Edytuj potrawę" : "➕ Utwórz nową potrawę"}</h3>

      <div className="meal-form__section">
        <label className="meal-form__label">Nazwa potrawy *</label>
        <input
          type="text"
          name="name"
          className="meal-form__input"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="np. Owsianka z owocami"
          required
          disabled={isLoading}
          autoFocus
        />
      </div>

      <div className="meal-form__section">
        <label className="meal-form__label">Składniki</label>
        
        <div className="meal-form__product-search">
          <input
            type="text"
            className="meal-form__search-input"
            placeholder="🔍 Szukaj produktu do dodania..."
            value={productSearchTerm}
            onChange={(e) => {
              setProductSearchTerm(e.target.value);
              setHighlightedProductIndex(0);
              setShowProductDropdown(true);
            }}
            onClick={() => setShowProductDropdown(true)}
            onFocus={() => setShowProductDropdown(true)}
            onKeyDown={handleProductSearchKeyDown}
            disabled={isLoading || productsLoading}
          />
          
          {showProductDropdown && (
            <div className="meal-form__dropdown">
              {productsLoading ? (
                <div className="meal-form__dropdown-item meal-form__dropdown-item--disabled">
                  Ładowanie produktów...
                </div>
              ) : (
                <>
                  {getFilteredProducts().length === 0 ? (
                    <div className="meal-form__dropdown-item meal-form__dropdown-item--disabled">
                      Brak produktów
                    </div>
                  ) : (
                    getFilteredProducts().map((product, idx) => (
                      <div
                        key={product.id}
                        className={`meal-form__dropdown-item ${
                          idx === highlightedProductIndex ? "meal-form__dropdown-item--highlighted" : ""
                        }`}
                        onMouseEnter={() => setHighlightedProductIndex(idx)}
                        onClick={() => handleAddProduct(product.id)}
                      >
                        {product.name}
                      </div>
                    ))
                  )}
                  {productSearchTerm.trim() !== "" && (
                    <div
                      className={`meal-form__dropdown-item ${
                        highlightedProductIndex === getFilteredProducts().length
                          ? "meal-form__dropdown-item--highlighted"
                          : ""
                      }`}
                      style={{ borderTop: "1px solid #e5e7eb", color: "#3b82f6", fontWeight: "600" }}
                      onMouseEnter={() => setHighlightedProductIndex(getFilteredProducts().length)}
                      onClick={() => {
                        setQuickProductName(productSearchTerm);
                        setShowProductDropdown(false);
                        setShowQuickProductModal(true);
                      }}
                    >
                      ➕ Utwórz nowy produkt: {productSearchTerm}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {showProductDropdown && (
            <div className="meal-form__dropdown-overlay" onClick={() => setShowProductDropdown(false)} />
          )}
        </div>

        {productsInMeal.length > 0 ? (
          <div className="meal-form__products-list">
            {productsInMeal.map((item, index) => (
              <div key={item.tempId} className="meal-form__product-item">
                <span className="meal-form__product-number">{index + 1}</span>
                <div className="meal-form__product-info">
                  <span className="meal-form__product-name">{item.product.name}</span>
                  <span className="meal-form__product-macros">
                    🔥 {(((item.product.kcalPer100 || 0) * (parseFloat(item.weight) || 0)) / 100).toFixed(0)} kcal | 
                    B: {(((item.product.proteins || 0) * (parseFloat(item.weight) || 0)) / 100).toFixed(1)}g | 
                    W: {(((item.product.sugarAndCarb || ((item.product.sugar || 0) + (item.product.carbohydrates || 0))) * (parseFloat(item.weight) || 0)) / 100).toFixed(1)}g | 
                    T: {(((item.product.fat || 0) * (parseFloat(item.weight) || 0)) / 100).toFixed(1)}g
                  </span>
                </div>
                <div className="meal-form__product-controls">
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="meal-form__product-weight"
                      value={item.weight}
                      onChange={(e) => handleProductWeightChange(item.tempId, e.target.value)}
                      disabled={isLoading}
                    />
                    <span className="meal-form__product-unit">g</span>
                  </div>
                  {item.product.weight > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <input
                        type="number"
                        min="0"
                        step="0.001"
                        className="meal-form__product-weight"
                        value={item.quantity}
                        onChange={(e) => handleProductQuantityChange(item.tempId, e.target.value)}
                        disabled={isLoading}
                      />
                      <span className="meal-form__product-unit">szt.</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="meal-form__product-remove"
                    onClick={() => handleRemoveProduct(item.tempId)}
                    disabled={isLoading}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="meal-form__empty-message">Brak składników. Wyszukaj i dodaj produkty powyżej.</p>
        )}
      </div>

      <div className="meal-form__section">
        <h4 className="meal-form__subtitle">📊 Podsumowanie makroskładników</h4>
        <div className="meal-form__macros-preview">
          <div className="meal-form__macro-item">
            <span className="meal-form__macro-label">Kalorie</span>
            <span className="meal-form__macro-value">{totals.calories.toFixed(0)} kcal</span>
          </div>
          <div className="meal-form__macro-item">
            <span className="meal-form__macro-label">Białko</span>
            <span className="meal-form__macro-value">{totals.proteins.toFixed(1)}g</span>
          </div>
          <div className="meal-form__macro-item">
            <span className="meal-form__macro-label">Węglowodany</span>
            <span className="meal-form__macro-value">{totals.carbs.toFixed(1)}g</span>
          </div>
          <div className="meal-form__macro-item">
            <span className="meal-form__macro-label">Tłuszcze</span>
            <span className="meal-form__macro-value">{totals.fats.toFixed(1)}g</span>
          </div>
        </div>
      </div>

      <div className="meal-form__section">
        <label className="meal-form__label">Przepis / Notatki</label>
        <textarea
          name="recipe"
          className="meal-form__textarea"
          value={formData.recipe}
          onChange={handleInputChange}
          placeholder="Opcjonalny przepis na potrawę..."
          rows="4"
          disabled={isLoading}
        />
      </div>

      <div className="meal-form__actions">
        <button
          type="button"
          onClick={onCancel}
          className="meal-form__button meal-form__button--cancel"
          disabled={isLoading}
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="meal-form__button meal-form__button--submit"
          disabled={isLoading}
        >
          {isLoading ? "Zapisywanie..." : meal ? "Zaktualizuj potrawę" : "Utwórz potrawę"}
        </button>
      </div>
    </form>

      {showQuickProductModal && (
        <div className="meal-form__modal-overlay" onClick={() => setShowQuickProductModal(false)}>
          <div className="meal-form__modal-content" onClick={(e) => e.stopPropagation()}>
            <ProductForm
              product={{ name: quickProductName }}
              onSubmit={handleQuickProductSubmit}
              onCancel={() => setShowQuickProductModal(false)}
              isLoading={false}
            />
          </div>
        </div>
      )}
    </>
  );
};
