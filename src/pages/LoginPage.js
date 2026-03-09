import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { useToast } from "../contexts/ToastContext";
import "./LoginPage.css";

export const LoginPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
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
      await authService.login(formData.email, formData.password);
      addToast("Zalogowano pomyślnie!", "success");
      navigate("/mealsinday");
    } catch (err) {
      setError(err.response?.data?.message || "Nieprawidłowe dane logowania");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__left">
          <div className="login-page__brand">
            <div className="login-page__logo">
              <span className="login-page__logo-icon">🍎</span>
              <span className="login-page__logo-text">Nourishment</span>
            </div>
            <h1 className="login-page__title">Witaj ponownie!</h1>
            <p className="login-page__description">Zaloguj się aby kontynuować zarządzanie swoim żywieniem</p>
          </div>

          <div className="login-page__features">
            <div className="login-page__feature">
              <span className="login-page__feature-icon">✓</span>
              <span>Bezpieczne logowanie</span>
            </div>
            <div className="login-page__feature">
              <span className="login-page__feature-icon">✓</span>
              <span>Dostęp do wszystkich funkcji</span>
            </div>
            <div className="login-page__feature">
              <span className="login-page__feature-icon">✓</span>
              <span>Synchronizacja na wszystkich urządzeniach</span>
            </div>
          </div>
        </div>

        <div className="login-page__right">
          <div className="login-page__form-container">
            <div className="login-page__form-header">
              <h2 className="login-page__form-title">Zaloguj się</h2>
              <p className="login-page__form-subtitle">
                Nie masz konta?{" "}
                <Link to="/register" className="login-page__link">
                  Zarejestruj się
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-page__form">
              <div className="login-page__form-group">
                <label htmlFor="email" className="login-page__label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="login-page__input"
                  placeholder="twoj@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="login-page__form-group">
                <label htmlFor="password" className="login-page__label">
                  Hasło
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="login-page__input"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="login-page__error" style={{ color: "red", marginTop: "-10px", marginBottom: "15px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="login-page__error-icon">⚠</span>
                  {error}
                </div>
              )}

              <div className="login-page__form-options">
                <label className="login-page__checkbox">
                  <input type="checkbox" />
                  <span>Zapamiętaj mnie</span>
                </label>
                <Link to="/forgot-password" className="login-page__link">
                  Zapomniałeś hasła?
                </Link>
              </div>

              <button type="submit" className="login-page__submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="login-page__spinner"></span>
                    Logowanie...
                  </>
                ) : (
                  "Zaloguj się"
                )}
              </button>
            </form>

            <div className="login-page__divider">
              <span>lub kontynuuj z</span>
            </div>

            <div className="login-page__social">
              <button className="login-page__social-button">
                <span>G</span> Google
              </button>
              <button className="login-page__social-button">
                <span>f</span> Facebook
              </button>
            </div>
          </div>

          <div className="login-page__footer">
            <Link to="/" className="login-page__back-link">
              ← Wróć do strony głównej
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
