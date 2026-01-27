# Copilot Instructions - React Frontend

## 📋 Project Overview

Modern forntend application for Nourishment using backend nourishment_20 written in Golang.

- **Framework:** React 18+ with JavaScript (NO TypeScript)
- **Build Tool:** Create React App
- **Backend Repository:** https://github.com/Marekt94/Nourishment-2-0.git
- **Backend Local Path:** `../nourishment_20`
- **Swagger Documentation:** `../nourishment_20/docs/swagger.yaml`
- **Backend API Base URL:**
  - Development: `http://localhost:3000/api`
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
```

---

## 🔌 Backend API Integration

**Backend Repository:** https://github.com/Marekt94/Nourishment-2-0.git
**Local Path:** `../nourishment_20`

**API Documentation & Implementation:**

- **Swagger YAML:** `../nourishment_20/docs/swagger.yaml`
- **Swagger JSON:** `../nourishment_20/docs/swagger.json`
- **API Implementation:** `../nourishment_20/internal/api/` (handlers and controllers)
- **Models/Types:** `../nourishment_20/internal/mealDomain/mealTypes.go` (data structures)

**Authentication:**

- JWT tokens stored in `localStorage` as `authToken`
- Send token in `Authorization: Bearer <token>` header
- Login endpoint: `POST /login`
- No refresh token endpoint

---

## 🤖 Instructions for Copilot

**CRITICAL: This project uses JavaScript ONLY. Never generate TypeScript.**

### When creating services or components:

1. **Check backend documentation in this order:**
   - **Swagger:** `../nourishment_20/docs/swagger.yaml` (API contract)
   - **API Implementation:** `../nourishment_20/internal/api/` (actual handlers)
   - **Models:** `../nourishment_20/internal/mealDomain/mealTypes.go` (data structures)

2. **Match backend exactly:**
   - Endpoint paths from swagger
   - HTTP methods from swagger
   - Request/response schemas from mealTypes.go
   - Parameter names and types from API implementation

3. **Always add backend references in comments:**

```javascript
/**
 * Fetch all meals
 * Backend: GET /meals
 * Swagger: ../nourishment_20/docs/swagger.yaml
 * Handler: ../nourishment_20/internal/api/[handler-file].go
 * Model: ../nourishment_20/internal/mealDomain/mealTypes.go
 */
```

### Workflow for new features:

When asked to create a new feature (e.g., "Create meal management"):

```
Step 1: Check ../nourishment_20/docs/swagger.yaml for meal endpoints
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
// Meal object structure (from mealTypes.go)
const meal = {
  id: "123",
  name: "Breakfast",
  calories: 500,
  createdAt: "2024-01-27T10:00:00Z",
};
```

### Understanding API responses:

Always check:

- `swagger.yaml` for response structure
- `mealTypes.go` for exact field names and types
- `internal/api/` for actual response format in handlers

---

## 💻 Code Standards

### JavaScript

- Use ES6+: `const`, `let`, arrow functions, destructuring
- No `var`, no TypeScript
- Use optional chaining `?.` and nullish coalescing `??`
- Use `async/await` instead of `.then()`

### React Components

```javascript
import { useState, useEffect } from "react";
import "./UserCard.css";

export const UserCard = ({ user, onEdit, className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(user.id);
    }
  };

  if (!user) return null;

  return (
    <div className={`user-card ${className || ""}`}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={handleEdit} disabled={isLoading}>
        Edit
      </button>
    </div>
  );
};
```

**Component Guidelines:**

- Functional components with hooks only
- Named exports (no default exports)
- Destructure props in parameters
- Hooks at top → handlers → early returns → render
- Each component has its own CSS file: `ComponentName.css`
- Import CSS in component: `import './ComponentName.css'`

### Custom Hooks

```javascript
import { useState, useEffect, useCallback } from "react";

export const useUsers = (filters = {}) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(filters);
      setUsers(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, error, refetch: fetchUsers };
};
```

**Hook Guidelines:**

- Always return object with descriptive keys
- Include `isLoading` and `error` states
- Provide `refetch` function for manual refresh
- Use `useCallback` for functions that depend on props/state

### API Services

```javascript
import { api } from "./api";

/**
 * Meal service - handles all meal-related API calls
 * Swagger: ../nourishment_20/docs/swagger.yaml
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

### Axios Configuration

```javascript
// services/api.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

### Authentication Service

```javascript
// services/authService.js
import { api } from "./api";

/**
 * Authentication service
 * Backend: POST /login
 * Swagger: ../nourishment_20/docs/swagger.yaml
 * Handler: ../nourishment_20/internal/api/auth.go (or similar)
 */
