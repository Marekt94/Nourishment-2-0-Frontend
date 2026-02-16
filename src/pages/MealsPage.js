/**
 * MealsPage Component
 * Main page for meals management
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeals } from "../hooks/useMeals";
import { MealList } from "../components/features/meals/MealList";
import "./MealsPage.css";

export const MealsPage = () => {
  const navigate = useNavigate();
  const { meals, isLoading, error, createMeal, updateMeal, deleteMeal } = useMeals();
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, calories, proteins

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

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
        alert("Posiłek zaktualizowany!");
      } else {
        await createMeal(formData);
        alert("Posiłek utworzony!");
      }
      setShowForm(false);
      setEditingMeal(null);
    } catch (err) {
      alert(`Błąd podczas ${editingMeal ? "aktualizacji" : "tworzenia"} posiłku: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMeal(id);
      alert("Posiłek usunięty!");
    } catch (err) {
      alert(`Błąd podczas usuwania posiłku: ${err.message}`);
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
      {/* Header */}
      <header className="meals-page__header">
        <div className="meals-page__header-content">
          <h1 className="meals-page__title">🍽️ Posiłki</h1>
          <div className="meals-page__header-actions">
            <button className="meals-page__button meals-page__button--products" onClick={() => navigate("/products")}>
              📦 Produkty
            </button>
            <button
              className="meals-page__button meals-page__button--mealsinday"
              onClick={() => navigate("/mealsinday")}
            >
              📅 Plany Dnia
            </button>
            <button
              className="meals-page__button meals-page__button--create"
              onClick={handleCreateClick}
              disabled={isLoading}
            >
              + Utwórz Posiłek
            </button>
            <button className="meals-page__button meals-page__button--logout" onClick={handleLogout}>
              Wyloguj
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="meals-page__main">
        <div className="meals-page__container">
          {showForm ? (
            <div className="meals-page__form-wrapper">
              <div className="meals-page__form-placeholder">
                <h3>Formularz posiłku (wkrótce)</h3>
                <p>Tutaj będzie formularz do tworzenia/edycji posiłku</p>
                <button className="meals-page__button meals-page__button--cancel" onClick={handleFormCancel}>
                  Anuluj
                </button>
              </div>
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
