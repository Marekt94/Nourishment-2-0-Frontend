# Copilot Instructions - React Frontend

## 📋 Project Overview

Modern frontend application for Nourishment using backend nourishment_20 written in Golang.

- **Framework:** React 18+ with JavaScript (NO TypeScript)
- **Build Tool:** Create React App
- **Backend Repository:** https://github.com/Marekt94/Nourishment-2-0.git
- **Backend Local Path:** `../nourishment_20`
- **Swagger Documentation:**
  - **Local YAML:** `swagger/swagger.yaml` (workspace copy)
  - **Local JSON:** `swagger/swagger.json` (workspace copy)
  - **Backend Original:** `../nourishment_20/docs/swagger.yaml`
- **Backend API Base URL:**
  - Development: `http://localhost:8080` (NO /api prefix!)
  - Production: (not yet deployed)

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/
├── pages/
├── services/
├── hooks/
├── utils/
├── constants/
└── assets/
swagger/
├── swagger.yaml    (local copy from backend)
└── swagger.json    (local copy from backend)
```

---

## 🔌 Backend API Integration

**Backend Repository:** https://github.com/Marekt94/Nourishment-2-0.git
**Local Path:** `../nourishment_20`

**API Documentation & Implementation:**

- **Swagger YAML (workspace):** `swagger/swagger.yaml` ✅ USE THIS FIRST
- **Swagger JSON (workspace):** `swagger/swagger.json` ✅ USE THIS FIRST
- **Swagger YAML (backend):** `../nourishment_20/docs/swagger.yaml`
- **Swagger JSON (backend):** `../nourishment_20/docs/swagger.json`
- **API Implementation:** `../nourishment_20/internal/api/` (handlers and controllers)
- **Models/Types:** `../nourishment_20/internal/mealDomain/mealTypes.go` (data structures)

**Authentication:**

- JWT tokens stored in `localStorage` as `authToken`
- Send token in `Authorization: Bearer <token>` header
- Login endpoint: `POST /login` (NO /api prefix!)
- No refresh token endpoint

**IMPORTANT: Backend does NOT use /api prefix!**

- ✅ Correct: `http://localhost:8080/login`
- ❌ Wrong: `http://localhost:8080/api/login`

---

## 🤖 Instructions for Copilot

**CRITICAL: This project uses JavaScript ONLY. Never generate TypeScript.**

### When creating services or components:

1. **Check backend documentation in this order:**
   - **Swagger (workspace):** `swagger/swagger.yaml` or `swagger/swagger.json` (API contract) ✅ **USE THESE FIRST!**
   - **API Implementation:** `../nourishment_20/internal/api/` (actual handlers)
   - **Models:** `../nourishment_20/internal/mealDomain/mealTypes.go` (data structures)

2. **Match backend exactly:**
   - Endpoint paths from swagger (NO /api prefix!)
   - HTTP methods from swagger
   - Request/response schemas from mealTypes.go
   - Parameter names and types from API implementation

3. **Always add backend references in comments:**

```javascript
/**
 * Fetch all meals
 * Backend: GET /meals
 * Swagger: swagger/swagger.yaml (workspace)
 * Handler: ../nourishment_20/internal/api/[handler-file].go
 * Model: ../nourishment_20/internal/mealDomain/mealTypes.go
 */
```

### Workflow for new features:

When asked to create a new feature (e.g., "Create meal management"):

```
Step 1: Check swagger/swagger.yaml (workspace) for meal endpoints
Step 2: Check ../nourishment_20/internal/api/ for handler implementation
Step 3: Check ../nourishment_20/internal/mealDomain/mealTypes.go for Meal structure
Step 4: Create src/services/mealService.js (match swagger & models exactly)
Step 5: Create src/hooks/useMeals.js (wrap service with state)
Step 6: Create components in src/components/features/meals/
Step 7: Create src/pages/MealsPage.jsx
```

### Understanding data structures:

