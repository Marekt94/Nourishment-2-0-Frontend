import { useState, useEffect, useCallback } from "react";
import { shoppingListService } from "../services/shoppingListService";

/**
 * Custom hook for managing shopping lists
 * 
 * Provides state and operations for ShoppingList CRUD.
 */
const useShoppingLists = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all shopping lists from API
   */
  const fetchShoppingLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await shoppingListService.getShoppingLists();
      setShoppingLists(data || []);
    } catch (err) {
      console.error("Error fetching shopping lists:", err);
      setError(err.response?.data?.message || "Nie udało się pobrać list zakupów");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create new shopping list
   */
  const createShoppingList = useCallback(async (listData) => {
    try {
      setError(null);
      const response = await shoppingListService.createShoppingList(listData);
      const newId = response.id;
      
      // Fetch the complete list with potential initial products
      const fullList = await shoppingListService.getShoppingList(newId);
      setShoppingLists((prev) => [fullList, ...prev]);
      return fullList;
    } catch (err) {
      console.error("Error creating shopping list:", err);
      const errorMsg = err.response?.data?.message || "Nie udało się utworzyć listy zakupów";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Update existing shopping list
   */
  const updateShoppingList = useCallback(async (listData) => {
    try {
      setError(null);
      await shoppingListService.updateShoppingList(listData);
      
      // Fetch full data after update
      const fullList = await shoppingListService.getShoppingList(listData.id);
      setShoppingLists((prev) => prev.map((item) => (item.id === listData.id ? fullList : item)));
      return fullList;
    } catch (err) {
      console.error("Error updating shopping list:", err);
      const errorMsg = err.response?.data?.message || "Nie udało się zaktualizować listy zakupów";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Delete shopping list
   */
  const deleteShoppingList = useCallback(async (id) => {
    try {
      setError(null);
      await shoppingListService.deleteShoppingList(id);
      setShoppingLists((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting shopping list:", err);
      const errorMsg = err.response?.data?.message || "Nie udało się usunąć listy zakupów";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchShoppingLists();
  }, [fetchShoppingLists]);

  return {
    shoppingLists,
    isLoading,
    error,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    refetch: fetchShoppingLists,
  };
};

export default useShoppingLists;
