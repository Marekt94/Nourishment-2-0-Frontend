# Debug Makroskładników w Formularzu MealInDay

## Problem:

W oknie tworzenia i edycji planu dnia źle wyświetlają się makroskładniki (błędne wartości białka, węglowodanów, tłuszczy). Na zwiniętej karcie na liście jest dobrze, źle jest w oknie edycji i tworzenia.

## Możliwe przyczyny:

### 1. Posiłki z hooka `useMeals` nie zawierają `productsInMeal`

- Formularz używa `formData.breakfast` (ID posiłku)
- Szuka tego posiłku w `meals` z hooka `useMeals()`
- Jeśli posiłki z hooka NIE mają `productsInMeal`, obliczenia będą zerowe!

### 2. Różnica między strukturami danych:

- **MealInDayCard** (działa ✅): używa `mealInDay.breakfast` (pełny obiekt Meal z productsInMeal)
- **MealInDayForm** (nie działa ❌): używa `formData.breakfast` (tylko ID), potem szuka w `meals`

### 3. Możliwe rozwiązania:

#### A. Sprawdź logi w konsoli przeglądarki

Po otwarciu formularza tworzenia/edycji, sprawdź logi:

```
📊 FORM - Calculate Total Macros
  Available meals from hook: X
  First meal structure: {...}
  Looking for meal ID X: FOUND/NOT FOUND
  Meal "nazwa": { hasProductsInMeal: true/false, productsCount: X, factor: 1.0 }
```

**Jeśli zobaczysz `hasProductsInMeal: false` - to jest problem!**

#### B. Rozwiązanie: Użyj pełnych obiektów Meal zamiast ID

Zamiast przechowywać w `formData.breakfast` tylko ID, przechowuj cały obiekt:

```javascript
// OBECNIE (błędne?):
setFormData({
  breakfast: mealInDay.breakfast?.id, // Tylko ID
});

// POWINNO BYĆ:
setFormData({
  breakfast: mealInDay.breakfast, // Cały obiekt
});
```

Ale wtedy trzeba zmienić logikę w `calculateTotalMacros`:

```javascript
// Zamiast:
const meal = meals.find((m) => m.id === mealId);

// Użyj:
const meal = formData.breakfast; // Jeśli formData przechowuje obiekty
```

#### C. Alternatywnie: Przechowuj pełne obiekty osobno

Dodaj nowy stan:

```javascript
const [selectedMeals, setSelectedMeals] = useState({
  breakfast: null, // Pełny obiekt Meal
  secondBreakfast: null,
  // ...
});
```

I aktualizuj go przy wyborze:

```javascript
const handleMealSelect = (slot, mealId) => {
  const meal = meals.find((m) => m.id === mealId);
  setFormData((prev) => ({ ...prev, [slot]: mealId }));
  setSelectedMeals((prev) => ({ ...prev, [slot]: meal }));
};
```

Potem w `calculateTotalMacros` używaj `selectedMeals` zamiast szukać w `meals`.

## Kroki debugowania:

1. ✅ Dodano szczegółowe logi do `calculateTotalMacros()`
2. ⏳ Otwórz formularz tworzenia/edycji w przeglądarce
3. ⏳ Sprawdź Console DevTools
4. ⏳ Szukaj linii z "First meal structure" - sprawdź czy ma `productsInMeal`
5. ⏳ Jeśli NIE ma - problem znaleziony, użyj rozwiązania B lub C
6. ⏳ Jeśli MA - problem jest gdzie indziej (błąd w obliczeniach, złe nazwy pól)

## Oczekiwane wyniki w logach:

### Jeśli działa poprawnie:

```
📊 FORM - Calculate Total Macros
  Available meals from hook: 10
  First meal structure: { id: 1, name: "Owsianka", productsInMeal: [...] }
  Looking for meal ID 5: FOUND
  Meal "Owsianka": { hasProductsInMeal: true, productsCount: 3, factor: 1.0 }
    Product: Płatki owsiane, 100g, 389 kcal/100g
    Product: Mleko, 200g, 64 kcal/100g
  Meal "Owsianka" macros (before factor): { calories: 517, proteins: 20, ... }
  📊 FINAL TOTALS: { calories: 2500, proteins: 150, carbs: 300, fats: 80 }
```

### Jeśli NIE działa (brak productsInMeal):

```
📊 FORM - Calculate Total Macros
  Available meals from hook: 10
  First meal structure: { id: 1, name: "Owsianka" }  ← BRAK productsInMeal!
  Looking for meal ID 5: FOUND
  Meal "Owsianka": { hasProductsInMeal: false, productsCount: 0, factor: 1.0 }
  ⚠️ Meal "Owsianka" has no productsInMeal!
  📊 FINAL TOTALS: { calories: 0, proteins: 0, carbs: 0, fats: 0 }  ← BŁĘDNE!
```

---

**Następny krok: Sprawdź logi i zgłoś co pokazuje "First meal structure"!**
