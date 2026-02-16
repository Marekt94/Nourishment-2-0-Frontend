import React, { useState } from "react";
import "./MealInDayCard.css";

/**
 * MealInDayCard Component
 *
 * Displays a single daily meal plan with all meals (breakfast to supper).
 * Expandable to show detailed meal information and macros.
 */
const MealInDayCard = ({ mealInDay, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedMeals, setExpandedMeals] = useState({});

  /**
   * Calculate total macros for all meals in the day
   */
  const getTotalMacros = () => {
    const meals = [
      { meal: mealInDay.breakfast, factor: mealInDay.factorBreakfast || 1 },
      { meal: mealInDay.secondBreakfast, factor: mealInDay.factorSecondBreakfast || 1 },
      { meal: mealInDay.lunch, factor: mealInDay.factorLunch || 1 },
      { meal: mealInDay.afternoonSnack, factor: mealInDay.factorAfternoonSnack || 1 },
      { meal: mealInDay.dinner, factor: mealInDay.factorDinner || 1 },
      { meal: mealInDay.supper, factor: mealInDay.factorSupper || 1 },
    ];

    return meals.reduce(
      (totals, { meal, factor }) => {
        if (!meal || !meal.productsInMeal) return totals;

        const mealMacros = meal.productsInMeal.reduce(
          (mealTotals, item) => {
            const product = item.product;
            const weight = item.weight || 100;
            const productFactor = weight / 100;

            return {
              calories: mealTotals.calories + (product?.kcalPer100 || 0) * productFactor,
              proteins: mealTotals.proteins + (product?.proteins || 0) * productFactor,
              carbs: mealTotals.carbs + (product?.carbohydrates || 0) * productFactor,
              fat: mealTotals.fat + (product?.fat || 0) * productFactor,
            };
          },
          { calories: 0, proteins: 0, carbs: 0, fat: 0 },
        );

        return {
          calories: totals.calories + mealMacros.calories * factor,
          proteins: totals.proteins + mealMacros.proteins * factor,
          carbs: totals.carbs + mealMacros.carbs * factor,
          fat: totals.fat + mealMacros.fat * factor,
        };
      },
      { calories: 0, proteins: 0, carbs: 0, fat: 0 },
    );
  };

  /**
   * Count total number of meals (non-null)
   */
  const getMealsCount = () => {
    return [
      mealInDay.breakfast,
      mealInDay.secondBreakfast,
      mealInDay.lunch,
      mealInDay.afternoonSnack,
      mealInDay.dinner,
      mealInDay.supper,
    ].filter(Boolean).length;
  };

  /**
   * Get macros for a single meal
   */
  const getMealMacros = (meal, factor = 1) => {
    if (!meal || !meal.productsInMeal) {
      return { calories: 0, proteins: 0, carbs: 0, fat: 0 };
    }

    const mealTotals = meal.productsInMeal.reduce(
      (totals, item) => {
        const product = item.product;
        const weight = item.weight || 100;
        const productFactor = weight / 100;

        return {
          calories: totals.calories + (product?.kcalPer100 || 0) * productFactor,
          proteins: totals.proteins + (product?.proteins || 0) * productFactor,
          carbs: totals.carbs + (product?.carbohydrates || 0) * productFactor,
          fat: totals.fat + (product?.fat || 0) * productFactor,
        };
      },
      { calories: 0, proteins: 0, carbs: 0, fat: 0 },
    );

    return {
      calories: mealTotals.calories * factor,
      proteins: mealTotals.proteins * factor,
      carbs: mealTotals.carbs * factor,
      fat: mealTotals.fat * factor,
    };
  };

  const totals = getTotalMacros();
  const mealsCount = getMealsCount();

  const handleDelete = () => {
    if (window.confirm(`Czy na pewno chcesz usunąć plan dnia "${mealInDay.name}"?`)) {
      onDelete(mealInDay.id);
    }
  };

  const toggleMealExpansion = (key) => {
    setExpandedMeals((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const mealSlots = [
    { key: "breakfast", label: "🌅 Śniadanie", meal: mealInDay.breakfast, factor: mealInDay.factorBreakfast },
    {
      key: "secondBreakfast",
      label: "🥐 II Śniadanie",
      meal: mealInDay.secondBreakfast,
      factor: mealInDay.factorSecondBreakfast,
    },
    { key: "lunch", label: "🍽️ Obiad", meal: mealInDay.lunch, factor: mealInDay.factorLunch },
    {
      key: "afternoonSnack",
      label: "☕ Podwieczorek",
      meal: mealInDay.afternoonSnack,
      factor: mealInDay.factorAfternoonSnack,
    },
    { key: "dinner", label: "🍲 Kolacja", meal: mealInDay.dinner, factor: mealInDay.factorDinner },
    { key: "supper", label: "🥛 Kolacja II", meal: mealInDay.supper, factor: mealInDay.factorSupper },
  ];

  return (
    <div className="meal-in-day-card">
      <div className="meal-in-day-card__compact" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="meal-in-day-card__header">
          <h3 className="meal-in-day-card__name">{mealInDay.name || "Plan bez nazwy"}</h3>
          {mealInDay.for5Days && (
            <span className="meal-in-day-card__badge meal-in-day-card__badge--5days">📅 5 dni</span>
          )}
          <span className="meal-in-day-card__badge">
            🍽️ {mealsCount} {mealsCount === 1 ? "posiłek" : mealsCount < 5 ? "posiłki" : "posiłków"}
          </span>
        </div>
        <div className="meal-in-day-card__macros">
          <span className="meal-in-day-card__macro">
            <strong>🔥</strong> {totals.calories.toFixed(0)} kcal
          </span>
          <span className="meal-in-day-card__macro">
            <strong>💪</strong> {totals.proteins.toFixed(1)}g
          </span>
          <span className="meal-in-day-card__macro">
            <strong>🍞</strong> {totals.carbs.toFixed(1)}g
          </span>
          <span className="meal-in-day-card__macro">
            <strong>🥑</strong> {totals.fat.toFixed(1)}g
          </span>
        </div>
        <button className="meal-in-day-card__expand-btn">{isExpanded ? "▲" : "▼"}</button>
      </div>

      {isExpanded && (
        <div className="meal-in-day-card__details">
          <div className="meal-in-day-card__meals">
            <h4>📋 Posiłki w dniu</h4>
            {mealSlots.map(({ key, label, meal, factor }) => {
              if (!meal) {
                return (
                  <div key={key} className="meal-in-day-card__meal-slot meal-in-day-card__meal-slot--empty">
                    <span className="meal-in-day-card__meal-label">{label}</span>
                    <span className="meal-in-day-card__meal-empty">Brak posiłku</span>
                  </div>
                );
              }

              const macros = getMealMacros(meal, factor || 1);
              const productsCount = meal.productsInMeal?.length || 0;
              const isMealExpanded = expandedMeals[key];

              return (
                <div key={key} className="meal-in-day-card__meal-slot">
                  <div
                    className="meal-in-day-card__meal-header"
                    onClick={() => toggleMealExpansion(key)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="meal-in-day-card__meal-label">{label}</span>
                    <span className="meal-in-day-card__meal-name">{meal.name}</span>
                    {factor && factor !== 1 && (
                      <span className="meal-in-day-card__meal-factor">×{factor.toFixed(2)}</span>
                    )}
                    <button className="meal-in-day-card__meal-expand-btn">{isMealExpanded ? "▲" : "▼"}</button>
                  </div>
                  <div className="meal-in-day-card__meal-info">
                    <span className="meal-in-day-card__meal-products">
                      {productsCount} {productsCount === 1 ? "produkt" : productsCount < 5 ? "produkty" : "produktów"}
                    </span>
                    <div className="meal-in-day-card__meal-macros">
                      <span>🔥 {macros.calories.toFixed(0)}</span>
                      <span>💪 {macros.proteins.toFixed(1)}g</span>
                      <span>🍞 {macros.carbs.toFixed(1)}g</span>
                      <span>🥑 {macros.fat.toFixed(1)}g</span>
                    </div>
                  </div>

                  {isMealExpanded && meal.productsInMeal && meal.productsInMeal.length > 0 && (
                    <div className="meal-in-day-card__meal-products-list">
                      <h5>Składniki:</h5>
                      {meal.productsInMeal.map((item, idx) => {
                        const product = item.product;
                        const weight = item.weight || 100;
                        const productFactor = weight / 100;

                        return (
                          <div key={idx} className="meal-in-day-card__product-item">
                            <span className="meal-in-day-card__product-name">
                              {product?.name || "Produkt bez nazwy"}
                            </span>
                            <span className="meal-in-day-card__product-weight">{weight}g</span>
                            <div className="meal-in-day-card__product-macros">
                              <span>🔥 {((product?.kcalPer100 || 0) * productFactor).toFixed(0)}</span>
                              <span>💪 {((product?.proteins || 0) * productFactor).toFixed(1)}g</span>
                              <span>🍞 {((product?.carbohydrates || 0) * productFactor).toFixed(1)}g</span>
                              <span>🥑 {((product?.fat || 0) * productFactor).toFixed(1)}g</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="meal-in-day-card__summary">
            <h4>📊 Podsumowanie dnia</h4>
            <div className="meal-in-day-card__summary-macros">
              <div className="meal-in-day-card__summary-item">
                <span className="meal-in-day-card__summary-label">🔥 Kalorie</span>
                <span className="meal-in-day-card__summary-value">{totals.calories.toFixed(0)} kcal</span>
              </div>
              <div className="meal-in-day-card__summary-item">
                <span className="meal-in-day-card__summary-label">💪 Białko</span>
                <span className="meal-in-day-card__summary-value">{totals.proteins.toFixed(1)}g</span>
              </div>
              <div className="meal-in-day-card__summary-item">
                <span className="meal-in-day-card__summary-label">🍞 Węglowodany</span>
                <span className="meal-in-day-card__summary-value">{totals.carbs.toFixed(1)}g</span>
              </div>
              <div className="meal-in-day-card__summary-item">
                <span className="meal-in-day-card__summary-label">🥑 Tłuszcze</span>
                <span className="meal-in-day-card__summary-value">{totals.fat.toFixed(1)}g</span>
              </div>
            </div>
          </div>

          <div className="meal-in-day-card__actions">
            <button className="meal-in-day-card__btn meal-in-day-card__btn--edit" onClick={() => onEdit(mealInDay)}>
              ✏️ Edytuj
            </button>
            <button className="meal-in-day-card__btn meal-in-day-card__btn--delete" onClick={handleDelete}>
              🗑️ Usuń
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealInDayCard;
