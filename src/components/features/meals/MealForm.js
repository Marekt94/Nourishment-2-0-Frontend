import React, { useState, useEffect } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { useProductsInMeal } from "../../../hooks/useProductsInMeal";
import { ProductForm } from "../products/ProductForm";
import "./MealForm.css";

export const MealForm = ({ meal, onSubmit, onCancel, isLoading }) => {
  const { products, isLoading: productsLoading } = useProducts();

  const {
    productsInMeal,
    productSearchTerm,
    showProductDropdown,
    highlightedProductIndex,
    showQuickProductModal,
    quickProductName,
    setProductSearchTerm,
    setShowProductDropdown,
    setHighlightedProductIndex,
    setShowQuickProductModal,
    initializeProducts,
    addProduct,
    removeProduct,
    changeProductWeight,
    changeProductQuantity,
    handleSearchKeyDown,
    handleQuickProductSubmit,
    getFilteredProducts,
    calculateTotalMacros,
  } = useProductsInMeal(products);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    recipe: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (meal) {
      setFormData({
        id: meal.id,
        name: meal.name || "",
        recipe: meal.recipe || "",
      });
      initializeProducts(meal.productsInMeal);
    } else {
      setFormData({
        id: null,
        name: "",
        recipe: "",
      });
      initializeProducts(null);
    }
  }, [meal, initializeProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            onKeyDown={handleSearchKeyDown}
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
                        onClick={() => addProduct(product.id)}
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
                    T: {(((item.product.fat || 0) * (parseFloat(item.weight) || 0)) / 100).toFixed(1)}g | 
                    Bł: {(((item.product.fiber || 0) * (parseFloat(item.weight) || 0)) / 100).toFixed(1)}g
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
                      onChange={(e) => changeProductWeight(item.tempId, e.target.value)}
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
                        onChange={(e) => changeProductQuantity(item.tempId, e.target.value)}
                        disabled={isLoading}
                      />
                      <span className="meal-form__product-unit">szt.</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="meal-form__product-remove"
                    onClick={() => removeProduct(item.tempId)}
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
          <div className="meal-form__macro-item">
            <span className="meal-form__macro-label">Błonnik</span>
            <span className="meal-form__macro-value">{totals.fiber.toFixed(1)}g</span>
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
