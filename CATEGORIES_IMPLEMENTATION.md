# Categories Implementation

**Date:** 2026-02-13  
**Feature:** Category dropdown in Product Form  
**Backend API:** `/categories`

---

## 📋 Overview

Added category management with dropdown selection in Product Form. Categories are fetched from backend and displayed as a dropdown list instead of a text input.

---

## 🔧 Implementation

### 1. **Category Service** (`src/services/categoryService.js`)

Created new service to handle category API calls:

```javascript
- getCategories() - GET /categories - Returns array of {id, name}
- createCategory(data) - POST /categories - Returns {id}
- updateCategory(data) - PUT /categories - Returns 200
- deleteCategory(id) - DELETE /categories/{id} - Returns 200
```

**Swagger Definition:**

```yaml
meal.Category:
  properties:
    id: integer
    name: string
  type: object
```

### 2. **Product Form Updates** (`src/components/features/products/ProductForm.js`)

**Changes:**

- Import `categoryService`
- Added `categories` state to store fetched categories
- Added `categoriesLoading` state for loading indicator
- Changed `category` in formData from string to object `{id, name}`
- Added `useEffect` to fetch categories on mount
- Updated `handleChange` to handle category selection (finds category object by ID)
- Replaced text input with `<select>` dropdown
- Display loading hint while categories are being fetched

**Category Dropdown:**

```jsx
<select
  id="category"
  name="category"
  value={formData.category?.id || ""}
  onChange={handleChange}
  disabled={isLoading || categoriesLoading}
>
  <option value="">-- Select Category --</option>
  {categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>
```

### 3. **Styling** (`ProductForm.css`)

Added `.product-form__hint` class for loading message:

```css
.product-form__hint {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
  margin-top: 0.25rem;
}
```

---

## 🔄 Data Flow

1. **Form Mount:**
   - `useEffect` calls `categoryService.getCategories()`
   - Categories stored in `categories` state
   - Dropdown populated with options

2. **Create Product:**
   - User selects category from dropdown
   - `handleChange` finds category object: `{id: 1, name: "Category Name"}`
   - Form submits with category object
   - Backend receives category object

3. **Edit Product:**
   - Product loaded with category (object or ID)
   - `useEffect` finds matching category from loaded categories
   - Dropdown pre-selected with current category
   - User can change category
   - Form submits with updated category object

---

## 📝 Backend API

### GET /categories

**Request:**

```
GET http://localhost:8080/categories
Authorization: Bearer <token>
```

**Response:**

```json
[
  { "id": 1, "name": "Vegetables" },
  { "id": 2, "name": "Fruits" },
  { "id": 3, "name": "Meat" },
  { "id": 4, "name": "Dairy" }
]
```

### Category in Product

Product object includes full category:

```json
{
  "id": 123,
  "name": "Chicken Breast",
  "category": {
    "id": 3,
    "name": "Meat"
  },
  "kcalPer100": 165,
  ...
}
```

---

## ✅ Benefits

1. **Data Consistency:** Users select from predefined categories (no typos)
2. **Better UX:** Dropdown is easier than typing
3. **Validation:** Only valid categories can be selected
4. **Scalable:** Easy to add/remove categories from backend
5. **Type Safety:** Category is now object with ID (can be used for filtering, sorting)

---

## 🧪 Testing

Test scenarios:

1. ✅ Categories load on form mount
2. ✅ Dropdown shows all categories from backend
3. ✅ "Select Category" placeholder shown when no category selected
4. ✅ Loading hint displayed while fetching categories
5. ✅ Category pre-selected when editing existing product
6. ✅ Form submits with category object `{id, name}`
7. ✅ Dropdown disabled during form submission

---

## 🚀 Next Steps

Optional enhancements:

- Add "Create New Category" option in dropdown
- Add category filter in Products page
- Display category icon/color in ProductCard
- Add category search/filter for large category lists

---

## 📊 Files Modified

1. ✅ `src/services/categoryService.js` - Created
2. ✅ `src/components/features/products/ProductForm.js` - Updated
3. ✅ `src/components/features/products/ProductForm.css` - Updated
4. ✅ `CATEGORIES_IMPLEMENTATION.md` - Created (this file)
