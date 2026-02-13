# Product API - Expected Structure Analysis

## Based on Backend Standards

### Typical Go Product Struct (from mealTypes.go)

```go
type Product struct {
    ID          int     `json:"id"`
    Name        string  `json:"name"`
    CategoryID  int     `json:"categoryId"`
    Category    *Category `json:"category,omitempty"`
    Calories    float64 `json:"calories"`
    Protein     float64 `json:"protein"`
    Carbs       float64 `json:"carbs"`
    Fat         float64 `json:"fat"`
    Description string  `json:"description,omitempty"`
}

type Category struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}
```

### Expected JSON Response from GET /products

```json
[
  {
    "id": 1,
    "name": "Chicken Breast",
    "categoryId": 5,
    "category": {
      "id": 5,
      "name": "Protein"
    },
    "calories": 165,
    "protein": 31,
    "carbs": 0,
    "fat": 3.6,
    "description": "Skinless, boneless"
  }
]
```

## Frontend Mapping

### Current Issue

- Frontend expects: `product.calories`, `product.protein`, etc.
- Backend returns: `product.calories`, `product.protein`, etc. (lowercase with json tags)
- **Problem**: Values are 0 despite correct field names

### Possible Causes

1. **Database has NULL values** - no actual data in PRODUKTY table
2. **Backend not populating fields** - struct fields not scanned from DB
3. **JSON tags missing** - Go not serializing fields properly
4. **Wrong column names** - Go scanning wrong DB columns

### Solution: Check Console Logs

The debug logs we added will show:

- `📡 productService` - exact JSON from backend
- `🔍 useProducts` - what React receives
- `🎴 ProductCard` - what each card renders

### Next Steps

1. Check browser console for actual data structure
2. If all values are 0, backend DB has no data OR backend not reading columns
3. If fields are missing, Go struct json tags might be wrong
