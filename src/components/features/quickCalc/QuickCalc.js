import React from "react";
import { useProducts } from "../../../hooks/useProducts";
import { useProductsInMeal } from "../../../hooks/useProductsInMeal";
import { ProductForm } from "../products/ProductForm";
import "./QuickCalc.css";

/**
 * QuickCalc Component
 *
 * Quick meal calculator — add products with weights to instantly see
 * calculated macronutrients. No saving, no metadata — pure calculation.
 */
export const QuickCalc = () => {
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
    addProduct,
    removeProduct,
    changeProductWeight,
    changeProductQuantity,
    handleSearchKeyDown,
    handleQuickProductSubmit,
    clearAll,
    getFilteredProducts,
    calculateTotalMacros,
  } = useProductsInMeal(products);

  const totals = calculateTotalMacros();
  const hasProducts = productsInMeal.length > 0;
  const isZero = totals.calories === 0;

  return (
    <>
      <div className="quick-calc">
        <h3 className="quick-calc__title">🧮 Kalkulator Posiłku</h3>
        <p className="quick-calc__subtitle">
          Dodaj produkty i ich wagi, aby obliczyć makroskładniki. Nic nie jest zapisywane.
        </p>

        {/* Macros Summary — prominent at top */}
        <div className="quick-calc__macros-summary">
          <div className="quick-calc__macro-item">
            <span className="quick-calc__macro-label">🔥 Kalorie</span>
            <span className={`quick-calc__macro-value ${isZero ? "quick-calc__macro-value--zero" : ""}`}>
              {totals.calories.toFixed(0)} kcal
            </span>
          </div>
          <div className="quick-calc__macro-item">
            <span className="quick-calc__macro-label">🥩 Białko</span>
            <span className={`quick-calc__macro-value ${isZero ? "quick-calc__macro-value--zero" : ""}`}>
              {totals.proteins.toFixed(1)}g
            </span>
          </div>
          <div className="quick-calc__macro-item">
            <span className="quick-calc__macro-label">🍞 Węglowodany</span>
            <span className={`quick-calc__macro-value ${isZero ? "quick-calc__macro-value--zero" : ""}`}>
              {totals.carbs.toFixed(1)}g
            </span>
          </div>
          <div className="quick-calc__macro-item">
            <span className="quick-calc__macro-label">🥑 Tłuszcze</span>
            <span className={`quick-calc__macro-value ${isZero ? "quick-calc__macro-value--zero" : ""}`}>
              {totals.fats.toFixed(1)}g
            </span>
          </div>
          <div className="quick-calc__macro-item">
            <span className="quick-calc__macro-label">🌾 Błonnik</span>
            <span className={`quick-calc__macro-value ${isZero ? "quick-calc__macro-value--zero" : ""}`}>
              {totals.fiber.toFixed(1)}g
            </span>
          </div>
        </div>

        {/* Product Search */}
        <div className="quick-calc__section">
          <label className="quick-calc__label">Dodaj składnik</label>

          <div className="quick-calc__product-search">
            <input
              type="text"
              className="quick-calc__search-input"
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
              disabled={productsLoading}
              autoFocus
            />

            {showProductDropdown && (
              <div className="quick-calc__dropdown">
                {productsLoading ? (
                  <div className="quick-calc__dropdown-item quick-calc__dropdown-item--disabled">
                    Ładowanie produktów...
                  </div>
                ) : (
                  <>
                    {getFilteredProducts().length === 0 ? (
                      <div className="quick-calc__dropdown-item quick-calc__dropdown-item--disabled">
                        Brak produktów
                      </div>
                    ) : (
                      getFilteredProducts().map((product, idx) => (
                        <div
                          key={product.id}
                          className={`quick-calc__dropdown-item ${
                            idx === highlightedProductIndex ? "quick-calc__dropdown-item--highlighted" : ""
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
                        className={`quick-calc__dropdown-item ${
                          highlightedProductIndex === getFilteredProducts().length
                            ? "quick-calc__dropdown-item--highlighted"
                            : ""
                        }`}
                        style={{ borderTop: "1px solid #e5e7eb", color: "#0d9488", fontWeight: "600" }}
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
              <div className="quick-calc__dropdown-overlay" onClick={() => setShowProductDropdown(false)} />
            )}
          </div>

          {/* Products list */}
          {hasProducts ? (
            <div className="quick-calc__products-list">
              {productsInMeal.map((item, index) => (
                <div key={item.tempId} className="quick-calc__product-item">
                  <span className="quick-calc__product-number">{index + 1}</span>
                  <div className="quick-calc__product-info">
                    <span className="quick-calc__product-name">{item.product.name}</span>
                    <span className="quick-calc__product-macros">
                      🔥 {(((item.product.kcalPer100 || 0) * (parseFloat(item.weight) || 0)) / 100).toFixed(0)} kcal | 
                      B: {(((item.product.proteins || 0) * (parseFloat(item.weight) || 0)) / 100).toFixed(1)}g | 
                      W: {(((item.product.sugarAndCarb || ((item.product.sugar || 0) + (item.product.carbohydrates || 0))) * (parseFloat(item.weight) || 0)) / 100).toFixed(1)}g | 
                      T: {(((item.product.fat || 0) * (parseFloat(item.weight) || 0)) / 100).toFixed(1)}g | 
                      Bł: {(((item.product.fiber || 0) * (parseFloat(item.weight) || 0)) / 100).toFixed(1)}g
                    </span>
                  </div>
                  <div className="quick-calc__product-controls">
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        className="quick-calc__product-weight"
                        value={item.weight}
                        onChange={(e) => changeProductWeight(item.tempId, e.target.value)}
                      />
                      <span className="quick-calc__product-unit">g</span>
                    </div>
                    {item.product.weight > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <input
                          type="number"
                          min="0"
                          step="0.001"
                          className="quick-calc__product-weight"
                          value={item.quantity}
                          onChange={(e) => changeProductQuantity(item.tempId, e.target.value)}
                        />
                        <span className="quick-calc__product-unit">szt.</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="quick-calc__product-remove"
                      onClick={() => removeProduct(item.tempId)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="quick-calc__empty-message">
              Brak składników. Wyszukaj i dodaj produkty powyżej, aby obliczyć makroskładniki.
            </p>
          )}
        </div>

        {/* Clear All */}
        {hasProducts && (
          <div className="quick-calc__actions">
            <button type="button" className="quick-calc__clear-button" onClick={clearAll}>
              🗑️ Wyczyść wszystko
            </button>
          </div>
        )}
      </div>

      {/* Quick Product Create Modal */}
      {showQuickProductModal && (
        <div className="quick-calc__modal-overlay" onClick={() => setShowQuickProductModal(false)}>
          <div className="quick-calc__modal-content" onClick={(e) => e.stopPropagation()}>
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
