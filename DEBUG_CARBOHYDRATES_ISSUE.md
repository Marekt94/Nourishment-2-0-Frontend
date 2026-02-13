# DEBUG: Zero Values in Carbohydrates and SugarAndCarb

**Date:** 2026-02-13  
**Issue:** Wszystkie produkty pokazują 0 dla węglowodanów i węglowodany+cukry  
**Status:** Debugging in progress

---

## 🔍 Problem Description

User reports that in every product:

- **Węglowodany (carbohydrates)** = 0
- **Węglowodany + cukry (sugarAndCarb)** = 0

But other macros (calories, protein, fat) display correctly.

---

## 📋 Expected vs Actual

### Expected (from Swagger):

```yaml
meal.Product:
  carbohydrates: number # Węglowodany
  sugarAndCarb: number # Węglowodany + cukry suma
  sugar: number # Cukry
  kcalPer100: number # Kalorie ✅ (working)
  proteins: number # Białko ✅ (working)
  fat: number # Tłuszcze ✅ (working)
```

### Actual in Frontend:

```
✅ Kalorie: 250 (działa)
✅ Białko: 20g (działa)
❌ Węglowodany + cukry: 0 (NIE DZIAŁA)
✅ Tłuszcze: 10g (działa)
```

---

## 🔬 Debugging Steps

### Step 1: Check Backend Response

Added detailed logging in `useProducts.js`:

```javascript
console.log("  - carbohydrates:", firstProduct.carbohydrates);
console.log("  - sugarAndCarb:", firstProduct.sugarAndCarb);
console.log("  - sugar:", firstProduct.sugar);
```

**Also shows alert on page load with these values.**

### Step 2: Verify Field Names

Check if backend sends:

- ✅ `carbohydrates` (not `carbs`, not `CARBOHYDRATES`)
- ✅ `sugarAndCarb` (not `sugarAndCarbs`, not `sugar_and_carb`)
- ✅ `sugar` (not `sugars`)

### Step 3: Check Database

Backend might be:

- ❌ Not fetching these fields from Firebird database
- ❌ Fields exist but are NULL/0 in all records
- ❌ Column names in Firebird are different

### Step 4: Check Backend Handler

File: `../nourishment_20/internal/api/products.go`

Check if `GetProducts` function properly maps:

```go
// Expected mapping:
product.Carbohydrates  → carbohydrates
product.SugarAndCarb   → sugarAndCarb
product.Sugar          → sugar
```

---

## 🧪 Test Instructions

### Frontend Test (CURRENT):

1. Start backend: `go run cmd/nourishment/main.go`
2. Start frontend: `npm start`
3. Login and go to Products page
4. **Look for alert popup** with values
5. Open browser console (F12)
6. Look for logs starting with 🔬
7. Check what values are received from backend

### Backend Test (IF FRONTEND RECEIVES 0):

1. Open Postman or use curl
2. Login to get token:
   ```bash
   POST http://localhost:8080/login
   Body: {"username": "admin", "password": "your_password"}
   ```
3. Get products:
   ```bash
   GET http://localhost:8080/products
   Headers: Authorization: Bearer <token>
   ```
4. Check response - look for first product:
   ```json
   {
     "id": 1,
     "name": "Product Name",
     "kcalPer100": 250,
     "proteins": 20,
     "fat": 10,
     "carbohydrates": ???,    // Check this!
     "sugarAndCarb": ???,     // Check this!
     "sugar": ???             // Check this!
   }
   ```

---

## 🎯 Possible Root Causes

### Scenario 1: Backend Not Sending Fields

**Symptom:** Console shows `carbohydrates: undefined`

**Solution:** Fix backend handler to include these fields

**File to check:** `../nourishment_20/internal/api/products.go`

### Scenario 2: Field Name Mismatch

**Symptom:** Console shows fields but with different names

**Examples:**

- Backend sends `carbs` but frontend expects `carbohydrates`
- Backend sends `sugar_and_carb` but frontend expects `sugarAndCarb`

**Solution:** Update ProductCard.js to use correct field names

### Scenario 3: Database Has No Data

