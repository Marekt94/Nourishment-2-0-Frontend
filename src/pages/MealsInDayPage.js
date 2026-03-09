import React, { useState } from "react";
import useMealsInDay from "../hooks/useMealsInDay";
import MealInDayCard from "../components/features/mealsInDay/MealInDayCard";
import { MealInDayForm } from "../components/features/mealsInDay/MealInDayForm";
import GenerateShoppingListDialog from "../components/features/mealsInDay/GenerateShoppingListDialog";
import { useToast } from "../contexts/ToastContext";
import "./MealsInDayPage.css";

const MealsInDayPage = () => {
  const { addToast } = useToast();
  const { mealsInDay, isLoading, error, createMealInDay, updateMealInDay, deleteMealInDay } = useMealsInDay();
  const [showForm, setShowForm] = useState(false);
  const [editingMealInDay, setEditingMealInDay] = useState(null);
  
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedMealForGenerate, setSelectedMealForGenerate] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, calories

  const handleCreate = () => {
    setEditingMealInDay(null);
    setShowForm(true);
  };

  const handleEdit = (mealInDay) => {
    setEditingMealInDay(mealInDay);
    setShowForm(true);
  };

  const handleCreateShoppingList = (mealInDay) => {
    setSelectedMealForGenerate(mealInDay);
    setShowGenerateDialog(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMealInDay(null);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingMealInDay) {
        return await updateMealInDay(data);
      } else {
        return await createMealInDay(data);
      }
    } catch (error) {
      console.error("Error saving meal in day:", error);
      throw error;
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingMealInDay(null);
  };

  const handleFormError = (errorMessage) => {
    addToast(errorMessage, "error");
  };

  const handleDelete = async (id) => {
    try {
      await deleteMealInDay(id);
    } catch (error) {
      console.error("Error deleting meal in day:", error);
      addToast("Nie udało się usunąć planu dnia", "error");
    }
  };

  // Filter and sort meals in day
  const filteredMealsInDay = mealsInDay
    .filter((mealInDay) => {
      // Search by name
      return mealInDay.name?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      // For calories sorting, we'd need to calculate totals
      // For now, just sort by name
      return 0;
    });

  return (
    <div className="meals-in-day-page">
      <div className="meals-in-day-page__header">
        <h1 className="meals-in-day-page__title">🗓️ Plany Dnia</h1>
        {!showForm && (
          <button onClick={handleCreate} className="meals-in-day-page__create-button">
            <span className="meals-in-day-page__create-icon">➕</span>
            Utwórz Plan Dnia
          </button>
        )}
      </div>

      {isLoading && (
        <div className="meals-in-day-page__loading">
          <div className="meals-in-day-page__spinner"></div>
          <p>Ładowanie planów dnia...</p>
        </div>
      )}

      {error && (
        <div className="meals-in-day-page__error">
          <span className="meals-in-day-page__error-icon">⚠️</span>
          <p>Błąd: {error}</p>
        </div>
      )}

      {showForm && !isLoading && !error && (
        <div className="meals-in-day-page__form-container">
          <MealInDayForm
            mealInDay={editingMealInDay}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            onSuccess={handleFormSuccess}
            onError={handleFormError}
            isLoading={isLoading}
          />
        </div>
      )}

      {!showForm && !isLoading && !error && (
        <>
          {/* Search and Filter Bar */}
          {mealsInDay.length > 0 && (
            <div className="meals-in-day-page__controls">
              <div className="meals-in-day-page__search-wrapper">
                <input
                  type="text"
                  className="meals-in-day-page__search"
                  placeholder="🔍 Szukaj planów po nazwie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="meals-in-day-page__clear-search"
                    onClick={() => setSearchTerm("")}
                    title="Wyczyść wyszukiwanie"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select className="meals-in-day-page__sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Sortuj po nazwie</option>
                <option value="calories">Sortuj po kaloriach</option>
              </select>
            </div>
          )}

          <div className="meals-in-day-page__list">
            {mealsInDay.length === 0 ? (
              <div className="meals-in-day-page__empty">
                <span className="meals-in-day-page__empty-icon">📭</span>
                <h3>Brak planów dnia</h3>
                <p>Kliknij "Utwórz Plan Dnia", aby dodać pierwszy plan</p>
              </div>
            ) : filteredMealsInDay.length === 0 ? (
              <div className="meals-in-day-page__empty">
                <span className="meals-in-day-page__empty-icon">🔍</span>
                <h3>Nie znaleziono wyników</h3>
                <p>Spróbuj zmienić kryteria wyszukiwania</p>
              </div>
            ) : (
              <>
                <div className="meals-in-day-page__list-header">
                  <span className="meals-in-day-page__count">
                    Znaleziono: <strong>{filteredMealsInDay.length}</strong>{" "}
                    {filteredMealsInDay.length === 1 ? "plan" : "planów"}
                  </span>
                </div>
                {filteredMealsInDay.map((mealInDay) => (
                  <MealInDayCard 
                    key={mealInDay.id} 
                    mealInDay={mealInDay} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                    onCreateShoppingList={handleCreateShoppingList}
                  />
                ))}
              </>
            )}
          </div>
        </>
      )}

      {showGenerateDialog && (
        <GenerateShoppingListDialog 
          open={showGenerateDialog}
          initialMealInDay={selectedMealForGenerate}
          onClose={() => {
            setShowGenerateDialog(false);
            setSelectedMealForGenerate(null);
          }}
        />
      )}
    </div>
  );
};

export default MealsInDayPage;