Always check `../nourishment_20/internal/mealDomain/mealTypes.go` to understand:

- Field names (Go struct tags like `json:"fieldName"`)
- Field types (string, int, bool, etc.)
- Required vs optional fields
- Nested structures
- Enums and constants

**Example:**
If Go has:

```go
type Meal struct {
    ID          string    `json:"id"`
    Name        string    `json:"name"`
    Calories    int       `json:"calories"`
    CreatedAt   time.Time `json:"createdAt"`
}
```

Frontend should use:

```javascript
const meal = {
  id: "123",
  name: "Breakfast",
  calories: 500,
  createdAt: "2024-01-27T10:00:00Z",
};
```

### Understanding API responses:

Always check:

- `swagger/swagger.yaml` (workspace) for response structure ✅
- `mealTypes.go` for exact field names and types
- `internal/api/` for actual response format in handlers

---

## 💻 Code Standards

### JavaScript

- Use ES6+: `const`, `let`, arrow functions, destructuring
- No `var`, NO TypeScript
- Use optional chaining `?.` and nullish coalescing `??`
- Use `async/await` instead of `.then()`

### React Components

- Functional components with hooks
- Named exports (no default exports)
- Destructure props in parameters
- Each component has its own CSS file: `ComponentName.css`
- Import CSS in component: `import './ComponentName.css'`

**Example:**

```javascript
// MealCard.jsx
import "./MealCard.css";

export const MealCard = ({ meal, onEdit, onDelete }) => {
  return (
    <div className="meal-card">
      <h3 className="meal-card__title">{meal.name}</h3>
      <p className="meal-card__calories">{meal.calories} kcal</p>
      <div className="meal-card__actions">
        <button onClick={() => onEdit(meal)}>Edit</button>
        <button onClick={() => onDelete(meal.id)}>Delete</button>
      </div>
    </div>
  );
};
```

### Custom Hooks

- Always return object with descriptive keys
- Include `isLoading` and `error` states
- Add `refetch` function for manual refresh
- Use `useCallback` for functions depending on props/state

**Example:**

```javascript
// useMeals.js
import { useState, useEffect, useCallback } from "react";
import { mealService } from "../services/mealService";

export const useMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mealService.getMeals();
      setMeals(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch meals:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return {
    meals,
    isLoading,
    error,
    refetch: fetchMeals,
  };
};
```

### API Services

