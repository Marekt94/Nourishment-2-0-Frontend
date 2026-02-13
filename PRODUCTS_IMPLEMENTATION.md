# Products Management - Implementation Guide

## 📁 Created Files

### Services

- ✅ `src/services/productService.js` - API communication layer

### Hooks

- ✅ `src/hooks/useProducts.js` - Products state management hook

### Components

- ✅ `src/components/features/products/ProductCard.js` + `.css` - Individual product card
- ✅ `src/components/features/products/ProductList.js` + `.css` - Grid of products
- ✅ `src/components/features/products/ProductForm.js` + `.css` - Create/Edit form

### Pages

- ✅ `src/pages/ProductsPage.js` + `.css` - Main products page

### Routing

- ✅ Updated `src/App.js` - Added `/products` route
- ✅ Updated `src/pages/LandingPage.js` - Navigate to `/products` after login

---

## 🎯 Features Implemented

### ✅ View Products

- Modern card-based grid layout
- Displays: name, category, calories, protein, carbs, fat
- Responsive design (desktop, tablet, mobile)
- Loading states with spinner
- Error handling
- Empty state message

### ✅ Create Product

- Click "Create Product" button
- Form with fields:
  - Name (required)
  - Category
  - Calories, Protein, Carbs, Fat (numeric)
  - Description (optional)
- Success/error alerts
- Auto-refresh list after creation

### ✅ Edit Product

- Click "Edit" button on any card
- Form pre-populated with existing data
- Same validation as create
- Updates list in real-time

### ✅ Delete Product

- Click "Delete" button on card
- Confirmation dialog
- Success/error alerts
- Removes from list immediately

---

## 🚀 How to Use

### 1. Start Backend

```powershell
cd C:\Repo\nourishment_20
go run cmd/nourishment/main.go
```

Backend runs on `http://localhost:8080`

### 2. Start Frontend

```powershell
cd C:\Repo\nourishment_20_frontend
npm start
```

Frontend runs on `http://localhost:3000`

### 3. Login

1. Go to `http://localhost:3000`
2. Login with credentials (e.g., ADMIN/admin)
3. Auto-redirect to `/products` page

### 4. Manage Products

- View all products in grid
- Click "Create Product" to add new
- Click "Edit" on any card to modify
- Click "Delete" on any card to remove
- Click "Logout" to sign out

---

## 🔌 API Integration

### Backend Endpoints Used

Based on Swagger: `C:/Repo/nourishment_20/docs/swagger.yaml`

```
GET    /products       - Fetch all products
GET    /products/:id   - Fetch single product
POST   /products       - Create new product
PUT    /products       - Update existing product
DELETE /products/:id   - Delete product
```

### Request/Response Format

All requests follow Go backend structure from:

- `C:/Repo/nourishment_20/internal/mealDomain/mealTypes.go`
- `C:/Repo/nourishment_20/internal/api/products.go`

Expected product structure:

```javascript
{
  id: string,
  name: string,
  category: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  description: string
}
```

### Authentication

- JWT token stored in `localStorage` as `authToken`
- Auto-attached to all requests via `api.js` interceptor
- Header: `Authorization: Bearer <token>`

---

## 🎨 Design Features

### Modern UI/UX

- **Gradient background**: Purple gradient (667eea → 764ba2)
- **Card-based layout**: White cards with shadow & hover effects
- **Responsive grid**: Auto-adjusts columns based on screen size
- **Color scheme**:
  - Primary: `#3b82f6` (blue)
  - Danger: `#ef4444` (red)
  - Text: `#1f2937` (dark gray)
  - Background: White cards on gradient

### Animations

- Card hover: lift effect + shadow
- Page transitions: fade-in
- Loading spinner: rotating border
- Smooth color transitions

### Responsive Breakpoints

- **Desktop** (>1200px): 4 columns
- **Tablet** (768-1200px): 2-3 columns
- **Mobile** (<768px): 1 column

---

## 📝 Code Architecture

### Service Layer Pattern

```
productService.js → Raw API calls
         ↓
useProducts.js → State management + error handling
         ↓
ProductsPage.js → Orchestration + routing
         ↓
Components → UI rendering
```

### State Management

- **Local state only** (no global state/Context)
- `useState` for component state
- `useCallback` for optimized functions
- `useEffect` for data fetching

### Error Handling

- Try/catch in all async operations
- Browser `alert()` for user feedback (temporary)
- Console logging for debugging
- Error states displayed in UI

---

## ✅ Compliance Checklist

- ✅ **JavaScript only** (no TypeScript)
- ✅ **Plain CSS** (no CSS-in-JS)
- ✅ **Local state** (no global state management)
- ✅ **Backend API aligned** with Swagger docs
- ✅ **JWT authentication** implemented
- ✅ **Responsive design** (mobile-first)
- ✅ **Named exports** (no default exports)
- ✅ **Component + CSS file** pattern
- ✅ **BEM-like CSS naming** (component\_\_element--modifier)
- ✅ **Loading states** (spinner, disabled buttons)
- ✅ **Error handling** (try/catch, error messages)

---

## 🐛 Troubleshooting

### Products not loading?

1. Check backend is running: `http://localhost:8080`
2. Check browser console for errors
3. Check Network tab for failed requests
4. Verify JWT token exists: `localStorage.getItem('authToken')`

### CORS errors?

Backend must allow frontend origin in CORS settings

### 401 Unauthorized?

1. Token expired - login again
2. Backend not recognizing token format

### Create/Edit not working?

1. Check backend logs for validation errors
2. Verify field names match backend expectations
3. Check numeric fields are actual numbers

---

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add search/filter functionality
- [ ] Add sorting (by name, calories, etc.)
- [ ] Add pagination for large lists
- [ ] Replace `alert()` with toast notifications
- [ ] Add product images/icons
- [ ] Add bulk operations (select multiple, delete all)
- [ ] Add export to CSV/PDF
- [ ] Add nutrition charts/graphs

---

## 📚 File References

**Backend Documentation:**

- Swagger: `C:/Repo/nourishment_20/docs/swagger.yaml`
- API Handlers: `C:/Repo/nourishment_20/internal/api/products.go`
- Data Models: `C:/Repo/nourishment_20/internal/mealDomain/mealTypes.go`

**Frontend Implementation:**

- Service: `src/services/productService.js`
- Hook: `src/hooks/useProducts.js`
- Page: `src/pages/ProductsPage.js`
- Components: `src/components/features/products/`

---

**Created:** 2026-02-12  
**Status:** ✅ Ready for testing
