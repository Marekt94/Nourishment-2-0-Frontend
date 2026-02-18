import React, { useState, useMemo } from "react";
import useMealsInDay from "../hooks/useMealsInDay";
import MealInDayList from "../components/features/mealsInDay/MealInDayList";
import { MealInDayForm } from "../components/features/mealsInDay/MealInDayForm";
import "./MealsInDayPage.css";

/**
 * MealsInDayPage Component
 *
 * Main page for managing daily meal plans.
 * Displays list of meal plans with search and filter options.
 */
const MealsInDayPage = () => {
  const { mealsInDay, isLoading, error, createMealInDay, updateMealInDay, deleteMealInDay } = useMealsInDay();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, calories, 5days
  const [showForm, setShowForm] = useState(false);
  const [editingMealInDay, setEditingMealInDay] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let result;
      if (editingMealInDay) {
        result = await updateMealInDay(formData);
      } else {
        result = await createMealInDay(formData);
      }
      // Return result immediately so form can save loose products
      return result;
    } catch (err) {
      console.error("Form submit error:", err);
      setIsSubmitting(false); // Reset on error
      throw err; // Re-throw so the form can handle it
    }
  };

  const handleFormComplete = () => {
    // Called after form successfully completes (including loose products)
    setIsSubmitting(false);
    setShowForm(false);
    setEditingMealInDay(null);
    if (editingMealInDay) {
      alert("Plan dnia zaktualizowany!");
    } else {
      alert("Plan dnia utworzony!");
    }
  };

  const handleFormError = (err) => {
    // Called if form encounters an error
    setIsSubmitting(false);
    alert(`Błąd: ${err.message}`);
  };

  return (
    <div className="meals-in-day-page">
      {/* Header */}
      <header className="meals-in-day-page__header">
        <div className="meals-in-day-page__header-content">
          <h1 className="meals-in-day-page__title">📅 Plany Dnia</h1>
          <div className="meals-in-day-page__header-actions">
            <button className="meals-in-day-page__button meals-in-day-page__button--create" onClick={handleCreateNew}>
              + Utwórz Plan Dnia
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="meals-in-day-page__main">
        <div className="meals-in-day-page__container">
          {showForm ? (
            <div className="meals-in-day-page__form-wrapper">
              <MealInDayForm
                mealInDay={editingMealInDay}
                onSubmit={handleFormSubmit}
                onSuccess={handleFormComplete}
                onError={handleFormError}
                onCancel={handleFormClose}
                isLoading={isSubmitting}
              />
            </div>
          ) : (
            <>
              {/* Search and Filter Controls */}
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

              {/* Meals List */}
              <MealInDayList
                mealsInDay={filteredMealsInDay}
                isLoading={isLoading}
                error={error}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MealsInDayPage;