```javascript
import { api } from "./api";

/**
 * Meal service - handles all meal-related API calls
 * Swagger: swagger/swagger.yaml (workspace)
 * Handler: ../nourishment_20/internal/api/
 * Model: ../nourishment_20/internal/mealDomain/mealTypes.go
 */
export const mealService = {
  /**
   * Fetch all meals
   * Backend: GET /meals
   * Handler: ../nourishment_20/internal/api/[handler].go
   * Model: Meal struct in mealTypes.go
   */
  async getMeals(filters = {}) {
    try {
      const response = await api.get("/meals", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch meals:", error);
      throw error;
    }
  },

  /**
   * Fetch meal by ID
   * Backend: GET /meals/:id
   * Model: Meal struct in mealTypes.go
   */
  async getMealById(id) {
    try {
      const response = await api.get(`/meals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch meal ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new meal
   * Backend: POST /meals
   * Model: CreateMealRequest in mealTypes.go
   */
  async createMeal(mealData) {
    try {
      const response = await api.post("/meals", mealData);
      return response.data;
    } catch (error) {
      console.error("Failed to create meal:", error);
      throw error;
    }
  },

  /**
   * Update meal
   * Backend: PUT /meals/:id
   * Model: UpdateMealRequest in mealTypes.go
   */
  async updateMeal(id, mealData) {
    try {
      const response = await api.put(`/meals/${id}`, mealData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update meal ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete meal
   * Backend: DELETE /meals/:id
   */
  async deleteMeal(id) {
    try {
      const response = await api.delete(`/meals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete meal ${id}:`, error);
      throw error;
    }
  },
};
```

**Service Guidelines:**

- One service file per resource (mealService.js, userService.js, etc.)
- All functions are async
- Always use try/catch
- Log errors in development
- Reference swagger.yaml, internal/api/, and mealTypes.go in comments
- Don't handle UI in services (no alerts/toasts)
- Match field names from Go struct json tags exactly

---

## 🎨 Styling with Plain CSS

### CSS File Organization

- Each component has its own CSS file
- Use BEM-like naming: `.component-name__element--modifier`
- Prefix all classes with component name
- Use kebab-case for class names
- Use modifiers for states: `--loading`, `--active`, `--disabled`

**Example:**

```css
/* MealCard.css */
.meal-card {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.meal-card__title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.meal-card__calories {
  color: #666;
  font-size: 0.875rem;
}

.meal-card__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.meal-card--loading {
  opacity: 0.6;
  pointer-events: none;
}

.meal-card--error {
  border-color: #f44336;
}
```

### Global CSS (index.css):

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --border-radius: 0.75rem;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
  color: var(--color-text);
  background: var(--color-bg);
}
```

---

## 🔄 State Management

**Use local component state ONLY (useState, useReducer).**

**NO global state management** (no Context API, Zustand, Redux).

**Example with useState:**

```javascript
const [meals, setMeals] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
```

**Example with useReducer (for complex state):**

```javascript
const initialState = {
  meals: [],
  filters: {},
  isLoading: false,
  error: null,
};

function mealsReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, meals: action.payload };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "UPDATE_FILTERS":
      return { ...state, filters: action.payload };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(mealsReducer, initialState);
```

---

## 🚨 Error Handling

### In Components - Use browser alerts for now

```javascript
const handleSubmit = async (formData) => {
  try {
    const response = await mealService.createMeal(formData);
    alert("Meal created successfully!");
  } catch (error) {
    alert(`Failed to create meal: ${error.message}`);
    console.error("Create meal error:", error);
  }
};
```

### In Services - Throw errors, don't handle UI

```javascript
async createMeal(mealData) {
  try {
    const response = await api.post("/meals", mealData);
    return response.data;
  } catch (error) {
    console.error("Failed to create meal:", error);
    throw error; // Let component handle UI
  }
}
```

### Loading States

Always show loading state during async operations:

```javascript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await mealService.createMeal(data);
  } catch (error) {
    // handle error
  } finally {
    setIsLoading(false);
  }
};

return <button disabled={isLoading}>{isLoading ? "Creating..." : "Create Meal"}</button>;
```

---

## 📁 File Naming

```
Components:  PascalCase.jsx  (MealCard.jsx, LoginForm.jsx)
CSS Files:   PascalCase.css  (MealCard.css, LoginForm.css)
Hooks:       camelCase.js    (useMeals.js, useAuth.js)
Services:    camelCase.js    (mealService.js, authService.js)
Utils:       camelCase.js    (formatDate.js, validators.js)
Constants:   UPPER_SNAKE.js  (API_ROUTES.js, CONFIG.js)
Pages:       PascalCase.jsx  (HomePage.jsx, MealsPage.jsx)
Page CSS:    PascalCase.css  (HomePage.css, MealsPage.css)
```

---

## 🌍 Environment Variables

```bash
# .env
REACT_APP_API_BASE_URL=http://localhost:8080
```

**IMPORTANT:** NO /api prefix!

**Usage:**

```javascript
const apiUrl = process.env.REACT_APP_API_BASE_URL;
```

**Note:**

- Variables must start with `REACT_APP_`
- Restart dev server after changing .env
- Don't commit .env to git (use .env.example)

---

## ✅ Checklist Before Committing

- [ ] JavaScript only (NO TypeScript)
- [ ] Matches backend swagger.yaml exactly (use workspace copy first!)
- [ ] Matches Go struct field names from mealTypes.go (json tags)
- [ ] Each component has its own CSS file
- [ ] CSS classes prefixed with component name
- [ ] Error handling with try/catch
- [ ] Loading states (isLoading, disabled buttons)
- [ ] Backend references in service comments (swagger, internal/api, mealTypes.go)
- [ ] No console.logs in production code
- [ ] JWT token handled correctly
- [ ] Local state only (no global state)
- [ ] NO /api prefix in endpoints

---

## 🚀 Usage with Copilot

### Example 1: Create complete feature from backend

```
@workspace #file:swagger/swagger.yaml #file:../nourishment_20/internal/mealDomain/mealTypes.go

Look at the meal endpoints in swagger and Meal struct in mealTypes.go.
Create complete meal management in JavaScript (NO TypeScript):

1. src/services/mealService.js - match swagger and mealTypes.go exactly
2. src/hooks/useMeals.js - wrap with state
3. src/components/features/meals/MealList.jsx + MealList.css
4. src/components/features/meals/MealCard.jsx + MealCard.css
5. src/components/features/meals/MealForm.jsx + MealForm.css
6. src/pages/MealsPage.jsx + MealsPage.css

Use plain CSS, local state only.
Match field names from Go json tags exactly.
NO /api prefix in endpoints!
```

### Example 2: Create service from backend implementation

```
@workspace #file:swagger/swagger.yaml #file:../nourishment_20/internal/mealDomain/mealTypes.go

Create mealService.js based on these backend files.
Match all endpoints and data structures exactly.
Use JavaScript (NO TypeScript).
NO /api prefix in endpoints!
```

### Example 3: Update service based on model changes

```
@workspace #file:../nourishment_20/internal/mealDomain/mealTypes.go #file:src/services/mealService.js

Backend updated the Meal struct in mealTypes.go.
Update mealService.js to match the new structure.
Pay attention to json tags for field names.
```

### Example 4: Analyze complete backend structure

```
@workspace #file:swagger/swagger.yaml #file:../nourishment_20/internal/api/ #file:../nourishment_20/internal/mealDomain/mealTypes.go

Analyze the complete backend structure and create a summary of:
1. All available endpoints (remember: NO /api prefix!)
2. All data models and their fields
3. Authentication requirements
4. Response formats

Then create corresponding frontend services.
```

---

## 🎯 Summary

**Always reference:**

- **Swagger (workspace):** `swagger/swagger.yaml` or `swagger/swagger.json` ✅ **USE THESE FIRST!**
- **Swagger (backend):** `../nourishment_20/docs/swagger.yaml` (fallback)
- **API Implementation:** `../nourishment_20/internal/api/` (handlers)
- **Models:** `../nourishment_20/internal/mealDomain/mealTypes.go` (data structures)
- **Backend repo:** https://github.com/Marekt94/Nourishment-2-0.git
- **Local backend:** `../nourishment_20`

**Remember:**

- JavaScript ONLY (NO TypeScript)
- Plain CSS with component-scoped files
- Local state only (no global state)
- JWT in localStorage, Bearer header
- Match swagger.yaml exactly
- Match Go struct json tags from mealTypes.go exactly
- Each component = .jsx + .css file
- **NO /api prefix in endpoints!** ✅

**Go to JavaScript field mapping:**
When you see Go struct tags like `json:"fieldName"`, use exact same name in JavaScript:

```go
// Go
type Meal struct {
    ID   string `json:"id"`
    Name string `json:"name"`
}

// JavaScript
const meal = {
  id: "123",
  name: "Breakfast"
};
```

**Authentication flow:**

1. User logs in via `POST /login` (NO /api!)
2. Store token in localStorage as `authToken`
3. Add token to all requests via axios interceptor: `Authorization: Bearer <token>`
4. On 401, clear token and redirect to `/login`

**Backend endpoints have NO /api prefix:**

- ✅ `POST /login`
- ✅ `GET /products`
- ✅ `GET /meals`
- ❌ `POST /api/login`
- ❌ `GET /api/products`
