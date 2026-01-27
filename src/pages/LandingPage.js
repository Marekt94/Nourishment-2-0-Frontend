import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🍽️",
      title: "Planuj Posiłki",
      description: "Twórz personalizowane plany żywieniowe dopasowane do Twoich celów",
    },
    {
      icon: "📊",
      title: "Śledź Kalorie",
      description: "Monitoruj wartości odżywcze i kontroluj bilans kaloryczny",
    },
    {
      icon: "🎯",
      title: "Osiągaj Cele",
      description: "Realizuj cele zdrowotne dzięki inteligentnym rekomendacjom",
    },
    {
      icon: "📱",
      title: "Zawsze Pod Ręką",
      description: "Dostęp do wszystkich danych z każdego urządzenia",
    },
  ];

  const testimonials = [
    {
      name: "Anna Kowalska",
      role: "Trener personalny",
      text: "Nourishment całkowicie zmienił sposób, w jaki zarządzam dietą moich klientów.",
      avatar: "👩",
    },
    {
      name: "Piotr Nowak",
      role: "Sportowiec",
      text: "Intuicyjny interfejs i dokładne śledzenie kalorii. Polecam każdemu!",
      avatar: "👨",
    },
    {
      name: "Maria Wiśniewska",
      role: "Dietetyk",
      text: "Profesjonalne narzędzie, które oszczędza mi mnóstwo czasu.",
      avatar: "👩‍⚕️",
    },
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-page__nav">
        <div className="landing-page__nav-container">
          <div className="landing-page__logo">
            <span className="landing-page__logo-icon">🍎</span>
            <span className="landing-page__logo-text">Nourishment</span>
          </div>
          <div className="landing-page__nav-actions">
            <button
              className="landing-page__nav-button landing-page__nav-button--secondary"
              onClick={() => navigate("/login")}
            >
              Zaloguj się
            </button>
            <button
              className="landing-page__nav-button landing-page__nav-button--primary"
              onClick={() => navigate("/register")}
            >
              Rozpocznij za darmo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-page__hero">
        <div className="landing-page__hero-content">
          <div className="landing-page__hero-badge">✨ Nowa wersja dostępna teraz</div>
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
          <div className="landing-page__hero-actions">
            <button
              className="landing-page__button landing-page__button--primary"
              onClick={() => navigate("/register")}
            >
              Zacznij teraz - za darmo
              <span className="landing-page__button-icon">→</span>
            </button>
            <button className="landing-page__button landing-page__button--outline" onClick={() => navigate("/login")}>
              <span className="landing-page__button-icon">▶</span>
              Zobacz demo
            </button>
          </div>
          <div className="landing-page__hero-stats">
            <div className="landing-page__hero-stat">
              <div className="landing-page__hero-stat-value">10K+</div>
              <div className="landing-page__hero-stat-label">Aktywnych użytkowników</div>
            </div>
            <div className="landing-page__hero-stat">
              <div className="landing-page__hero-stat-value">50K+</div>
              <div className="landing-page__hero-stat-label">Posiłków zaplanowanych</div>
            </div>
            <div className="landing-page__hero-stat">
              <div className="landing-page__hero-stat-value">4.9/5</div>
              <div className="landing-page__hero-stat-label">Ocena użytkowników</div>
            </div>
          </div>
        </div>
        <div className="landing-page__hero-visual">
          <div className="landing-page__hero-card landing-page__hero-card--floating">
            <div className="landing-page__hero-card-icon">📊</div>
            <div className="landing-page__hero-card-content">
              <div className="landing-page__hero-card-title">Twój dzienny cel</div>
              <div className="landing-page__hero-card-value">1,847 / 2,000 kcal</div>
              <div className="landing-page__hero-card-progress">
                <div className="landing-page__hero-card-progress-bar" style={{ width: "92%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-page__features">
        <div className="landing-page__features-header">
          <span className="landing-page__section-badge">Funkcje</span>
          <h2 className="landing-page__section-title">
            Wszystko czego potrzebujesz
            <br />
            do zarządzania dietą
          </h2>
          <p className="landing-page__section-subtitle">
            Kompleksowe narzędzia do monitorowania i planowania Twojego żywienia
          </p>
        </div>
        <div className="landing-page__features-grid">
          {features.map((feature, index) => (
            <div key={index} className="landing-page__feature-card">
              <div className="landing-page__feature-icon">{feature.icon}</div>
              <h3 className="landing-page__feature-title">{feature.title}</h3>
              <p className="landing-page__feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="landing-page__testimonials">
        <div className="landing-page__testimonials-header">
          <span className="landing-page__section-badge">Opinie</span>
          <h2 className="landing-page__section-title">Zaufali nam tysiące użytkowników</h2>
        </div>
        <div className="landing-page__testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="landing-page__testimonial-card">
              <div className="landing-page__testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="landing-page__testimonial-text">"{testimonial.text}"</p>
              <div className="landing-page__testimonial-author">
                <div className="landing-page__testimonial-avatar">{testimonial.avatar}</div>
                <div className="landing-page__testimonial-info">
                  <div className="landing-page__testimonial-name">{testimonial.name}</div>
                  <div className="landing-page__testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-page__cta">
        <div className="landing-page__cta-content">
          <h2 className="landing-page__cta-title">Gotowy na zmianę?</h2>
          <p className="landing-page__cta-subtitle">
            Dołącz do tysięcy użytkowników, którzy już zarządzają swoim żywieniem z Nourishment
          </p>
          <button className="landing-page__button landing-page__button--cta" onClick={() => navigate("/register")}>
            Rozpocznij za darmo
            <span className="landing-page__button-icon">→</span>
          </button>
          <p className="landing-page__cta-note">
            ✓ Darmowy plan forever &nbsp;&nbsp; ✓ Bez karty kredytowej &nbsp;&nbsp; ✓ Anuluj kiedy chcesz
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-page__footer">
        <div className="landing-page__footer-content">
          <div className="landing-page__footer-brand">
            <div className="landing-page__logo">
              <span className="landing-page__logo-icon">🍎</span>
              <span className="landing-page__logo-text">Nourishment</span>
            </div>
            <p className="landing-page__footer-description">Inteligentne zarządzanie żywieniem dla każdego</p>
          </div>
          <div className="landing-page__footer-links">
            <div className="landing-page__footer-column">
              <h4 className="landing-page__footer-title">Produkt</h4>
              <a href="#features" className="landing-page__footer-link">
                Funkcje
              </a>
              <a href="#pricing" className="landing-page__footer-link">
                Cennik
              </a>
              <a href="#demo" className="landing-page__footer-link">
                Demo
              </a>
            </div>
            <div className="landing-page__footer-column">
              <h4 className="landing-page__footer-title">Wsparcie</h4>
              <a href="#help" className="landing-page__footer-link">
                Pomoc
              </a>
              <a href="#docs" className="landing-page__footer-link">
                Dokumentacja
              </a>
              <a href="#contact" className="landing-page__footer-link">
                Kontakt
              </a>
            </div>
            <div className="landing-page__footer-column">
              <h4 className="landing-page__footer-title">Firma</h4>
              <a href="#about" className="landing-page__footer-link">
                O nas
              </a>
              <a href="#blog" className="landing-page__footer-link">
                Blog
              </a>
              <a href="#careers" className="landing-page__footer-link">
                Kariera
              </a>
            </div>
          </div>
        </div>
        <div className="landing-page__footer-bottom">
          <p>© 2024 Nourishment. Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
};
