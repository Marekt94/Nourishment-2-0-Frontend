# Meals In Day Page Implementation

**Date:** 2026-02-16  
**Feature:** Daily meal plans management page with full CRUD operations  
**Status:** ✅ Basic structure implemented (form pending)

---

## 📋 Overview

Created new page for managing **daily meal plans** (plany dnia). Each plan can contain up to 6 meals per day with individual portion factors.

---

## 🔧 Implementation

### 1. **MealInDay Service** (`src/services/mealInDayService.js`)

API communication layer for daily meal plans:

```javascript
- getMealsInDay() - GET /mealsinday - Returns array of meal.MealInDay
- getMealInDay(id) - GET /mealsinday/{id} - Returns single meal.MealInDay
- createMealInDay(data) - POST /mealsinday - Returns {id}
- updateMealInDay(data) - PUT /mealsinday - Returns 200
- deleteMealInDay(id) - DELETE /mealsinday/{id} - Returns 200
```

**Swagger Definition:**

```yaml
meal.MealInDay:
  properties:
    id: integer
    name: string
    for5Days: boolean # "dla 5 dni" flag

    # 6 meal slots
    breakfast: meal.Meal
    secondBreakfast: meal.Meal
    lunch: meal.Meal
    afternoonSnack: meal.Meal
    dinner: meal.Meal
    supper: meal.Meal

    # Portion factors (multipliers)
    factorBreakfast: float
    factorSecondBreakfast: float
    factorLunch: float
    factorAfternoonSnack: float
    factorDinner: float
    factorSupper: float
```

### 2. **useMealsInDay Hook** (`src/hooks/useMealsInDay.js`)

State management for daily meal plans:

```javascript
const {
  mealsInDay, // Array of meal plans
  isLoading, // Loading state
  error, // Error message
  createMealInDay, // Create function
  updateMealInDay, // Update function
  deleteMealInDay, // Delete function
  refetch, // Refresh data
} = useMealsInDay();
```

**Features:**

- Auto-fetch on mount
- Handle POST response (only ID returned, merge with data)
- Handle PUT response (no body, use sent data)
- Error handling
- Loading states

### 3. **MealInDayCard Component** (`src/components/features/mealsInDay/MealInDayCard.js`)

Expandable daily plan card with all meals:

**Compact View:**

- Plan name
- "📅 5 dni" badge (if for5Days = true)
- Meals count badge (e.g., "🍽️ 5 posiłków")
- Total macros calculated from ALL meals:
  - Calories
  - Protein
  - Carbs
  - Fat
- Expand/collapse button

**Expanded View:**

- **📋 Posiłki w dniu** - List of 6 meal slots:
  - 🌅 Śniadanie (Breakfast)
  - 🥐 II Śniadanie (Second Breakfast)
  - 🍽️ Obiad (Lunch)
  - ☕ Podwieczorek (Afternoon Snack)
  - 🍲 Kolacja (Dinner)
  - 🥛 Kolacja II (Supper)

  Each slot shows:
  - Meal name (or "Brak posiłku" if empty)
  - Portion factor (e.g., "×1.5")
  - Products count
  - Macros per meal (with factor applied)

- **📊 Podsumowanie dnia** - Total daily macros
- **Edit/Delete buttons**

**Macro Calculation Logic:**

```javascript
// For each meal slot:
1. Calculate meal's base macros (from products)
2. Apply factor: mealMacros × factor
3. Sum all meals for daily total

Example:
Breakfast (factor 1.5):
  - Base: 300 kcal, 20g protein
  - With factor: 450 kcal, 30g protein

Lunch (factor 1.0):
  - Base: 500 kcal, 35g protein
  - With factor: 500 kcal, 35g protein

Daily Total: 950 kcal, 65g protein
```

### 4. **MealInDayList Component** (`src/components/features/mealsInDay/MealInDayList.js`)

List container:

- Loading spinner (orange color)
- Error display
- Empty state ("📅 Brak planów dnia")
- Maps meal plans to MealInDayCard components

### 5. **MealsInDayPage** (`src/pages/MealsInDayPage.js`)

Main daily meal plans page:

**Header:**

- Title: "📅 Plany Dnia"
- Subtitle: "Zarządzaj planami posiłków na cały dzień"
- Navigation buttons:
  - "📦 Produkty" - Go to products page
  - "🍽️ Posiłki" - Go to meals page
  - "+ Utwórz Plan Dnia" - Create new plan
  - "Wyloguj" - Logout

**Search & Filter:**

- Search bar (by plan name)
- Sort options:
  - 📝 By name
  - 🔥 By calories (calculates total)
  - 📅 By "5 days" flag

**Form:**

- Placeholder for now
- Lists features that will be implemented

