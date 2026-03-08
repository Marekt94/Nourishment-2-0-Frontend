import React from "react";
import MealInDayCard from "./MealInDayCard";
import "./MealInDayList.css";

/**
 * MealInDayList Component
 *
 * Renders list of daily meal plans
 */
const MealInDayList = ({ mealsInDay, isLoading, error, onEdit, onDelete, onCreateShoppingList }) => {
  if (isLoading) {
    return (
      <div className="meal-in-day-list__loading">
        <div className="meal-in-day-list__spinner"></div>
        <p>Ładowanie planów dnia...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meal-in-day-list__error">
        <span className="meal-in-day-list__error-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!mealsInDay || mealsInDay.length === 0) {
    return (
      <div className="meal-in-day-list__empty">
        <span className="meal-in-day-list__empty-icon">📅</span>
        <p>Brak planów dnia</p>
        <small>Utwórz pierwszy plan dnia, aby zacząć</small>
      </div>
    );
  }

  return (
    <div className="meal-in-day-list">
      {mealsInDay.map((mealInDay, index) => (
        <MealInDayCard
          key={mealInDay.id || `meal-in-day-${index}`}
          mealInDay={mealInDay}
          onEdit={onEdit}
          onDelete={onDelete}
          onCreateShoppingList={onCreateShoppingList}
        />
      ))}
    </div>
  );
};

export default MealInDayList;
