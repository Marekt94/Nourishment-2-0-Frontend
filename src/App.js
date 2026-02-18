import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProductsPage } from "./pages/ProductsPage";
import { MealsPage } from "./pages/MealsPage";
import MealsInDayPage from "./pages/MealsInDayPage";
import { Layout } from "./components/Layout";
import { authService } from "./services/authService";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meals"
          element={
            <ProtectedRoute>
              <MealsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mealsinday"
          element={
            <ProtectedRoute>
              <MealsInDayPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};
