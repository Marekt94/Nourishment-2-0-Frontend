# Meals Page Implementation

**Date:** 2026-02-16  
**Feature:** Meals management page with CRUD operations  
**Status:** ✅ Basic structure implemented (form pending)

---

## 📋 Overview

Created new page for managing meals (posiłki). Similar structure to Products page but for meal management.

---

## 🔧 Implementation

### 1. **Meal Service** (`src/services/mealService.js`)

API communication layer for meals:

```javascript
- getMeals() - GET /meals - Returns array of meals
- getMeal(id) - GET /meals/{id} - Returns single meal
- createMeal(data) - POST /meals - Returns {id}
- updateMeal(data) - PUT /meals - Returns 200
- deleteMeal(id) - DELETE /meals/{id} - Returns 200
```

**Swagger Definition:**

```yaml
meal.Meal:
  properties:
    id: integer
    name: string
    recipe: string
    productsInMeal: array of meal.ProductInMeal
```

### 2. **useMeals Hook** (`src/hooks/useMeals.js`)

State management for meals:

```javascript
const {
  meals, // Array of meals
  isLoading, // Loading state
  error, // Error message
  createMeal, // Create function
  updateMeal, // Update function
  deleteMeal, // Delete function
  refetch, // Refresh data
} = useMeals();
```

**Features:**

- Auto-fetch on mount
- Handle POST response (only ID returned, merge with data)
- Handle PUT response (no body, use sent data)
- Error handling
- Loading states

### 3. **MealCard Component** (`src/components/features/meals/MealCard.js`)

Expandable meal card with product list:

**Compact View:**

- Meal name
- Products count badge (🍴 X produktów)
- Total macros calculated from all products:
  - Calories (sum of all products × weight)
  - Protein
  - Carbs
  - Fat
- Expand/collapse button

**Expanded View:**

- **Produkty w posiłku** - List of products with:
  - Product name
  - Weight
  - Macros per product (calculated based on weight)
- **Przepis** - Recipe text (if available)
- **Podsumowanie Makroskładników** - Total macros summary
- **Edit/Delete buttons**

**Macro Calculation:**

```javascript
const getTotalMacros = () => {
  return meal.productsInMeal.reduce(
    (totals, item) => {
      const weight = item.weight || 100;
      const factor = weight / 100;

      return {
        calories: totals.calories + (product.kcalPer100 || 0) * factor,
        proteins: totals.proteins + (product.proteins || 0) * factor,
        carbs: totals.carbs + (product.carbohydrates || 0) * factor,
        fat: totals.fat + (product.fat || 0) * factor,
      };
    },
    { calories: 0, proteins: 0, carbs: 0, fat: 0 },
  );
};
```

### 4. **MealList Component** (`src/components/features/meals/MealList.js`)

List container:

- Loading spinner
- Error display
- Empty state ("🍽️ Brak posiłków")
- Maps meals to MealCard components

### 5. **MealsPage** (`src/pages/MealsPage.js`)

Main meals management page:

**Header:**

- Title: "🍽️ Posiłki"
- Navigation buttons:
  - "📦 Produkty" - Go to products page
  - "+ Utwórz Posiłek" - Create new meal
  - "Wyloguj" - Logout

**Search & Filter:**

- Search bar (by meal name)
- Sort options:
  - By name
  - By calories (todo - needs calculation)
  - By protein (todo - needs calculation)

**Form:**

- Placeholder for now ("Formularz posiłku (wkrótce)")
- Cancel button to go back to list

### 6. **Routing** (`src/App.js`)

Added protected route:

```javascript
<Route
  path="/meals"
  element={
    <ProtectedRoute>
      <MealsPage />
    </ProtectedRoute>
  }
/>
```

### 7. **Navigation Updates**

- **ProductsPage**: Added "🍽️ Posiłki" button (green)
- **MealsPage**: Added "📦 Produkty" button (purple)
- Polish labels throughout

---

## 🎨 Visual Design

### Color Scheme:

