/**
 * MealList Component
 * Displays a list of meals
 */

import React from "react";
import { MealCard } from "./MealCard";
import "./MealList.css";

export const MealList = ({ meals, isLoading, error, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="meal-list__loading">
        <div className="meal-list__spinner"></div>
        <p>Ładowanie posiłków...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meal-list__error">
        <p>❌ {error}</p>
      </div>
    );
  }

  if (!meals || meals.length === 0) {
    return (
      <div className="meal-list__empty">
        <p>🍽️ Brak posiłków. Utwórz pierwszy posiłek!</p>
      </div>
    );
  }

  return (
    <div className="meal-list">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
