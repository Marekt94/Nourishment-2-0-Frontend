import React, { useState, useEffect, useCallback } from "react";
import { looseProductInDayService } from "../../../services/looseProductInDayService";
import "./MealInDayCard.css";

/**
 * MealInDayCard Component
 *
 * Displays a single daily meal plan with all meals (breakfast to supper).
 * Expandable to show detailed meal information and macros.
 */
const MealInDayCard = ({ mealInDay, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [looseProducts, setLooseProducts] = useState([]);

  /**
   * Fetch loose products from backend
   */
  const fetchLooseProducts = useCallback(async () => {
    try {
      const data = await looseProductInDayService.getLooseProductsByDay(mealInDay.id);
      setLooseProducts(data || []);
    } catch (err) {
      console.error("Error fetching loose products:", err);
      setLooseProducts([]);
    }
  }, [mealInDay.id]);

  /**
   * Fetch loose products when component mounts or mealInDay changes
   * This ensures macros are calculated correctly even in collapsed view
   */
  useEffect(() => {
    if (mealInDay.id) {
      fetchLooseProducts();
    }
  }, [mealInDay.id, fetchLooseProducts]);

  /**
   * Calculate total macros for all meals in the day
   */
  // Calculate total macros from all meals and loose products
  const getTotalMacros = () => {
    const meals = [
      { meal: mealInDay.breakfast, factor: mealInDay.factorBreakfast || 1.0 },
      { meal: mealInDay.secondBreakfast, factor: mealInDay.factorSecondBreakfast || 1.0 },
      { meal: mealInDay.lunch, factor: mealInDay.factorLunch || 1.0 },
      { meal: mealInDay.afternoonSnack, factor: mealInDay.factorAfternoonSnack || 1.0 },
      { meal: mealInDay.dinner, factor: mealInDay.factorDinner || 1.0 },
      { meal: mealInDay.supper, factor: mealInDay.factorSupper || 1.0 },
    ];

    let totals = { calories: 0, proteins: 0, carbs: 0, fats: 0 };

    // Add macros from meals
    meals.forEach(({ meal, factor }) => {
      if (meal?.productsInMeal && Array.isArray(meal.productsInMeal)) {
        meal.productsInMeal.forEach((item) => {
          const weight = item.weight || 100;
          const product = item.product || {};

          // Support both field naming conventions
          const kcal = product.kcalPer100 || product.kcal || 0;
          const proteins = product.proteinsPer100 || product.proteins || 0;
          const carbs = product.carbohydratesPer100 || product.carbohydrates || product.sugarAndCarb || 0;
          const fats = product.fatsPer100 || product.fat || 0;

          totals.calories += (kcal * weight * factor) / 100;
          totals.proteins += (proteins * weight * factor) / 100;
          totals.carbs += (carbs * weight * factor) / 100;
          totals.fats += (fats * weight * factor) / 100;
        });
      }
    });

    // Add macros from loose products
    looseProducts.forEach(({ product, weight }) => {
      const kcal = product.kcalPer100 || product.kcal || 0;
      const proteins = product.proteinsPer100 || product.proteins || 0;
      const carbs = product.carbohydratesPer100 || product.carbohydrates || product.sugarAndCarb || 0;
      const fats = product.fatsPer100 || product.fat || 0;

      totals.calories += (kcal * weight) / 100;
      totals.proteins += (proteins * weight) / 100;
      totals.carbs += (carbs * weight) / 100;
      totals.fats += (fats * weight) / 100;
    });

    return totals;
  };

  const totalMacros = getTotalMacros();

  // Safety check for undefined values
  const safeMacros = {
    calories: totalMacros?.calories || 0,
    proteins: totalMacros?.proteins || 0,
    carbs: totalMacros?.carbs || 0,
    fats: totalMacros?.fats || 0,
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Helper function to render a meal
  const renderMeal = (label, meal, factor) => {
    if (!meal) return null;

    // Calculate meal macros
    let mealMacros = { calories: 0, proteins: 0, carbs: 0, fats: 0 };
    if (meal.productsInMeal && meal.productsInMeal.length > 0) {
      meal.productsInMeal.forEach((item) => {
        const weight = item.weight || 100;
        const product = item.product || {};

        const kcal = product.kcalPer100 || product.kcal || 0;
        const proteins = product.proteinsPer100 || product.proteins || 0;
        const carbs = product.carbohydratesPer100 || product.carbohydrates || product.sugarAndCarb || 0;
        const fats = product.fatsPer100 || product.fat || 0;

        mealMacros.calories += (kcal * weight * factor) / 100;
        mealMacros.proteins += (proteins * weight * factor) / 100;
        mealMacros.carbs += (carbs * weight * factor) / 100;
        mealMacros.fats += (fats * weight * factor) / 100;
      });
    }

    return (
      <div className="meal-in-day-card__meal">
        <div className="meal-in-day-card__meal-header">
          <div className="meal-in-day-card__meal-title">
            <span className="meal-in-day-card__meal-label">{label}</span>
            <span className="meal-in-day-card__meal-name">{meal.name}</span>
            {factor !== 1.0 && <span className="meal-in-day-card__meal-factor">×{factor}</span>}
          </div>
          <div className="meal-in-day-card__meal-macros-summary">
            <span className="meal-in-day-card__meal-macro">🔥 {mealMacros.calories.toFixed(0)} kcal</span>
            <span className="meal-in-day-card__meal-macro">🥩 {mealMacros.proteins.toFixed(1)}g</span>
            <span className="meal-in-day-card__meal-macro">🍞 {mealMacros.carbs.toFixed(1)}g</span>
            <span className="meal-in-day-card__meal-macro">🥑 {mealMacros.fats.toFixed(1)}g</span>
          </div>
        </div>
        {meal.productsInMeal && meal.productsInMeal.length > 0 && (
          <div className="meal-in-day-card__products">
            {meal.productsInMeal.map((item) => (
              <div key={item.id} className="meal-in-day-card__product">
                <span className="meal-in-day-card__product-name">{item.product.name}</span>
                <span className="meal-in-day-card__product-weight">{item.weight}g</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`meal-in-day-card ${isExpanded ? "meal-in-day-card--expanded" : ""}`}>
      {/* Collapsed View */}
      <div className="meal-in-day-card__header" onClick={toggleExpand}>
        <div className="meal-in-day-card__title">
          <h3>{mealInDay.name}</h3>
          {mealInDay.for5Days && <span className="meal-in-day-card__badge">📅 5 dni</span>}
        </div>
        <div className="meal-in-day-card__summary">
          <div className="meal-in-day-card__summary-item meal-in-day-card__summary-item--calories">
            <span className="meal-in-day-card__summary-icon">🔥</span>
            <div className="meal-in-day-card__summary-content">
              <span className="meal-in-day-card__summary-value">{safeMacros.calories.toFixed(0)}</span>
              <span className="meal-in-day-card__summary-unit">kcal</span>
            </div>
          </div>
          <div className="meal-in-day-card__summary-item meal-in-day-card__summary-item--protein">
            <span className="meal-in-day-card__summary-icon">🥩</span>
            <div className="meal-in-day-card__summary-content">
              <span className="meal-in-day-card__summary-label">B</span>
              <span className="meal-in-day-card__summary-value">{safeMacros.proteins.toFixed(1)}g</span>
            </div>
          </div>
          <div className="meal-in-day-card__summary-item meal-in-day-card__summary-item--carbs">
            <span className="meal-in-day-card__summary-icon">🍞</span>
            <div className="meal-in-day-card__summary-content">
              <span className="meal-in-day-card__summary-label">W</span>
              <span className="meal-in-day-card__summary-value">{safeMacros.carbs.toFixed(1)}g</span>
            </div>
          </div>
          <div className="meal-in-day-card__summary-item meal-in-day-card__summary-item--fats">
            <span className="meal-in-day-card__summary-icon">🥑</span>
            <div className="meal-in-day-card__summary-content">
              <span className="meal-in-day-card__summary-label">T</span>
              <span className="meal-in-day-card__summary-value">{safeMacros.fats.toFixed(1)}g</span>
            </div>
          </div>
          <div className="meal-in-day-card__expand-icon">{isExpanded ? "▲" : "▼"}</div>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="meal-in-day-card__content">
          {/* Meals List */}
          <div className="meal-in-day-card__meals">
            <h4>Posiłki:</h4>
            {renderMeal("🌅 Śniadanie", mealInDay.breakfast, mealInDay.factorBreakfast)}
            {renderMeal("🥐 Drugie śniadanie", mealInDay.secondBreakfast, mealInDay.factorSecondBreakfast)}
            {renderMeal("🍽️ Obiad", mealInDay.lunch, mealInDay.factorLunch)}
            {renderMeal("☕ Podwieczorek", mealInDay.afternoonSnack, mealInDay.factorAfternoonSnack)}
            {renderMeal("🥘 Kolacja", mealInDay.dinner, mealInDay.factorDinner)}
            {renderMeal("🌙 Kolacja II", mealInDay.supper, mealInDay.factorSupper)}
          </div>

          {/* Loose Products */}
          {looseProducts.length > 0 && (
            <div className="meal-in-day-card__loose-products">
              <h4>Luźne produkty:</h4>
              {looseProducts.map((lp) => {
                const product = lp.product;
                const weight = lp.weight;
                const kcal = ((product.kcalPer100 || product.kcal || 0) * weight) / 100;
                const proteins = ((product.proteinsPer100 || product.proteins || 0) * weight) / 100;
                const carbs =
                  ((product.carbohydratesPer100 || product.carbohydrates || product.sugarAndCarb || 0) * weight) / 100;
                const fats = ((product.fatsPer100 || product.fat || 0) * weight) / 100;

                return (
                  <div key={lp.id} className="meal-in-day-card__loose-product">
                    <div className="meal-in-day-card__loose-product-header">
                      <span className="meal-in-day-card__loose-product-name">{product.name}</span>
                      <span className="meal-in-day-card__loose-product-weight">{weight}g</span>
                    </div>
                    <div className="meal-in-day-card__loose-product-macros">
                      <span className="meal-in-day-card__loose-product-macro">🔥 {kcal.toFixed(0)} kcal</span>
                      <span className="meal-in-day-card__loose-product-macro">🥩 B: {proteins.toFixed(1)}g</span>
                      <span className="meal-in-day-card__loose-product-macro">🍞 W: {carbs.toFixed(1)}g</span>
                      <span className="meal-in-day-card__loose-product-macro">🥑 T: {fats.toFixed(1)}g</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Total Macros */}
          <div className="meal-in-day-card__total-macros">
            <h4>Łącznie:</h4>
            <div className="meal-in-day-card__macros-grid">
              <div className="meal-in-day-card__macro-item">
                <span className="meal-in-day-card__macro-label">Kalorie:</span>
                <span className="meal-in-day-card__macro-value">{safeMacros.calories.toFixed(0)} kcal</span>
              </div>
              <div className="meal-in-day-card__macro-item">
                <span className="meal-in-day-card__macro-label">Białko:</span>
                <span className="meal-in-day-card__macro-value">{safeMacros.proteins.toFixed(1)}g</span>
              </div>
              <div className="meal-in-day-card__macro-item">
                <span className="meal-in-day-card__macro-label">Węglowodany:</span>
                <span className="meal-in-day-card__macro-value">{safeMacros.carbs.toFixed(1)}g</span>
              </div>
              <div className="meal-in-day-card__macro-item">
                <span className="meal-in-day-card__macro-label">Tłuszcze:</span>
                <span className="meal-in-day-card__macro-value">{safeMacros.fats.toFixed(1)}g</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="meal-in-day-card__actions">
            <button
              onClick={() => onEdit(mealInDay)}
              className="meal-in-day-card__button meal-in-day-card__button--edit"
            >
              ✏️ Edytuj
            </button>
            <button
              onClick={() => onDelete(mealInDay.id)}
              className="meal-in-day-card__button meal-in-day-card__button--delete"
            >
              🗑️ Usuń
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealInDayCard;
