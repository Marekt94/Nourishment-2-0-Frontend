# Product Fields Mapping - FIX

## Problem

Frontend oczekiwał nazw pól: `calories`, `protein`, `carbs`, `fat`
Backend zwracał: `kcalPer100`, `proteins`, `carbohydrates`, `fat`

Wszystkie wartości makro były wyświetlane jako **0**.

## Backend API Response Structure

```json
{
  "id": 1,
  "name": "Product Name",
  "kcalPer100": 165,
  "weight": 100,
  "proteins": 31,
  "fat": 3.6,
  "sugar": 5,
  "carbohydrates": 45,
  "sugarAndCarb": 50,
  "fiber": 2.5,
  "salt": 0.5,
  "unit": "g",
  "category": {
    "id": 5,
    "name": "Protein"
  }
}
```

## Fixed Files

### 1. ProductCard.js

- ✅ Zmieniono `product.calories` → `product.kcalPer100`
- ✅ Zmieniono `product.protein` → `product.proteins`
- ✅ Zmieniono `product.carbs` → `product.carbohydrates`
- ✅ Dodano wyświetlanie: `sugar`, `fiber`, `weight`, `unit`
- ✅ Zmieniono label: "Calories" → "Calories/100g"

### 2. ProductForm.js

- ✅ Zaktualizowano `formData` state z nowymi polami
- ✅ Zmieniono wszystkie pola formularza:
  - `calories` → `kcalPer100`
  - `protein` → `proteins`
  - `carbs` → `carbohydrates`
- ✅ Dodano nowe pola: `sugar`, `fiber`, `weight`, `unit`
- ✅ Dodano select dla jednostki (g, ml, oz, lb)

### 3. ProductCard.css

- ✅ Dodano `.product-card__weight` style

## Field Mapping Reference

| Frontend (OLD) | Backend (ACTUAL) | Type   | Description            |
| -------------- | ---------------- | ------ | ---------------------- |
| calories       | kcalPer100       | number | Calories per 100g      |
| protein        | proteins         | number | Protein in grams       |
| carbs          | carbohydrates    | number | Carbohydrates in grams |
| fat            | fat              | number | Fat in grams           |
| -              | sugar            | number | Sugar in grams         |
| -              | fiber            | number | Fiber in grams         |
| -              | weight           | number | Weight amount          |
| -              | unit             | string | Unit (g, ml, oz, lb)   |
| -              | salt             | number | Salt content           |
| -              | sugarAndCarb     | number | Combined sugar+carbs   |

## Test

1. Refresh page (Ctrl+Shift+R)
2. Check product cards - should now show real values
3. All 303 products should display correct macros

## Status

✅ **FIXED** - Products now display correct nutritional values!