- **Background gradient**: Green (#10b981 → #059669)
- **Products count badge**: Green gradient
- **Spinner**: Green accent
- **Buttons**:
  - Create: Green
  - Products nav: Purple
  - Logout: Red

### Layout:

```
┌────────────────────────────────────────────────────────┐
│ Meal Name  [🍴 3 produkty]  │ Kcal | Białko | Węgle | Tłuszcze │ [▼] │
├────────────────────────────────────────────────────────┤
│ Expanded:                                              │
│ ┌──────────────────────────────────────────────────┐  │
│ │ PRODUKTY W POSIŁKU                               │  │
│ │ • Product 1 - 150g  🔥 200 kcal 💪 15g 🍞 20g   │  │
│ │ • Product 2 - 100g  🔥 180 kcal 💪 12g 🍞 25g   │  │
│ │ • Product 3 - 50g   🔥 90 kcal  💪 8g  🍞 10g   │  │
│ └──────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────┐  │
│ │ PRZEPIS                                          │  │
│ │ Recipe text here...                              │  │
│ └──────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────┐  │
│ │ PODSUMOWANIE                                     │  │
│ │ 🔥 470 kcal | 💪 35g | 🍞 55g | 🥑 18g           │  │
│ └──────────────────────────────────────────────────┘  │
│ [ Edytuj ]  [ Usuń ]                                  │
└────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Loading Meals:

```
MealsPage mounts
    ↓
useMeals() hook
    ↓
fetchMeals() useEffect
    ↓
mealService.getMeals()
    ↓
GET /meals (backend)
    ↓
Returns array of meals
    ↓
Each meal contains:
  - id, name, recipe
  - productsInMeal: [
      {
        product: { full product data },
        weight: number
      }
    ]
    ↓
MealList renders MealCards
    ↓
Each MealCard calculates totals
```

### Macro Calculation Example:

```javascript
Meal: "Chicken Salad"
Products:
  1. Chicken Breast (150g)
     - kcalPer100: 165
     - proteins: 31
     → 165 * 1.5 = 247.5 kcal
     → 31 * 1.5 = 46.5g protein

  2. Lettuce (100g)
     - kcalPer100: 15
     - proteins: 1.4
     → 15 * 1 = 15 kcal
     → 1.4 * 1 = 1.4g protein

Total: 262.5 kcal, 47.9g protein
```

---

## ⏳ TODO - Meal Form

Need to implement `MealForm.js` component with:

### Fields:

1. **Meal Name** (text input, required)
2. **Recipe** (textarea, optional)
3. **Products in Meal** (dynamic list):
   - Product selector (dropdown with search)
   - Weight input (number, default 100g)
   - Add/Remove product buttons
   - Show calculated macros per product

### Features:

- Search products while typing
- Display product preview (macros per 100g)
- Auto-calculate total macros as products added
- Drag to reorder products
- Validation (at least one product required)

### Example Form Structure:

```jsx
<form>
  <input name="name" placeholder="Nazwa posiłku" />
  <textarea name="recipe" placeholder="Przepis..." />

  <div className="products-selector">
    <h3>Produkty w posiłku:</h3>
    {productsInMeal.map((item, index) => (
      <div key={index}>
        <select value={item.productId}>
          {availableProducts.map((p) => (
            <option value={p.id}>{p.name}</option>
          ))}
        </select>
        <input type="number" value={item.weight} placeholder="Waga (g)" />
        <button onClick={() => removeProduct(index)}>✕</button>
      </div>
    ))}
    <button onClick={addProduct}>+ Dodaj produkt</button>
  </div>

  <div className="total-preview">
    <h4>Suma makroskładników:</h4>
    <span>🔥 {totalCalories} kcal</span>
    <span>💪 {totalProtein}g</span>
    <span>🍞 {totalCarbs}g</span>
    <span>🥑 {totalFat}g</span>
  </div>

  <button type="submit">Zapisz</button>
  <button type="button" onClick={onCancel}>
    Anuluj
  </button>
</form>
```

---

## 📊 Files Created

1. ✅ `src/services/mealService.js` - API service
2. ✅ `src/hooks/useMeals.js` - State hook
3. ✅ `src/components/features/meals/MealCard.js` - Card component
4. ✅ `src/components/features/meals/MealCard.css` - Card styles
5. ✅ `src/components/features/meals/MealList.js` - List component
6. ✅ `src/components/features/meals/MealList.css` - List styles
7. ✅ `src/pages/MealsPage.js` - Main page
8. ✅ `src/pages/MealsPage.css` - Page styles

## 📊 Files Modified

1. ✅ `src/App.js` - Added /meals route
2. ✅ `src/pages/ProductsPage.js` - Added meals navigation button
3. ✅ `src/pages/ProductsPage.css` - Added button styles

---

## 🧪 Testing Checklist

### Basic Functionality:

- [ ] Navigate to /meals from products page
- [ ] Meals load from backend (GET /meals)
- [ ] Loading spinner displays while fetching
- [ ] Empty state if no meals
- [ ] Error state if fetch fails

### Meal Display:

- [ ] Meal name displayed correctly
- [ ] Products count badge shows correct number
- [ ] Total macros calculated correctly
- [ ] Expand/collapse works
- [ ] Products list shows all items
- [ ] Each product shows name, weight, macros
- [ ] Recipe displays if available
- [ ] Summary macros match calculated totals

### Search & Filter:

- [ ] Search filters by meal name
- [ ] Clear button works
- [ ] Sort by name works
- [ ] Empty search results handled

### Navigation:

- [ ] Products button goes to /products
- [ ] Logout button clears token and redirects
- [ ] Protected route requires authentication

### Responsive:

- [ ] Mobile: Layout adapts
- [ ] Mobile: Buttons stack vertically
- [ ] Mobile: Macros display in grid

---

## 🚀 Next Steps

1. **Implement MealForm.js** (HIGH PRIORITY)
   - Product selector with search
   - Weight input per product
   - Real-time macro calculation
   - Create and edit modes

2. **Enhance MealCard**
   - Add nutrition chart/graph
   - Add "Duplicate meal" button
   - Add "Add to day plan" button

3. **Improve Sorting**
   - Implement sort by calories (calculate totals)
   - Implement sort by protein
   - Add filter by total calories range

4. **Backend Integration Testing**
   - Test with real meals from backend
   - Verify productsInMeal structure
   - Test create/update/delete operations

---

## 📝 Summary

**Status:** ✅ Meals page structure complete, form pending

**What Works:**

- ✅ Navigation between Products and Meals
- ✅ Meals list with expandable cards
- ✅ Total macros calculation from products
- ✅ Search and basic sort
- ✅ Delete functionality
- ✅ Protected routing

**What's Missing:**

- ⏳ MealForm component (create/edit)
- ⏳ Product selector in form
- ⏳ Form validation
- ⏳ Advanced sorting (by calculated macros)

**Ready to test:** Navigation, display, search, delete
**Ready to implement:** MealForm for create/edit operations

🍽️ Meals page is ready for testing and form implementation!
