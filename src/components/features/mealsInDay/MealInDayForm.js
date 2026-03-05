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
 * - onSuccess            <input
              type="text"
              placeholder="🔍 Szukaj produktu do dodania..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              onFocus={() => setShowProductDropdown(true)}
              className="meal-in-day-form__search-input"
            />(optional) - Called after successful save including loose products
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
  // Index of highlighted item in dropdown (-1 = none)
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Loose products state
  const [looseProducts, setLooseProducts] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [highlightedProductIndex, setHighlightedProductIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } catch (err) {
      console.error("Error loading loose products:", err);
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
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };

      // When switching modes, clear the hidden meal slot
      if (name === "for5Days") {
        if (newValue) {
          // Switching to 5-day: clear lunch
          updated.lunch = null;
        } else {
          // Switching to 4-day: clear dinner and afternoonSnack
          updated.dinner = null;
          updated.afternoonSnack = null;
        }
      }

      return updated;
    });
  };

  const handleMealSelect = (mealSlot, mealId) => {
    setFormData((prev) => ({
      ...prev,
      [mealSlot]: mealId,
    }));
    setOpenDropdown(null);
    setHighlightedIndex(0);
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
    setHighlightedIndex(0); // reset highlight on new search
  };

  const toggleDropdown = (mealSlot) => {
    const next = openDropdown === mealSlot ? null : mealSlot;
    setOpenDropdown(next);
    setHighlightedIndex(0);
  };

  const openNextSlot = (currentKey) => {
    const currentIdx = mealSlots.findIndex((s) => s.key === currentKey);
    const nextSlot = mealSlots[currentIdx + 1];
    if (nextSlot) {
      setOpenDropdown(nextSlot.key);
      setHighlightedIndex(0);
    } else {
      setOpenDropdown(null);
    }
  };

  const handleDropdownKeyDown = (e, mealSlot) => {
    const filtered = getFilteredMeals(mealSlot);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightedIndex]) {
        handleMealSelect(mealSlot, filtered[highlightedIndex].id);
        openNextSlot(mealSlot);
      }
    } else if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      openNextSlot(mealSlot);
    }
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
      setHighlightedProductIndex(0);
    }
  };

  const handleProductSearchKeyDown = (e) => {
    const filtered = getFilteredProducts();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedProductIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedProductIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightedProductIndex]) {
        handleAddLooseProduct(filtered[highlightedProductIndex].id);
      }
    } else if (e.key === "Escape") {
      setShowProductDropdown(false);
    }
  };

  const handleRemoveLooseProduct = async (tempId) => {
    const productToRemove = looseProducts.find((lp) => lp.tempId === tempId);

    // If it has a real ID, delete it from the backend
    if (productToRemove && productToRemove.id && typeof productToRemove.id === "number") {
      try {
        await looseProductInDayService.deleteLooseProduct(productToRemove.id);
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
    const filtered = !searchTerm
      ? products
      : products.filter((product) => product.name?.toLowerCase().includes(searchTerm));

    return filtered;
  };

  const calculateTotalMacros = () => {
    const mealSlots = [
      { meal: formData.breakfast, factor: formData.factorBreakfast },
      { meal: formData.secondBreakfast, factor: formData.factorSecondBreakfast },
      { meal: formData.lunch, factor: formData.factorLunch },
      { meal: formData.dinner, factor: formData.factorDinner },
      { meal: formData.afternoonSnack, factor: formData.factorAfternoonSnack },
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

            const kcal = product.kcalPer100 || 0;
            const proteins = product.proteins || 0;
            const carbs = product.carbohydrates || product.sugarAndCarb || 0;
            const fats = product.fat || 0;

            return {
              calories: sum.calories + (kcal * weight) / 100,
              proteins: sum.proteins + (proteins * weight) / 100,
              carbs: sum.carbs + (carbs * weight) / 100,
              fats: sum.fats + (fats * weight) / 100,
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
        const kcal = product.kcalPer100 || 0;
        const proteins = product.proteins || 0;
        const carbs = product.carbohydrates || product.sugarAndCarb || 0;
        const fats = product.fat || 0;

        return {
          calories: totals.calories + (kcal * weight) / 100,
          proteins: totals.proteins + (proteins * weight) / 100,
          carbs: totals.carbs + (carbs * weight) / 100,
          fats: totals.fats + (fats * weight) / 100,
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

    // Validate only visible meal slots are filled
    const missingMeals = mealSlots.filter((slot) => !formData[slot.key]);
    if (missingMeals.length > 0) {
      const missingLabels = missingMeals.map((m) => m.label).join(", ");
      alert(`Proszę wybrać posiłki dla: ${missingLabels}`);
      return;
    }

    // Factors are always 1.0 — feature not yet used on backend
    const submitData = {
      ...(formData.id && { id: formData.id }),
      name: formData.name.trim(),
      for5Days: formData.for5Days,
      factorBreakfast: 1.0,
      factorSecondBreakfast: 1.0,
      factorLunch: 1.0,
      factorAfternoonSnack: 1.0,
      factorDinner: 1.0,
      factorSupper: 1.0,
    };

    // Include only selected meals as {id} objects.
    // Hidden slots (per 4-day / 5-day rules) are omitted from the request entirely.
    if (formData.breakfast) submitData.breakfast = { id: formData.breakfast };
    if (formData.secondBreakfast) submitData.secondBreakfast = { id: formData.secondBreakfast };
    if (formData.supper) submitData.supper = { id: formData.supper };

    if (formData.for5Days) {
      // 5-day mode: lunch hidden — omit; send dinner + afternoonSnack
      if (formData.dinner) submitData.dinner = { id: formData.dinner };
      if (formData.afternoonSnack) submitData.afternoonSnack = { id: formData.afternoonSnack };
    } else {
      // 4-day mode: dinner + afternoonSnack hidden — omit; send lunch
      if (formData.lunch) submitData.lunch = { id: formData.lunch };
    }

    const isEdit = !!formData.id;
    console.log(`📤 [MealInDayForm] ${isEdit ? "PUT" : "POST"} /mealsinday`, JSON.stringify(submitData, null, 2));

    try {
      setIsSubmitting(true);

      const result = await onSubmit(submitData);
      console.log(`✅ [MealInDayForm] Response:`, result);

      // For create: backend returns {id}; for update: hook returns full object with id
      const dayId = result?.id ?? formData.id;

      if (!dayId) {
        throw new Error("Brak ID planu dnia po zapisaniu");
      }

      // Save loose products
      if (looseProducts.length > 0) {
        for (const lp of looseProducts) {
          if (lp.id) {
            // UPDATE existing
            await looseProductInDayService.updateLooseProductInDay({
              id: lp.id,
              dayId: dayId,
              product: { id: lp.product.id },
              weight: parseFloat(lp.weight),
            });
          } else {
            // CREATE new
            await looseProductInDayService.createLooseProductInDay({
              dayId: dayId,
              product: { id: lp.product.id },
              weight: parseFloat(lp.weight),
            });
          }
        }
      }

      onSuccess?.();
    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
      onError?.(error.message || "Nie udało się utworzyć planu dnia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalMacros = calculateTotalMacros();

  // Meal slots visibility depends on for5Days flag:
  // 5-day mode: no lunch (lunch slot hidden, cleared)
  // 4-day mode (default): no secondBreakfast slot for lunch, instead lunch available; afternoonSnack hidden
  const allMealSlots = [
    { key: "breakfast", label: "🌅 Śniadanie", factorKey: "factorBreakfast", hiddenWhen: null },
    { key: "secondBreakfast", label: "🥐 Drugie śniadanie", factorKey: "factorSecondBreakfast", hiddenWhen: null },
    { key: "lunch", label: "🍽️ Lunch", factorKey: "factorLunch", hiddenWhen: "5days" },
    { key: "dinner", label: "🥘 Obiad", factorKey: "factorDinner", hiddenWhen: "4days" },
    { key: "afternoonSnack", label: "☕ Podwieczorek", factorKey: "factorAfternoonSnack", hiddenWhen: "4days" },
    { key: "supper", label: "🌙 Kolacja", factorKey: "factorSupper", hiddenWhen: null },
  ];

  const mealSlots = allMealSlots.filter(({ hiddenWhen }) => {
    if (hiddenWhen === "5days" && formData.for5Days) return false;
    if (hiddenWhen === "4days" && !formData.for5Days) return false;
    return true;
  });

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
                onKeyDown={(e) => {
                  if (e.key === "Tab" && !e.shiftKey) {
                    e.preventDefault();
                    // Open breakfast dropdown and focus its search input
                    const firstSlotKey = mealSlots[0]?.key;
                    if (firstSlotKey) {
                      setOpenDropdown(firstSlotKey);
                      setHighlightedIndex(0);
                      // autoFocus on the dropdown search input handles the rest
                    }
                  }
                }}
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
                      {getSelectedMealName(key) || "🍽️ Wybierz posiłek..."}
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
                          onKeyDown={(e) => handleDropdownKeyDown(e, key)}
                          className="meal-in-day-form__dropdown-search"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                        <div className="meal-in-day-form__dropdown-list">
                          {getFilteredMeals(key).length === 0 ? (
                            <div className="meal-in-day-form__dropdown-empty">Brak posiłków</div>
                          ) : (
                            getFilteredMeals(key).map((meal, idx) => (
                              <div
                                key={meal.id}
                                className={`meal-in-day-form__dropdown-item ${
                                  formData[key] === meal.id ? "meal-in-day-form__dropdown-item--selected" : ""
                                } ${idx === highlightedIndex ? "meal-in-day-form__dropdown-item--highlighted" : ""}`}
                                onMouseEnter={() => setHighlightedIndex(idx)}
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loose Products */}
      <div className="meal-in-day-form__section">
        <h3 className="meal-in-day-form__section-title">
          🥗 Luźne produkty{" "}
          {looseProducts.length > 0 && <span className="meal-in-day-form__count">({looseProducts.length})</span>}
        </h3>
        <p className="meal-in-day-form__hint">
          Dodaj produkty spoza posiłków (przekąski, napoje, suplementy itp.). Możesz dodać wiele produktów.
        </p>

        {/* Product Dropdown */}
        <div className="meal-in-day-form__product-search">
          <div className="meal-in-day-form__dropdown-container">
            <input
              type="text"
              placeholder="🔍 Szukaj produktu do dodania..."
              value={productSearchTerm}
              onChange={(e) => {
                setProductSearchTerm(e.target.value);
                setHighlightedProductIndex(0);
              }}
              onFocus={() => setShowProductDropdown(true)}
              onKeyDown={handleProductSearchKeyDown}
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
                    getFilteredProducts().map((product, idx) => (
                      <div
                        key={product.id}
                        className={`meal-in-day-form__dropdown-item ${
                          idx === highlightedProductIndex ? "meal-in-day-form__dropdown-item--highlighted" : ""
                        }`}
                        onMouseEnter={() => setHighlightedProductIndex(idx)}
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
            {looseProducts.map((lp, index) => (
              <div key={lp.tempId} className="meal-in-day-form__loose-product-item">
                <div className="meal-in-day-form__loose-product-number">{index + 1}</div>
                <div className="meal-in-day-form__loose-product-info">
                  <span className="meal-in-day-form__loose-product-name">{lp.product.name}</span>
                  <span className="meal-in-day-form__loose-product-macros">
                    {(((lp.product.kcalPer100 || 0) * lp.weight) / 100).toFixed(0)} kcal | B:{" "}
                    {(((lp.product.proteins || 0) * lp.weight) / 100).toFixed(1)}g | W:{" "}
                    {(((lp.product.carbohydrates || lp.product.sugarAndCarb || 0) * lp.weight) / 100).toFixed(1)}g | T:{" "}
                    {(((lp.product.fat || 0) * lp.weight) / 100).toFixed(1)}g
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
        {looseProducts.length === 0 && (
          <p className="meal-in-day-form__empty-message">
            ➕ Nie dodano jeszcze żadnych luźnych produktów. Użyj wyszukiwarki powyżej, aby dodać pierwszy produkt.
          </p>
        )}
        {looseProducts.length > 0 && (
          <p className="meal-in-day-form__hint-add-more">
            💡 Wskazówka: Możesz dodać kolejne produkty używając wyszukiwarki powyżej
          </p>
        )}
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
          disabled={isLoading || mealsLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? "Zapisywanie..." : mealInDay ? "Zaktualizuj" : "Utwórz"}
        </button>
      </div>
    </form>
  );
};
