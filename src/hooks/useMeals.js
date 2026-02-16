/**
 * Custom hook for meals management
 * Provides meals state and operations
 */

import { useState, useEffect, useCallback } from "react";
import { mealService } from "../services/mealService";

export const useMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all meals
   */
  const fetchMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mealService.getMeals();
      console.log("🍽️ useMeals - Raw data from backend:", data);
      console.log("🍽️ useMeals - Total meals:", data?.length);

      setMeals(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch meals");
      console.error("Fetch meals error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create new meal
   * Note: Backend POST /meals returns only {id: number}, not full meal
   */
  const createMeal = useCallback(async (mealData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mealService.createMeal(mealData);
      // Backend returns {id: number}, merge with submitted data
      const newMeal = { ...mealData, id: response.id };
      setMeals((prev) => [...prev, newMeal]);
      return newMeal;
    } catch (err) {
      setError(err.message || "Failed to create meal");
      console.error("Create meal error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update existing meal
   * Note: Backend PUT /meals returns 200 with no body, uses data we sent
   */
  const updateMeal = useCallback(async (mealData) => {
    setIsLoading(true);
    setError(null);
    try {
      await mealService.updateMeal(mealData);
      // Backend returns 200 with no body, update with data we sent
      setMeals((prev) => prev.map((m) => (m.id === mealData.id ? mealData : m)));
      return mealData;
    } catch (err) {
      setError(err.message || "Failed to update meal");
      console.error("Update meal error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete meal
   */
  const deleteMeal = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await mealService.deleteMeal(id);
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete meal");
      console.error("Delete meal error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh meals list
   */
  const refetch = useCallback(() => {
    fetchMeals();
  }, [fetchMeals]);

  // Fetch meals on mount
  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return {
    meals,
    isLoading,
    error,
    createMeal,
    updateMeal,
    deleteMeal,
    refetch,
  };
};
