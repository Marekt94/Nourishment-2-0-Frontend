/**
 * MealsPage Component
 * Main page for meals management
 */

import React, { useState } from "react";
import { useMeals } from "../hooks/useMeals";
import { MealList } from "../components/features/meals/MealList";
import { MealForm } from "../components/features/meals/MealForm";
import { useToast } from "../contexts/ToastContext";
import "./MealsPage.css";

export const MealsPage = () => {
  const { addToast } = useToast();
  const { meals, isLoading, error, createMeal, updateMeal, deleteMeal } = useMeals();
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, calories, proteins

  const handleCreateClick = () => {
    setEditingMeal(null);
    setShowForm(true);
  };

  const handleEditClick = (meal) => {
    setEditingMeal(meal);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMeal(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingMeal) {
        await updateMeal(formData);
        addToast("Posiłek zaktualizowany!", "success");
      } else {
        await createMeal(formData);
        addToast("Posiłek utworzony!", "success");
      }
      setShowForm(false);
      setEditingMeal(null);
    } catch (err) {
      addToast(`Błąd podczas ${editingMeal ? "aktualizacji" : "tworzenia"} posiłku: ${err.message}`, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMeal(id);
      addToast("Posiłek usunięty!", "success");
    } catch (err) {
      addToast(`Błąd podczas usuwania posiłku: ${err.message}`, "error");
    }
  };

  // Filter and sort meals
  const filteredMeals = meals
    .filter((meal) => {
      // Search by name
      return meal.name?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      // For calories/proteins sorting, we'd need to calculate totals
      // For now, just sort by name
      return 0;
    });

  return (
    <div className="meals-page">
      {/* Page Header */}
      <div className="meals-page__header">
        <h1 className="meals-page__title">🍽️ Potrawy</h1>
        {!showForm && (
          <button onClick={handleCreateClick} className="meals-page__create-button">
            <span className="meals-page__create-icon">➕</span>
            Dodaj Potrawę
          </button>
        )}
      </div>

      {/* Main Content */}
      <main className="meals-page__main">
        <div className="meals-page__container">
          {showForm ? (
            <div className="meals-page__form-wrapper">
              <MealForm 
                meal={editingMeal} 
                onSubmit={handleFormSubmit} 
                onCancel={handleFormCancel} 
                isLoading={isLoading} 
              />
            </div>
          ) : (
            <>
              {/* Search and Filter Bar */}
              <div className="meals-page__controls">
                <div className="meals-page__search-wrapper">
                  <input
                    type="text"
                    className="meals-page__search"
                    placeholder="🔍 Szukaj posiłków po nazwie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="meals-page__clear-search"
                      onClick={() => setSearchTerm("")}
                      title="Wyczyść wyszukiwanie"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <select className="meals-page__sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Sortuj po nazwie</option>
                  <option value="calories">Sortuj po kaloriach</option>
                  <option value="proteins">Sortuj po białku</option>
                </select>
              </div>

              <MealList
                meals={filteredMeals}
                isLoading={isLoading}
                error={error}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};
