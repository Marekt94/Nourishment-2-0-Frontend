import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useMealsInDay from "../hooks/useMealsInDay";
import MealInDayList from "../components/features/mealsInDay/MealInDayList";
import { authService } from "../services/authService";
import "./MealsInDayPage.css";

/**
 * MealsInDayPage Component
 *
 * Main page for managing daily meal plans.
 * Displays list of meal plans with search and filter options.
 */
const MealsInDayPage = () => {
  const navigate = useNavigate();
  const { mealsInDay, isLoading, error, deleteMealInDay } = useMealsInDay();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, calories, 5days
  const [showForm, setShowForm] = useState(false);
  const [editingMealInDay, setEditingMealInDay] = useState(null);

  /**
   * Filter and sort meals in day
   */
  const filteredMealsInDay = useMemo(() => {
    let filtered = [...mealsInDay];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => item.name?.toLowerCase().includes(query));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");

        case "calories": {
          // Calculate total calories for both
          const calcCalories = (mealInDay) => {
            const meals = [
              { meal: mealInDay.breakfast, factor: mealInDay.factorBreakfast || 1 },
              { meal: mealInDay.secondBreakfast, factor: mealInDay.factorSecondBreakfast || 1 },
              { meal: mealInDay.lunch, factor: mealInDay.factorLunch || 1 },
              { meal: mealInDay.afternoonSnack, factor: mealInDay.factorAfternoonSnack || 1 },
              { meal: mealInDay.dinner, factor: mealInDay.factorDinner || 1 },
              { meal: mealInDay.supper, factor: mealInDay.factorSupper || 1 },
            ];

            return meals.reduce((total, { meal, factor }) => {
              if (!meal?.productsInMeal) return total;
              const mealCal = meal.productsInMeal.reduce((sum, item) => {
                const weight = item.weight || 100;
                return sum + ((item.product?.kcalPer100 || 0) * weight) / 100;
              }, 0);
              return total + mealCal * factor;
            }, 0);
          };

          return calcCalories(b) - calcCalories(a);
        }

        case "5days":
          // Sort by for5Days flag (true first)
          return (b.for5Days ? 1 : 0) - (a.for5Days ? 1 : 0);

        default:
          return 0;
      }
    });

    return filtered;
  }, [mealsInDay, searchQuery, sortBy]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleCreateNew = () => {
    setEditingMealInDay(null);
    setShowForm(true);
  };

  const handleEdit = (mealInDay) => {
    setEditingMealInDay(mealInDay);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMealInDay(id);
    } catch (err) {
      console.error("Error deleting meal in day:", err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMealInDay(null);
  };

  return (
    <div className="meals-in-day-page">
      {/* Header */}
      <header className="meals-in-day-page__header">
        <div className="meals-in-day-page__title-section">
          <h1 className="meals-in-day-page__title">📅 Plany Dnia</h1>
          <p className="meals-in-day-page__subtitle">Zarządzaj planami posiłków na cały dzień</p>
        </div>
        <div className="meals-in-day-page__header-buttons">
          <button
            className="meals-in-day-page__button meals-in-day-page__button--products"
            onClick={() => navigate("/products")}
          >
            📦 Produkty
          </button>
          <button
            className="meals-in-day-page__button meals-in-day-page__button--meals"
            onClick={() => navigate("/meals")}
          >
            🍽️ Posiłki
          </button>
          <button className="meals-in-day-page__button meals-in-day-page__button--create" onClick={handleCreateNew}>
            + Utwórz Plan Dnia
          </button>
          <button className="meals-in-day-page__button meals-in-day-page__button--logout" onClick={handleLogout}>
            Wyloguj
          </button>
        </div>
      </header>

      {/* Search and Filter Controls */}
      {!showForm && (
        <div className="meals-in-day-page__controls">
          <div className="meals-in-day-page__search">
            <input
              type="text"
              placeholder="🔍 Szukaj planu dnia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="meals-in-day-page__search-input"
            />
            {searchQuery && (
              <button className="meals-in-day-page__clear-btn" onClick={() => setSearchQuery("")}>
                ✕
              </button>
            )}
          </div>

          <div className="meals-in-day-page__filters">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="meals-in-day-page__sort-select"
            >
              <option value="name">📝 Sortuj: Nazwa</option>
              <option value="calories">🔥 Sortuj: Kalorie</option>
              <option value="5days">📅 Sortuj: 5 dni</option>
            </select>
          </div>
        </div>
      )}

      {/* Form (Placeholder) */}
      {showForm && (
        <div className="meals-in-day-page__form">
          <div className="meals-in-day-page__form-placeholder">
            <h3>{editingMealInDay ? "✏️ Edytuj Plan Dnia" : "➕ Utwórz Nowy Plan Dnia"}</h3>
            <p>Formularz planu dnia (wkrótce)</p>
            <p className="meals-in-day-page__form-info">
              Tutaj będzie formularz do tworzenia/edycji planów dnia z możliwością:
            </p>
            <ul className="meals-in-day-page__form-features">
              <li>📝 Nazwa planu dnia</li>
              <li>📅 Opcja "dla 5 dni"</li>
              <li>🌅 Śniadanie + mnożnik</li>
              <li>🥐 II Śniadanie + mnożnik</li>
              <li>🍽️ Obiad + mnożnik</li>
              <li>☕ Podwieczorek + mnożnik</li>
              <li>🍲 Kolacja + mnożnik</li>
              <li>🥛 Kolacja II + mnożnik</li>
              <li>📊 Podgląd sumy makroskładników na żywo</li>
            </ul>
            <button className="meals-in-day-page__button meals-in-day-page__button--cancel" onClick={handleFormClose}>
              Powrót do listy
            </button>
          </div>
        </div>
      )}

      {/* Meals In Day List */}
      {!showForm && (
        <div className="meals-in-day-page__content">
          <MealInDayList
            mealsInDay={filteredMealsInDay}
            isLoading={isLoading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

export default MealsInDayPage;
