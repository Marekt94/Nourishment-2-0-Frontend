import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import "./Sidebar.css";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Zamknij sidebar po nawigacji na mobile
  };

  const handleLogout = () => {
    authService.logout();
    // Don't navigate - authService.logout() already redirects to "/"
    setIsOpen(false);
  };

  const menuItems = [
    { path: "/mealsinday", icon: "📅", label: "Potrawy w dniu" },
    { path: "/meals", icon: "🍽️", label: "Potrawy" },
    { path: "/products", icon: "🥗", label: "Produkty" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Hamburger button - zawsze widoczny */}
      <button
        className={`sidebar__hamburger ${isOpen ? "sidebar__hamburger--open" : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay - widoczny tylko gdy sidebar otwarty na mobile */}
      {isOpen && <div className="sidebar__overlay" onClick={() => setIsOpen(false)} />}

      {/* Sidebar panel */}
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <span className="sidebar__logo-icon">🍎</span>
            <span className="sidebar__logo-text">Nourishment</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`sidebar__nav-item ${isActive(item.path) ? "sidebar__nav-item--active" : ""}`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              <span className="sidebar__nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__logout" onClick={handleLogout}>
            <span className="sidebar__nav-icon">🚪</span>
            <span className="sidebar__nav-label">Wyloguj</span>
          </button>
        </div>
      </aside>
    </>
  );
};