**Symptom:** Console shows `carbohydrates: 0` (number, not undefined)

**Solution:** Check Firebird database - fields might all be 0

**SQL to check:**

```sql
SELECT FIRST 5
  ID,
  NAZWA,
  KALORIE,
  BIALKO,
  WEGLOWODANY,        -- Check this column name
  CUKRY,              -- Check this column name
  CUKRY_I_WEGLOWODANY -- Check this column name
FROM PRODUKTY;
```

### Scenario 4: JSON Tag Mismatch in Go

**Symptom:** Backend has data but doesn't send it

**Check Go struct tags:**

```go
type Product struct {
    ID            int     `json:"id"`
    Carbohydrates float64 `json:"carbohydrates"` // ✅ Must match frontend
    SugarAndCarb  float64 `json:"sugarAndCarb"`  // ✅ Must match frontend
    Sugar         float64 `json:"sugar"`         // ✅ Must match frontend
}
```

---

## 📊 Frontend Code References

### Where Values Are Used:

**useProducts.js** (line ~33):

```javascript
console.log("  - carbohydrates:", firstProduct.carbohydrates);
console.log("  - sugarAndCarb:", firstProduct.sugarAndCarb);
```

**ProductCard.js** (line ~40):

```javascript
const getCarbs = () => {
  return Number(product.carbohydrates || product.carbs || 0);
};

const getSugarAndCarb = () => {
  return Number(product.sugarAndCarb || 0);
};
```

**ProductCard.js - Compact View** (line ~80):

```javascript
<div className="product-card__macro-compact">
  <span className="product-card__macro-label">Węgle</span>
  <span className="product-card__macro-value">{getSugarAndCarb()}g</span>
</div>
```

**ProductCard.js - Expanded View** (line ~120):

```javascript
<div className="product-card__detail-item">
  <span className="product-card__detail-icon">🍞</span>
  <span className="product-card__detail-label">Węglowodany</span>
  <span className="product-card__detail-value">{getCarbs()}g</span>
</div>
```

---

## ✅ Resolution Steps

Once you determine the root cause:

### If Backend Issue:

1. Go to `../nourishment_20` repository
2. Check backend handler and model
3. Fix field mapping or database query
4. Restart backend
5. Refresh frontend and verify

### If Frontend Issue:

1. Update field names in ProductCard.js
2. Update logging in useProducts.js
3. Save and hot-reload will update
4. Verify in browser

### If Database Issue:

1. Update database records with correct values
2. Or update backend query to use correct column names
3. Restart backend
4. Verify in frontend

---

## 🔧 Quick Fix (Temporary)

If backend doesn't have these fields yet, you can temporarily show calculated values:

```javascript
const getSugarAndCarb = () => {
  // If sugarAndCarb not available, try to calculate
  const sugarAndCarb = product.sugarAndCarb;
  if (sugarAndCarb) return Number(sugarAndCarb);

  // Fallback: sum if both available
  const sugar = Number(product.sugar || 0);
  const carbs = Number(product.carbohydrates || 0);
  return sugar + carbs;
};
```

---

## 📝 Next Steps

1. ✅ **Added debug logging** - Check console and alert
2. ⏳ **Waiting for test results** - What values are received?
3. ⏳ **Determine root cause** - Frontend, Backend, or Database?
4. ⏳ **Apply fix** - Based on findings
5. ⏳ **Verify solution** - Test with real data

---

## 🎯 Expected Outcome

After fix:

```
✅ Kalorie: 250 kcal/100g
✅ Białko: 20g
✅ Węglowodany + cukry: 35g  ← Should show real value
✅ Tłuszcze: 10g

Expanded view:
✅ Węglowodany: 30g          ← Should show real value
✅ Cukry: 5g                 ← Should show real value
✅ Cukry + Węglowodany: 35g  ← Should show real value
```

---

## 📞 Questions to Answer

1. What does the alert show when you load the Products page?
2. What do you see in browser console for `carbohydrates` and `sugarAndCarb`?
3. Are these values `undefined`, `null`, `0`, or something else?
4. Do other products (not just first one) have same issue?

**Share these answers to determine if it's frontend or backend issue!**
