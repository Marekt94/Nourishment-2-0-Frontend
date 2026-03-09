import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useToast } from "../contexts/ToastContext";
import "./LandingPage.css";

export const LandingPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(formData.username, formData.password);
      addToast("Zalogowano pomyślnie!", "success");
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Nieprawidłowe dane logowania");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-page__nav">
        <div className="landing-page__nav-container">
          <div className="landing-page__logo">
            <span className="landing-page__logo-icon">🍎</span>
            <span className="landing-page__logo-text">Nourishment</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-page__hero">
        <div className="landing-page__hero-content">
          <h1 className="landing-page__hero-title">
            Zarządzaj swoim
            <span className="landing-page__hero-title--gradient"> żywieniem</span>
            <br />
            inteligentnie
          </h1>
          <p className="landing-page__hero-subtitle">
            Kompleksowa platforma do planowania posiłków, śledzenia kalorii i osiągania celów zdrowotnych. Wszystko w
            jednym miejscu.
          </p>
        </div>

        <div className="landing-page__hero-visual">
          <div className="landing-page__hero-card landing-page__hero-card--login">
            <h2 className="landing-page__login-title">Zaloguj się</h2>

            <form onSubmit={handleSubmit} className="landing-page__login-form">
              {error && (
                <div className="landing-page__login-error">
                  <span className="landing-page__login-error-icon">⚠</span>
                  {error}
                </div>
              )}

              <div className="landing-page__form-group">
                <label htmlFor="username" className="landing-page__form-label">
                  Nazwa użytkownika
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="landing-page__form-input"
                  placeholder="ADMIN"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="landing-page__form-group">
                <label htmlFor="password" className="landing-page__form-label">
                  Hasło
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="landing-page__form-input"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <button type="submit" className="landing-page__login-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="landing-page__login-spinner"></span>
                    Logowanie...
                  </>
                ) : (
                  "Zaloguj się"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
