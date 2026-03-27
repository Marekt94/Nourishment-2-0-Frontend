/**
 * MealCard Component
 * Displays a single meal in a compact list with expandable details
 */

import React, { useState } from "react";
import "./MealCard.css";

export const MealCard = ({ meal, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Czy na pewno chcesz usunąć posiłek "${meal.name}"?`)) {
      onDelete(meal.id);
    }
  };

  // Count products in meal
  const productsCount = meal.productsInMeal?.length || 0;

  // Calculate total macros from products
  const getTotalMacros = () => {
    if (!meal.productsInMeal || meal.productsInMeal.length === 0) {
      return { calories: 0, proteins: 0, carbs: 0, fat: 0 };
    }

    return meal.productsInMeal.reduce(
      (totals, item) => {
        const product = item.product || {};
        const weight = item.weight || 100; // Default to 100g if not specified
        const factor = weight / 100; // Calculate factor based on weight

        return {
          calories: totals.calories + (product.kcalPer100 || 0) * factor,
          proteins: totals.proteins + (product.proteins || 0) * factor,
          carbs: totals.carbs + (product.sugarAndCarb || ((product.sugar || 0) + (product.carbohydrates || 0))) * factor,
          fat: totals.fat + (product.fat || 0) * factor,
        };
      },
      { calories: 0, proteins: 0, carbs: 0, fat: 0 },
    );
  };

  const macros = getTotalMacros();

  return (
    <div className={`meal-card ${isExpanded ? "meal-card--expanded" : ""}`}>
      {/* Compact View - Always Visible */}
      <div className="meal-card__compact" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="meal-card__compact-left">
          <h3 className="meal-card__name">{meal.name || "Unnamed Meal"}</h3>
          <span className="meal-card__products-count">
            🍴 {productsCount} {productsCount === 1 ? "produkt" : "produktów"}
          </span>
        </div>

        <div className="meal-card__compact-right">
          <div className="meal-card__macro-compact">
            <span className="meal-card__macro-label">Kcal</span>
            <span className="meal-card__macro-value">{Math.round(macros.calories)}</span>
          </div>
          <div className="meal-card__macro-compact">
            <span className="meal-card__macro-label">Białko</span>
            <span className="meal-card__macro-value">{Math.round(macros.proteins)}g</span>
          </div>
          <div className="meal-card__macro-compact">
            <span className="meal-card__macro-label">Węgle</span>
            <span className="meal-card__macro-value">{Math.round(macros.carbs)}g</span>
          </div>
          <div className="meal-card__macro-compact">
            <span className="meal-card__macro-label">Tłuszcze</span>
            <span className="meal-card__macro-value">{Math.round(macros.fat)}g</span>
          </div>

          <div className="meal-card__compact-actions">
            <button
              className="meal-card__button meal-card__button--edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(meal);
              }}
              title="Edytuj posiłek"
            >
              ✏️
            </button>
            <button
              className="meal-card__button meal-card__button--delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              title="Usuń posiłek"
            >
              🗑️
            </button>
          </div>

          <button
            className="meal-card__expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            title={isExpanded ? "Zwiń" : "Rozwiń"}
          >
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Expanded Details - Shown when expanded */}
      {isExpanded && (
        <div className="meal-card__details-expanded">
          {/* Products List */}
          {meal.productsInMeal && meal.productsInMeal.length > 0 && (
            <div className="meal-card__details-section">
              <h4 className="meal-card__details-title">Produkty w posiłku</h4>
              <div className="meal-card__products-list">
                {meal.productsInMeal.map((item, index) => {
                  const product = item.product || {};
                  const weight = item.weight || 100;
                  const unitWeight = product.weight > 0 ? product.weight : 0;
                  
                  // Format quantity: use 1 decimal if needed, else whole number. e.g. 1, 1.5, 0.5
                  let quantityText = "";
                  if (unitWeight > 0) {
                    const qty = weight / unitWeight;
                    // Fix to 2 decimals max and remove trailing zeros
                    const formattedQty = parseFloat(qty.toFixed(2));
                    quantityText = ` (${formattedQty} szt.)`;
                  }

                  return (
                    <div key={index} className="meal-card__product-item">
                      <span className="meal-card__product-name">
                        {product.name || "Unknown Product"}
                        <span style={{ color: "var(--color-primary-light)", fontSize: "0.9em", marginLeft: "4px" }}>
                          {quantityText}
                        </span>
                      </span>
                      <span className="meal-card__product-weight">{weight}g</span>
                      <div className="meal-card__product-macros">
                        <span>🔥 {Math.round(((product.kcalPer100 || 0) * weight) / 100)} kcal</span>
                        <span>💪 {Math.round(((product.proteins || 0) * weight) / 100)}g</span>
                        <span>🍞 {Math.round(((product.sugarAndCarb || ((product.sugar || 0) + (product.carbohydrates || 0))) * weight) / 100)}g</span>
                        <span>🥑 {Math.round(((product.fat || 0) * weight) / 100)}g</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recipe */}
          {meal.recipe && (
            <div className="meal-card__details-section">
              <h4 className="meal-card__details-title">Przepis</h4>
              <p className="meal-card__recipe">{meal.recipe}</p>
            </div>
          )}

          {/* Summary Macros */}
          <div className="meal-card__details-section">
            <h4 className="meal-card__details-title">Podsumowanie Makroskładników</h4>
            <div className="meal-card__details-grid">
              <div className="meal-card__detail-item">
                <span className="meal-card__detail-icon">🔥</span>
                <span className="meal-card__detail-label">Kalorie (całość)</span>
                <span className="meal-card__detail-value">{Math.round(macros.calories)} kcal</span>
              </div>
              <div className="meal-card__detail-item">
                <span className="meal-card__detail-icon">💪</span>
                <span className="meal-card__detail-label">Białko</span>
                <span className="meal-card__detail-value">{Math.round(macros.proteins)}g</span>
              </div>
              <div className="meal-card__detail-item">
                <span className="meal-card__detail-icon">🍞</span>
                <span className="meal-card__detail-label">Węglowodany</span>
                <span className="meal-card__detail-value">{Math.round(macros.carbs)}g</span>
              </div>
              <div className="meal-card__detail-item">
                <span className="meal-card__detail-icon">🥑</span>
                <span className="meal-card__detail-label">Tłuszcze</span>
                <span className="meal-card__detail-value">{Math.round(macros.fat)}g</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