export const authService = {
  /**
   * Login user
   * Backend: POST /login
   * Check swagger.yaml and internal/api/ for exact request/response format
   */
  async login(email, password) {
    try {
      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem("authToken", token);

      return { token, user };
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  },

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem("authToken");
  },
};
```

---

## 🎨 Styling with Plain CSS

### CSS File Organization

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   ├── Input.jsx
│   │   └── Input.css
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Header.css
│   └── features/
│       └── meals/
│           ├── MealCard.jsx
│           ├── MealCard.css
│           ├── MealList.jsx
│           └── MealList.css
├── pages/
│   ├── HomePage.jsx
│   ├── HomePage.css
│   ├── MealsPage.jsx
│   └── MealsPage.css
└── index.css  (global styles)
```

### CSS Guidelines

**Component CSS:**

```css
/* MealCard.css */

/* Use component name as prefix for class names */
.meal-card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
}

.meal-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.meal-card__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.meal-card__calories {
  color: #6b7280;
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
```

**CSS Naming Convention:**

- Use BEM-like naming: `.component-name__element--modifier`
- Prefix all classes with component name
- Use kebab-case for class names
- Use modifiers for states: `--loading`, `--active`, `--disabled`

**Global CSS (index.css):**

```css
/* index.css */

:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
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

## 🔄 State Management

**Use local component state only (useState, useReducer).**

No global state management library (no Context API, Zustand, Redux).

### Component State Pattern

```javascript
export const MealList = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await mealService.getMeals();
        setMeals(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="meal-list">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
};
```

### Passing State Down

When you need to share state between components, lift state up to parent:

```javascript
export const MealsPage = () => {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleMealSelect = (meal) => {
    setSelectedMeal(meal);
  };

  return (
    <div className="meals-page">
      <MealList meals={meals} onMealSelect={handleMealSelect} />
      {selectedMeal && <MealDetails meal={selectedMeal} />}
    </div>
  );
};
```

---

## 🚨 Error Handling

### In Components - Use browser alerts for now

```javascript
const handleSubmit = async (formData) => {
  try {
    const response = await mealService.createMeal(formData);
    alert("Meal created successfully!");
    // Optionally: navigate or refresh list
  } catch (error) {
    alert(`Failed to create meal: ${error.message}`);
    console.error("Create meal error:", error);
  }
};
```

### Display Errors in UI

```javascript
export const MealForm = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await mealService.createMeal(formData);
      alert("Success!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      {/* form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};
```

---

## 🌍 Environment Variables

```bash
# .env
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

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
- [ ] Matches backend swagger.yaml exactly
- [ ] Matches Go struct field names from mealTypes.go (json tags)
- [ ] Each component has its own CSS file
- [ ] CSS classes prefixed with component name
- [ ] Error handling with try/catch
- [ ] Loading states (isLoading, disabled buttons)
- [ ] Backend references in service comments (swagger, internal/api, mealTypes.go)
- [ ] No console.logs in production code
- [ ] JWT token handled correctly
- [ ] Local state only (no global state)

---

## 🚀 Usage with Copilot

### Example 1: Create complete feature from backend

```
@workspace #file:../nourishment_20/docs/swagger.yaml #file:../nourishment_20/internal/mealDomain/mealTypes.go

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
```

### Example 2: Create service from backend implementation

```
@workspace #file:../nourishment_20/internal/api/ #file:../nourishment_20/internal/mealDomain/mealTypes.go

Create mealService.js based on these backend files.
Match all endpoints and data structures exactly.
Use JavaScript (NO TypeScript).
Reference swagger: ../nourishment_20/docs/swagger.yaml
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
@workspace #file:../nourishment_20/docs/swagger.yaml #file:../nourishment_20/internal/api/ #file:../nourishment_20/internal/mealDomain/mealTypes.go

Analyze the complete backend structure and create a summary of:
1. All available endpoints
2. All data models and their fields
3. Authentication requirements
4. Response formats

Then create corresponding frontend services.
```

---

## 🎯 Summary

**Always reference:**

- **Swagger:** `../nourishment_20/docs/swagger.yaml` (API contract)
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

1. User logs in via `POST /login`
2. Store token in localStorage as `authToken`
3. Add token to all requests via axios interceptor: `Authorization: Bearer <token>`
4. On 401, clear token and redirect to `/login`
