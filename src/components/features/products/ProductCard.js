/**
 * ProductCard Component
 * Displays a single product in a compact list with expandable details
 */

import React, { useState } from "react";
import "./ProductCard.css";

export const ProductCard = ({ product, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Czy na pewno chcesz usunąć "${product.name}"?`)) {
      onDelete(product.id);
    }
  };

  // Handle category - it might be an object or a string
  const getCategoryName = () => {
    if (!product.category) return null;
    if (typeof product.category === "string") return product.category;
    if (typeof product.category === "object" && product.category.name) {
      return product.category.name;
    }
    return null;
  };

  const categoryName = getCategoryName();

  // Get numeric values - backend uses different field names!
  // Backend returns: kcalPer100, proteins, carbohydrates, fat
  const getCalories = () => {
    return Number(product.kcalPer100 || product.calories || product.CALORIES || 0);
  };

  const getProtein = () => {
    return Number(product.proteins || product.protein || product.PROTEIN || 0);
  };

  const getCarbs = () => {
    return Number(product.carbohydrates || product.carbs || product.CARBS || 0);
  };

  const getFat = () => {
    return Number(product.fat || product.FAT || 0);
  };

  const getSugar = () => {
    return Number(product.sugar || 0);
  };

  const getSugarAndCarb = () => {
    return Number(product.sugarAndCarb || 0);
  };

  return (
    <div className={`product-card ${isExpanded ? "product-card--expanded" : ""}`}>
      {/* Compact View - Always Visible */}
      <div className="product-card__compact" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="product-card__compact-left">
          <h3 className="product-card__name">{String(product.name || product.NAME || "Nienazwany produkt")}</h3>
          {categoryName && <span className="product-card__category-badge">{categoryName}</span>}
        </div>

        <div className="product-card__compact-right">
          <div className="product-card__macro-compact">
            <span className="product-card__macro-label">Kcal</span>
            <span className="product-card__macro-value">{getCalories()}</span>
          </div>
          <div className="product-card__macro-compact">
            <span className="product-card__macro-label">Białko</span>
            <span className="product-card__macro-value">{getProtein()}g</span>
          </div>
          <div className="product-card__macro-compact">
            <span className="product-card__macro-label">Węgle</span>
            <span className="product-card__macro-value">{getSugarAndCarb()}g</span>
          </div>
          <div className="product-card__macro-compact">
            <span className="product-card__macro-label">Tłuszcze</span>
            <span className="product-card__macro-value">{getFat()}g</span>
          </div>

          <div className="product-card__compact-actions">
            <button
              className="product-card__button product-card__button--edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              title="Edytuj produkt"
            >
              ✏️
            </button>
            <button
              className="product-card__button product-card__button--delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              title="Usuń produkt"
            >
              🗑️
            </button>
          </div>

          <button
            className="product-card__expand-btn"
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
        <div className="product-card__details-expanded">
          <div className="product-card__details-section">
            <h4 className="product-card__details-title">Szczegółowe Makroskładniki</h4>
            <div className="product-card__details-grid">
              <div className="product-card__detail-item">
                <span className="product-card__detail-icon">🔥</span>
                <span className="product-card__detail-label">Kalorie (na 100g)</span>
                <span className="product-card__detail-value">{getCalories()} kcal</span>
              </div>
              <div className="product-card__detail-item">
                <span className="product-card__detail-icon">💪</span>
                <span className="product-card__detail-label">Białko</span>
                <span className="product-card__detail-value">{getProtein()}g</span>
              </div>
              <div className="product-card__detail-item">
                <span className="product-card__detail-icon">🍞</span>
                <span className="product-card__detail-label">Węglowodany</span>
                <span className="product-card__detail-value">{getCarbs()}g</span>
              </div>
              <div className="product-card__detail-item">
                <span className="product-card__detail-icon">🥑</span>
                <span className="product-card__detail-label">Tłuszcze</span>
                <span className="product-card__detail-value">{getFat()}g</span>
              </div>
              <div className="product-card__detail-item">
                <span className="product-card__detail-icon">🍬</span>
                <span className="product-card__detail-label">Cukry</span>
                <span className="product-card__detail-value">{getSugar()}g</span>
              </div>
              <div className="product-card__detail-item">
                <span className="product-card__detail-icon">🍯</span>
                <span className="product-card__detail-label">Cukry + Węglowodany</span>
                <span className="product-card__detail-value">{getSugarAndCarb()}g</span>
              </div>
              {product.fiber > 0 && (
                <div className="product-card__detail-item">
                  <span className="product-card__detail-icon">🌾</span>
                  <span className="product-card__detail-label">Błonnik</span>
                  <span className="product-card__detail-value">{Number(product.fiber)}g</span>
                </div>
              )}
              {product.salt > 0 && (
                <div className="product-card__detail-item">
                  <span className="product-card__detail-icon">🧂</span>
                  <span className="product-card__detail-label">Sól</span>
                  <span className="product-card__detail-value">{Number(product.salt)}g</span>
                </div>
              )}
              {product.weight && (
                <div className="product-card__detail-item">
                  <span className="product-card__detail-icon">⚖️</span>
                  <span className="product-card__detail-label">Waga</span>
                  <span className="product-card__detail-value">
                    {product.weight}
                    {product.unit || "g"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {(product.description || product.DESCRIPTION) && (
            <div className="product-card__details-section">
              <h4 className="product-card__details-title">Opis</h4>
              <p className="product-card__description">{String(product.description || product.DESCRIPTION)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