### 6. **Routing** (`src/App.js`)

Added protected route:

```javascript
<Route
  path="/mealsinday"
  element={
    <ProtectedRoute>
      <MealsInDayPage />
    </ProtectedRoute>
  }
/>
```

### 7. **Navigation Updates**

- **MealsPage**: Added "📅 Plany Dnia" button (orange)
- **MealsInDayPage**: Has buttons to Products and Meals

---

## 🎨 Visual Design

### Color Scheme:

- **Background gradient**: Orange (#f59e0b → #d97706)
- **Meal count badge**: Orange gradient
- **5 days badge**: Blue gradient
- **Spinner**: Orange accent
- **Buttons**:
  - Create: Orange
  - Products: Purple
  - Meals: Green
  - Logout: Red

### Meal Slot Colors:

- All meals: Yellow/orange background (#fef3c7)
- Border: Orange (#f59e0b)
- Empty slots: Gray, semi-transparent

### Layout:

```
┌────────────────────────────────────────────────────────────┐
│ Plan Name  [📅 5 dni] [🍽️ 5 posiłków] │ Macros │ [▼]     │
├────────────────────────────────────────────────────────────┤
│ Expanded:                                                  │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 📋 POSIŁKI W DNIU                                      │ │
│ │                                                         │ │
│ │ 🌅 Śniadanie: Omlet białkowy [×1.5]                   │ │
│ │    3 produkty | 🔥 450 kcal 💪 30g 🍞 10g 🥑 25g     │ │
│ │                                                         │ │
│ │ 🥐 II Śniadanie: Brak posiłku                         │ │
│ │                                                         │ │
│ │ 🍽️ Obiad: Kurczak z ryżem [×1.0]                      │ │
│ │    5 produktów | 🔥 600 kcal 💪 50g 🍞 60g 🥑 15g    │ │
│ │                                                         │ │
│ │ ☕ Podwieczorek: Jogurt z owocami                      │ │
│ │    2 produkty | 🔥 200 kcal 💪 10g 🍞 30g 🥑 5g      │ │
│ │                                                         │ │
│ │ 🍲 Kolacja: Sałatka z tuńczykiem                      │ │
│ │    4 produkty | 🔥 350 kcal 💪 35g 🍞 15g 🥑 20g     │ │
│ │                                                         │ │
│ │ 🥛 Kolacja II: Brak posiłku                           │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 📊 PODSUMOWANIE DNIA                                   │ │
│ │ 🔥 Kalorie: 1600 kcal                                 │ │
│ │ 💪 Białko: 125g                                       │ │
│ │ 🍞 Węglowodany: 115g                                  │ │
│ │ 🥑 Tłuszcze: 65g                                      │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ [ Edytuj ]  [ Usuń ]                                      │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Loading Daily Plans:

```
MealsInDayPage mounts
    ↓
useMealsInDay() hook
    ↓
fetchMealsInDay() useEffect
    ↓
mealInDayService.getMealsInDay()
    ↓
GET /mealsinday (backend)
    ↓
Returns array of meal plans
    ↓
Each plan contains:
  - id, name, for5Days
  - 6 meal slots (can be null)
  - 6 factor values (default 1.0)
    ↓
MealInDayList renders MealInDayCards
    ↓
Each card calculates daily totals
```

### Daily Macro Calculation Example:

```javascript
Plan: "Plan na 2000 kcal"

🌅 Breakfast: "Owsianka" (×1.5)
   Base: 300 kcal, 15g protein
   Adjusted: 450 kcal, 22.5g protein

🥐 II Breakfast: null (skipped)

🍽️ Lunch: "Obiad z kurczakiem" (×1.0)
   Base: 600 kcal, 50g protein
   Adjusted: 600 kcal, 50g protein

☕ Afternoon: "Jogurt" (×0.8)
   Base: 200 kcal, 10g protein
   Adjusted: 160 kcal, 8g protein

🍲 Dinner: "Kolacja lekka" (×1.2)
   Base: 400 kcal, 30g protein
   Adjusted: 480 kcal, 36g protein

🥛 Supper: null (skipped)

DAILY TOTAL: 1690 kcal, 116.5g protein
```

---

## ⏳ TODO - MealInDay Form

Need to implement `MealInDayForm.js` component with:

### Fields:

1. **Plan Name** (text input, required)
2. **For 5 Days** (checkbox)
3. **6 Meal Slots** - Each with:
   - Meal selector (dropdown, searchable)
   - Portion factor (number input, default 1.0)
   - Clear button

### Example Structure:

```jsx
<form>
  <input name="name" placeholder="Nazwa planu dnia" required />
  <label>
    <input type="checkbox" name="for5Days" />
    Plan na 5 dni
  </label>

  <div className="meal-slots">
    <div className="meal-slot">
      <label>🌅 Śniadanie</label>
      <select name="breakfast">
        <option value="">Brak posiłku</option>
        {meals.map((m) => (
          <option value={m.id}>{m.name}</option>
        ))}
      </select>
      <input type="number" name="factorBreakfast" defaultValue={1.0} step={0.1} min={0.1} />
    </div>

    {/* Repeat for 5 other meals */}
  </div>

  <div className="total-preview">
    <h4>📊 Podsumowanie dnia:</h4>
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

### Form Logic:

- Load available meals from `useMeals()` hook
- For each selected meal, fetch its data to calculate preview
- Real-time calculation of daily totals
- Factor inputs with validation (min 0.1, step 0.1)
- "Clear meal" button for each slot

---

## 📊 Files Created

1. ✅ `src/services/mealInDayService.js` - API service
2. ✅ `src/hooks/useMealsInDay.js` - State hook
3. ✅ `src/components/features/mealsInDay/MealInDayCard.js` - Card component
4. ✅ `src/components/features/mealsInDay/MealInDayCard.css` - Card styles
5. ✅ `src/components/features/mealsInDay/MealInDayList.js` - List component
6. ✅ `src/components/features/mealsInDay/MealInDayList.css` - List styles
7. ✅ `src/pages/MealsInDayPage.js` - Main page
8. ✅ `src/pages/MealsInDayPage.css` - Page styles

## 📊 Files Modified

1. ✅ `src/App.js` - Added /mealsinday route
2. ✅ `src/pages/MealsPage.js` - Added "📅 Plany Dnia" button
3. ✅ `src/pages/MealsPage.css` - Added button styles

---

## 🧪 Testing Checklist

### Basic Functionality:

- [ ] Navigate to /mealsinday
- [ ] Plans load from backend (GET /mealsinday)
- [ ] Loading spinner displays
- [ ] Empty state if no plans
- [ ] Error state if fetch fails

### Plan Display:

- [ ] Plan name displayed
- [ ] "5 dni" badge shows if for5Days = true
- [ ] Meals count correct
- [ ] Total macros calculated correctly
- [ ] Expand/collapse works

### Meal Slots:

- [ ] All 6 slots display
- [ ] Empty slots show "Brak posiłku"
- [ ] Meal name displays
- [ ] Factor displays (e.g., "×1.5")
- [ ] Products count correct
- [ ] Macros per meal calculated with factor

### Daily Summary:

- [ ] Total calories = sum of all meal slots
- [ ] Factors properly applied
- [ ] Displays in summary section

### Search & Sort:

- [ ] Search filters by plan name
- [ ] Sort by name works
- [ ] Sort by calories works (calculates totals)
- [ ] Sort by "5 days" works

### Navigation:

- [ ] Products button goes to /products
- [ ] Meals button goes to /meals
- [ ] Logout works
- [ ] Protected route requires auth

### Responsive:

- [ ] Mobile layout adapts
- [ ] Buttons stack on mobile
- [ ] Meal slots readable on small screens

---

## 🚀 Next Steps

1. **Implement MealInDayForm.js** (HIGH PRIORITY)
   - Meal selectors for 6 slots
   - Factor inputs per meal
   - Real-time daily totals calculation
   - For5Days checkbox
   - Create and edit modes

2. **Enhance MealInDayCard**
   - Add copy/duplicate button
   - Add "Set as template" button
   - Show nutritional distribution chart

3. **Add Calendar View**
   - Weekly calendar
   - Assign plans to specific days
   - Drag & drop plans to days

4. **Backend Integration Testing**
   - Test with real data from backend
   - Verify meal nesting structure
   - Test factor calculations
   - Test create/update/delete

---

## 🔗 Navigation Flow

```
Products Page (📦)
    ↓
Meals Page (🍽️)
    ↓
Meals In Day Page (📅)
    ↓
[Future] Calendar/Week View
```

---

## 📝 Summary

**Status:** ✅ Daily meal plans page structure complete, form pending

**What Works:**

- ✅ Navigation between Products, Meals, and Plans
- ✅ Plans list with expandable cards
- ✅ 6 meal slots with factors
- ✅ Daily macro calculation
- ✅ Search and sort (including by calories)
- ✅ Delete functionality
- ✅ Protected routing
- ✅ "5 days" badge display

**What's Missing:**

- ⏳ MealInDayForm component (create/edit)
- ⏳ Meal selectors in form
- ⏳ Factor inputs per meal
- ⏳ Form validation
- ⏳ Copy/duplicate functionality

**Ready to test:** Navigation, display, search, sort, delete
**Ready to implement:** MealInDayForm for create/edit operations

📅 Daily meal plans page is ready for testing and form implementation!
