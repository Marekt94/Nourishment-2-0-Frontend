import { useState, useEffect, useCallback } from "react";
import { mealInDayService } from "../services/mealInDayService";

/**
 * Custom hook for managing meals in day
 *
 * Provides state and operations for MealsInDay CRUD.
 *
 * @returns {Object} Hook state and operations
 */
const useMealsInDay = () => {
  const [mealsInDay, setMealsInDay] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all meals in day from API
   */
  const fetchMealsInDay = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await mealInDayService.getMealsInDay();
      setMealsInDay(data || []);
    } catch (err) {
      console.error("Error fetching meals in day:", err);
      setError(err.response?.data?.message || "Nie udało się pobrać planów dnia");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create new meal in day
   * Backend returns only {id}, so we fetch full data after creation
   */
  const createMealInDay = useCallback(async (mealInDayData) => {
    try {
      setError(null);
      const response = await mealInDayService.createMealInDay(mealInDayData);

      // Backend returns {id: integer}, fetch full data from backend
      const newId = response.id;

      // Fetch the complete meal in day data from backend
      const fullMealInDay = await mealInDayService.getMealInDay(newId);

      setMealsInDay((prev) => [...prev, fullMealInDay]);
      return fullMealInDay;
    } catch (err) {
      console.error("❌ Error creating meal in day:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      const errorMsg = err.response?.data?.message || "Nie udało się utworzyć planu dnia";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Update existing meal in day
   * Backend returns 200 with no body, so we fetch full data after update
   */
  const updateMealInDay = useCallback(async (mealInDayData) => {
    try {
      setError(null);
      await mealInDayService.updateMealInDay(mealInDayData);

      // Backend returns no body, fetch full data from backend
      const fullMealInDay = await mealInDayService.getMealInDay(mealInDayData.id);

      setMealsInDay((prev) => prev.map((item) => (item.id === mealInDayData.id ? fullMealInDay : item)));

      return fullMealInDay;
    } catch (err) {
      console.error("Error updating meal in day:", err);
      const errorMsg = err.response?.data?.message || "Nie udało się zaktualizować planu dnia";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Delete meal in day
   */
  const deleteMealInDay = useCallback(async (id) => {
    try {
      setError(null);
      await mealInDayService.deleteMealInDay(id);
      setMealsInDay((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting meal in day:", err);
      const errorMsg = err.response?.data?.message || "Nie udało się usunąć planu dnia";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Refetch meals in day (useful after external changes)
   */
  const refetch = useCallback(() => {
    fetchMealsInDay();
  }, [fetchMealsInDay]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchMealsInDay();
  }, [fetchMealsInDay]);

  return {
    mealsInDay,
    isLoading,
    error,
    createMealInDay,
    updateMealInDay,
    deleteMealInDay,
    refetch,
  };
};

export default useMealsInDay;
