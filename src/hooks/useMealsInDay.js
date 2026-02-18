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
   * Backend returns only {id}, so we merge it with sent data
   */
  const createMealInDay = useCallback(async (mealInDayData) => {
    try {
      setError(null);
      console.log("📤 Creating meal in day with data:", mealInDayData);
      const response = await mealInDayService.createMealInDay(mealInDayData);

      // Backend returns {id: integer}, merge with sent data
      const newMealInDay = {
        ...mealInDayData,
        id: response.id,
      };

      setMealsInDay((prev) => [...prev, newMealInDay]);
      return newMealInDay;
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
   * Backend returns 200 with no body, so we use sent data
   */
  const updateMealInDay = useCallback(async (mealInDayData) => {
    try {
      setError(null);
      await mealInDayService.updateMealInDay(mealInDayData);

      // Backend returns no body, use sent data
      setMealsInDay((prev) => prev.map((item) => (item.id === mealInDayData.id ? mealInDayData : item)));

      return mealInDayData;
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
