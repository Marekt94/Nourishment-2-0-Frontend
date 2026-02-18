import React, { useState, useEffect, useRef } from "react";
import { useMeals } from "../../../hooks/useMeals";
import { useProducts } from "../../../hooks/useProducts";
import { looseProductInDayService } from "../../../services/looseProductInDayService";
import "./MealInDayForm.css";

/**
 * MealInDayForm Component
 * Form for creating/editing daily meal plans
 *
 * Props:
 * - mealInDay: Object (optional) - MealInDay to edit
 * - onSubmit: Function - Called with form data on submit, should return {id} or promise
 * - onCancel: Function - Called when user cancels
 * - onSuccess: Function (optional) - Called after successful save including loose products
 * - onError: Function (optional) - Called if save fails
 * - isLoading: Boolean - Shows loading state
 */
export const MealInDayForm = ({ mealInDay, onSubmit, onCancel, onSuccess, onError, isLoading }) => {
  const { meals, isLoading: mealsLoading } = useMeals();
  const { products, isLoading: productsLoading } = useProducts();
  const dropdownRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    for5Days: false,
    breakfast: null,
    secondBreakfast: null,
    lunch: null,
    afternoonSnack: null,
    dinner: null,
    supper: null,
    factorBreakfast: 1.0,
    factorSecondBreakfast: 1.0,
    factorLunch: 1.0,
    factorAfternoonSnack: 1.0,
    factorDinner: 1.0,
    factorSupper: 1.0,
  });

  // Search states for meal selectors
  const [searchTerms, setSearchTerms] = useState({
    breakfast: "",
    secondBreakfast: "",
    lunch: "",
    afternoonSnack: "",
    dinner: "",
    supper: "",
  });

  // Dropdown visibility states
  const [openDropdown, setOpenDropdown] = useState(null);

  // Loose products state
  const [looseProducts, setLooseProducts] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Initialize form with existing data when editing
  useEffect(() => {
    if (mealInDay) {
      setFormData({
        id: mealInDay.id,
        name: mealInDay.name || "",
        for5Days: mealInDay.for5Days || false,
        breakfast: mealInDay.breakfast?.id || null,
        secondBreakfast: mealInDay.secondBreakfast?.id || null,
        lunch: mealInDay.lunch?.id || null,
        afternoonSnack: mealInDay.afternoonSnack?.id || null,
        dinner: mealInDay.dinner?.id || null,
        supper: mealInDay.supper?.id || null,
        factorBreakfast: mealInDay.factorBreakfast || 1.0,
        factorSecondBreakfast: mealInDay.factorSecondBreakfast || 1.0,
        factorLunch: mealInDay.factorLunch || 1.0,
        factorAfternoonSnack: mealInDay.factorAfternoonSnack || 1.0,
        factorDinner: mealInDay.factorDinner || 1.0,
        factorSupper: mealInDay.factorSupper || 1.0,
      });

      // Load loose products for editing
      if (mealInDay.id) {
        loadLooseProducts(mealInDay.id);
      }
    } else {
      // Reset form for new meal plan
      setFormData({
        id: null,
        name: "",
        for5Days: false,
        breakfast: null,
        secondBreakfast: null,
        lunch: null,
        afternoonSnack: null,
        dinner: null,
        supper: null,
        factorBreakfast: 1.0,
        factorSecondBreakfast: 1.0,
        factorLunch: 1.0,
        factorAfternoonSnack: 1.0,
        factorDinner: 1.0,
        factorSupper: 1.0,
      });
      setLooseProducts([]);
    }
  }, [mealInDay]);

  /**
   * Load loose products for editing mode
   */
  const loadLooseProducts = async (dayId) => {
    try {
      const data = await looseProductInDayService.getLooseProductsByDay(dayId);
      // Convert to form format with tempId
      const formattedLooseProducts = (data || []).map((lp) => ({
        id: lp.id, // Keep real ID for editing
        tempId: lp.id, // Use real ID as tempId for now
        product: lp.product,
        weight: lp.weight,
      }));
      setLooseProducts(formattedLooseProducts);
      console.log("📥 Loaded loose products for editing:", formattedLooseProducts);
    } catch (err) {
      console.log("Error loading loose products:", err);
      setLooseProducts([]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openDropdown]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFactorChange = (mealSlot, value) => {
    const numValue = parseFloat(value) || 1.0;
    setFormData((prev) => ({
      ...prev,
      [mealSlot]: Math.max(0.1, Math.min(10, numValue)), // Limit between 0.1 and 10
    }));
  };

  const handleMealSelect = (mealSlot, mealId) => {
    setFormData((prev) => ({
      ...prev,
      [mealSlot]: mealId,
    }));
    setOpenDropdown(null);
    setSearchTerms((prev) => ({ ...prev, [mealSlot]: "" }));
  };

  const handleClearMeal = (mealSlot) => {
    setFormData((prev) => ({
      ...prev,
      [mealSlot]: null,
    }));
  };

  const handleSearchChange = (mealSlot, value) => {
    setSearchTerms((prev) => ({ ...prev, [mealSlot]: value }));
  };

  const toggleDropdown = (mealSlot) => {
    setOpenDropdown(openDropdown === mealSlot ? null : mealSlot);
  };

  const getFilteredMeals = (mealSlot) => {
    const searchTerm = searchTerms[mealSlot].toLowerCase();
    if (!searchTerm) return meals;
    return meals.filter((meal) => meal.name?.toLowerCase().includes(searchTerm));
  };

  const getSelectedMealName = (mealSlot) => {
    const mealId = formData[mealSlot];
    if (!mealId) return null;
    const meal = meals.find((m) => m.id === mealId);
    return meal?.name || "Nieznana potrawa";
  };

  // Loose products handlers
  const handleAddLooseProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const newLooseProduct = {
        tempId: Date.now(), // Temporary ID for React key
        product: product,
        weight: 100, // Default weight
      };
      setLooseProducts((prev) => [...prev, newLooseProduct]);
      setShowProductDropdown(false);
      setProductSearchTerm("");
    }
  };

  const handleRemoveLooseProduct = async (tempId) => {
    const productToRemove = looseProducts.find((lp) => lp.tempId === tempId);

    // If it has a real ID, delete it from the backend
    if (productToRemove && productToRemove.id && typeof productToRemove.id === "number") {
      try {
        console.log("🗑️ Deleting loose product from backend:", productToRemove.id);
        await looseProductInDayService.deleteLooseProduct(productToRemove.id);
        console.log("✅ Loose product deleted successfully");
      } catch (err) {
        console.error("❌ Error deleting loose product:", err);
        alert("Błąd podczas usuwania produktu");
        return; // Don't remove from UI if backend delete failed
      }
    }

    // Remove from local state
    setLooseProducts((prev) => prev.filter((lp) => lp.tempId !== tempId));
  };

  const handleLooseProductWeightChange = (tempId, weight) => {
    const numWeight = parseFloat(weight) || 0;
    setLooseProducts((prev) =>
      prev.map((lp) => (lp.tempId === tempId ? { ...lp, weight: Math.max(0, numWeight) } : lp)),
    );
  };

  const getFilteredProducts = () => {
    const searchTerm = productSearchTerm.toLowerCase();
    if (!searchTerm) return products;
    return products.filter((product) => product.name?.toLowerCase().includes(searchTerm));
  };

  const calculateTotalMacros = () => {
    const mealSlots = [
      { meal: formData.breakfast, factor: formData.factorBreakfast },
      { meal: formData.secondBreakfast, factor: formData.factorSecondBreakfast },
      { meal: formData.lunch, factor: formData.factorLunch },
      { meal: formData.afternoonSnack, factor: formData.factorAfternoonSnack },
      { meal: formData.dinner, factor: formData.factorDinner },
      { meal: formData.supper, factor: formData.factorSupper },
    ];

    // Calculate macros from meals
    const mealTotals = mealSlots.reduce(
      (totals, { meal: mealId, factor }) => {
        if (!mealId) return totals;
        const meal = meals.find((m) => m.id === mealId);
        if (!meal?.productsInMeal) return totals;

        const mealMacros = meal.productsInMeal.reduce(
          (sum, item) => {
            const weight = item.weight || 100;
            const product = item.product || {};
            return {
              calories: sum.calories + ((product.kcalPer100 || 0) * weight) / 100,
              proteins: sum.proteins + ((product.proteinsPer100 || 0) * weight) / 100,
              carbs: sum.carbs + ((product.carbohydratesPer100 || 0) * weight) / 100,
              fats: sum.fats + ((product.fatsPer100 || 0) * weight) / 100,
            };
          },
          { calories: 0, proteins: 0, carbs: 0, fats: 0 },
        );

        return {
          calories: totals.calories + mealMacros.calories * factor,
          proteins: totals.proteins + mealMacros.proteins * factor,
          carbs: totals.carbs + mealMacros.carbs * factor,
          fats: totals.fats + mealMacros.fats * factor,
        };
      },
      { calories: 0, proteins: 0, carbs: 0, fats: 0 },
    );

    // Add macros from loose products
    const looseProductTotals = looseProducts.reduce(
      (totals, { product, weight }) => {
        return {
          calories: totals.calories + ((product.kcalPer100 || 0) * weight) / 100,
          proteins: totals.proteins + ((product.proteinsPer100 || product.proteins || 0) * weight) / 100,
          carbs: totals.carbs + ((product.carbohydratesPer100 || product.carbohydrates || 0) * weight) / 100,
          fats: totals.fats + ((product.fatsPer100 || product.fat || 0) * weight) / 100,
        };
      },
      { calories: 0, proteins: 0, carbs: 0, fats: 0 },
    );

    // Combine both
    return {
      calories: mealTotals.calories + looseProductTotals.calories,
      proteins: mealTotals.proteins + looseProductTotals.proteins,
      carbs: mealTotals.carbs + looseProductTotals.carbs,
      fats: mealTotals.fats + looseProductTotals.fats,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.name.trim()) {
      alert("Nazwa planu dnia jest wymagana");
      return;
    }

    // Validate all 6 meals are selected
    const requiredMeals = [
      { key: "breakfast", label: "Śniadanie" },
      { key: "secondBreakfast", label: "Drugie śniadanie" },
      { key: "lunch", label: "Obiad" },
      { key: "afternoonSnack", label: "Podwieczorek" },
      { key: "dinner", label: "Kolacja" },
      { key: "supper", label: "Kolacja II" },
    ];

    const missingMeals = requiredMeals.filter((meal) => !formData[meal.key]);
    if (missingMeals.length > 0) {
      const missingLabels = missingMeals.map((m) => m.label).join(", ");
      alert(`Proszę wybrać posiłki dla: ${missingLabels}`);
      return;
    }

    // Prepare data for backend
    // Backend expects meal references as objects with just {id}
    // Only include meals that are actually selected (not null)
    const submitData = {
      ...(formData.id && { id: formData.id }),
      name: formData.name.trim(),
      for5Days: formData.for5Days,
      factorBreakfast: formData.factorBreakfast,
      factorSecondBreakfast: formData.factorSecondBreakfast,
      factorLunch: formData.factorLunch,
      factorAfternoonSnack: formData.factorAfternoonSnack,
      factorDinner: formData.factorDinner,
      factorSupper: formData.factorSupper,
    };

    // Only add meal fields if they are selected
    if (formData.breakfast) submitData.breakfast = { id: formData.breakfast };
    if (formData.secondBreakfast) submitData.secondBreakfast = { id: formData.secondBreakfast };
    if (formData.lunch) submitData.lunch = { id: formData.lunch };
    if (formData.afternoonSnack) submitData.afternoonSnack = { id: formData.afternoonSnack };
    if (formData.dinner) submitData.dinner = { id: formData.dinner };
    if (formData.supper) submitData.supper = { id: formData.supper };

    console.log("📤 Submitting meal in day data:", submitData);
    console.log("📤 Loose products to save:", looseProducts);

    try {
      // Submit the meal plan first
      const result = await onSubmit(submitData);

      // Get the dayId from the result or from formData (edit mode)
      const dayId = result?.id || formData.id;

      console.log("✅ Meal plan saved, dayId:", dayId);

      if (!dayId) {
        console.error("❌ No dayId available for loose products");
        alert("Błąd: Nie udało się uzyskać ID planu dnia");
        if (onError) onError(new Error("No dayId returned"));
        return;
      }

      // Save loose products if any
      if (looseProducts.length > 0) {
        console.log(`📤 Saving ${looseProducts.length} loose products for day ${dayId}`);

        for (const lp of looseProducts) {
          const looseProductData = {
            dayId: dayId,
            product: { id: lp.product.id },
            weight: lp.weight,
          };

          // If loose product has real ID, update it; otherwise create new
          if (lp.id && typeof lp.id === "number") {
            looseProductData.id = lp.id;
            console.log("📤 Updating loose product:", looseProductData);
            await looseProductInDayService.updateLooseProduct(looseProductData);
          } else {
            console.log("📤 Creating new loose product:", looseProductData);
            await looseProductInDayService.createLooseProduct(looseProductData);
          }
        }

        console.log("✅ All loose products saved successfully");
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
      // Call error callback if provided
      if (onError) {
        onError(error);
      } else {
        alert("Błąd podczas zapisywania planu dnia");
      }
      throw error;
    }
  };

  const totalMacros = calculateTotalMacros();

  const mealSlots = [
    { key: "breakfast", label: "🌅 Śniadanie", factorKey: "factorBreakfast" },
    { key: "secondBreakfast", label: "🥐 Drugie śniadanie", factorKey: "factorSecondBreakfast" },
    { key: "lunch", label: "🍽️ Obiad", factorKey: "factorLunch" },
    { key: "afternoonSnack", label: "☕ Podwieczorek", factorKey: "factorAfternoonSnack" },
    { key: "dinner", label: "🥘 Kolacja", factorKey: "factorDinner" },
    { key: "supper", label: "🌙 Kolacja II", factorKey: "factorSupper" },
  ];

  return (
    <form className="meal-in-day-form" onSubmit={handleSubmit}>
      <div className="meal-in-day-form__header">
        <h2 className="meal-in-day-form__title">{mealInDay ? "✏️ Edytuj Plan Dnia" : "➕ Utwórz Nowy Plan Dnia"}</h2>
      </div>

      {/* Basic Info */}
      <div className="meal-in-day-form__section">
        <h3 className="meal-in-day-form__section-title">Podstawowe informacje</h3>

        <div className="meal-in-day-form__row">
          <div className="meal-in-day-form__field meal-in-day-form__field--full">
            <label className="meal-in-day-form__label">Nazwa planu dnia *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="np. Plan standard, Plan wysokobiałkowy..."
              className="meal-in-day-form__input"
              required
            />
          </div>
        </div>

        <div className="meal-in-day-form__row">
          <div className="meal-in-day-form__field">
            <label className="meal-in-day-form__checkbox-label">
              <input
                type="checkbox"
                name="for5Days"
                checked={formData.for5Days}
                onChange={handleInputChange}
                className="meal-in-day-form__checkbox"
              />
              <span>📅 Plan na 5 dni</span>
            </label>
          </div>
        </div>
      </div>

      {/* Meals Selection */}
      <div className="meal-in-day-form__section">
        <h3 className="meal-in-day-form__section-title">Posiłki</h3>

        {mealsLoading ? (
          <div className="meal-in-day-form__loading">Ładowanie posiłków...</div>
        ) : (
          <div className="meal-in-day-form__meals">
            {mealSlots.map(({ key, label, factorKey }) => (
              <div key={key} className="meal-in-day-form__meal-slot">
                <label className="meal-in-day-form__label">{label}</label>

                <div className="meal-in-day-form__meal-row">
                  {/* Meal Selector */}
                  <div className="meal-in-day-form__meal-selector" ref={openDropdown === key ? dropdownRef : null}>
                    <div className="meal-in-day-form__selected-meal" onClick={() => toggleDropdown(key)}>
                      {getSelectedMealName(key) || "Wybierz posiłek..."}
                      <span className="meal-in-day-form__dropdown-arrow">▼</span>
                    </div>

                    {formData[key] && (
                      <button
                        type="button"
                        className="meal-in-day-form__clear-meal"
                        onClick={() => handleClearMeal(key)}
                      >
                        ✕
                      </button>
                    )}

                    {openDropdown === key && (
                      <div className="meal-in-day-form__dropdown">
                        <input
                          type="text"
                          placeholder="🔍 Szukaj..."
                          value={searchTerms[key]}
                          onChange={(e) => handleSearchChange(key, e.target.value)}
                          className="meal-in-day-form__dropdown-search"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="meal-in-day-form__dropdown-list">
                          {getFilteredMeals(key).length === 0 ? (
                            <div className="meal-in-day-form__dropdown-empty">Brak posiłków</div>
                          ) : (
                            getFilteredMeals(key).map((meal) => (
                              <div
                                key={meal.id}
                                className={`meal-in-day-form__dropdown-item ${
                                  formData[key] === meal.id ? "meal-in-day-form__dropdown-item--selected" : ""
                                }`}
                                onClick={() => handleMealSelect(key, meal.id)}
                              >
                                {meal.name}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Factor Input */}
                  <div className="meal-in-day-form__factor">
                    <label className="meal-in-day-form__factor-label">×</label>
                    <input
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={formData[factorKey]}
                      onChange={(e) => handleFactorChange(factorKey, e.target.value)}
                      className="meal-in-day-form__factor-input"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loose Products */}
      <div className="meal-in-day-form__section">
        <h3 className="meal-in-day-form__section-title">🥗 Luźne produkty</h3>

        {/* Product Dropdown */}
        <div className="meal-in-day-form__product-search">
          <div className="meal-in-day-form__dropdown-container">
            <input
              type="text"
              placeholder="🔍 Szukaj produktu do dodania..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              onFocus={() => setShowProductDropdown(true)}
              className="meal-in-day-form__search-input"
            />
            {showProductDropdown && (
              <div className="meal-in-day-form__dropdown-wrapper">
                <div className="meal-in-day-form__dropdown">
                  {productsLoading ? (
                    <div className="meal-in-day-form__dropdown-item meal-in-day-form__dropdown-item--disabled">
                      Ładowanie produktów...
                    </div>
                  ) : getFilteredProducts().length === 0 ? (
                    <div className="meal-in-day-form__dropdown-item meal-in-day-form__dropdown-item--disabled">
                      Brak produktów
                    </div>
                  ) : (
                    getFilteredProducts().map((product) => (
                      <div
                        key={product.id}
                        className="meal-in-day-form__dropdown-item"
                        onClick={() => handleAddLooseProduct(product.id)}
                      >
                        {product.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          {showProductDropdown && (
            <div className="meal-in-day-form__dropdown-overlay" onClick={() => setShowProductDropdown(false)} />
          )}
        </div>

        {/* Loose Products List */}
        {looseProducts.length > 0 && (
          <div className="meal-in-day-form__loose-products-list">
            {looseProducts.map((lp) => (
              <div key={lp.tempId} className="meal-in-day-form__loose-product-item">
                <div className="meal-in-day-form__loose-product-info">
                  <span className="meal-in-day-form__loose-product-name">{lp.product.name}</span>
                  <span className="meal-in-day-form__loose-product-macros">
                    {(((lp.product.kcalPer100 || 0) * lp.weight) / 100).toFixed(0)} kcal | B:{" "}
                    {(((lp.product.proteinsPer100 || lp.product.proteins || 0) * lp.weight) / 100).toFixed(1)}g | W:{" "}
                    {(((lp.product.carbohydratesPer100 || lp.product.carbohydrates || 0) * lp.weight) / 100).toFixed(1)}
                    g | T: {(((lp.product.fatsPer100 || lp.product.fat || 0) * lp.weight) / 100).toFixed(1)}g
                  </span>
                </div>
                <div className="meal-in-day-form__loose-product-controls">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={lp.weight}
                    onChange={(e) => handleLooseProductWeightChange(lp.tempId, e.target.value)}
                    className="meal-in-day-form__loose-product-weight"
                  />
                  <span className="meal-in-day-form__loose-product-unit">g</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLooseProduct(lp.tempId)}
                    className="meal-in-day-form__loose-product-remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {looseProducts.length === 0 && <p className="meal-in-day-form__empty-message">Nie dodano luźnych produktów</p>}
      </div>

      {/* Total Macros Preview */}
      <div className="meal-in-day-form__section">
        <h3 className="meal-in-day-form__section-title">📊 Podsumowanie makroskładników</h3>
        <div className="meal-in-day-form__macros">
          <div className="meal-in-day-form__macro">
            <span className="meal-in-day-form__macro-label">Kalorie</span>
            <span className="meal-in-day-form__macro-value">{totalMacros.calories.toFixed(0)} kcal</span>
          </div>
          <div className="meal-in-day-form__macro">
            <span className="meal-in-day-form__macro-label">Białko</span>
            <span className="meal-in-day-form__macro-value">{totalMacros.proteins.toFixed(1)}g</span>
          </div>
          <div className="meal-in-day-form__macro">
            <span className="meal-in-day-form__macro-label">Węglowodany</span>
            <span className="meal-in-day-form__macro-value">{totalMacros.carbs.toFixed(1)}g</span>
          </div>
          <div className="meal-in-day-form__macro">
            <span className="meal-in-day-form__macro-label">Tłuszcze</span>
            <span className="meal-in-day-form__macro-value">{totalMacros.fats.toFixed(1)}g</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="meal-in-day-form__actions">
        <button
          type="button"
          onClick={onCancel}
          className="meal-in-day-form__button meal-in-day-form__button--cancel"
          disabled={isLoading}
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="meal-in-day-form__button meal-in-day-form__button--submit"
          disabled={isLoading || mealsLoading}
        >
          {isLoading ? "Zapisywanie..." : mealInDay ? "Zaktualizuj" : "Utwórz"}
        </button>
      </div>
    </form>
  );
};
