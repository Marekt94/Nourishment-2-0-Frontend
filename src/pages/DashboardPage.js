import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "./DashboardPage.css";

export const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <h1 className="dashboard-page__title">Dashboard</h1>
        <button onClick={handleLogout} className="dashboard-page__logout">
          Wyloguj się
        </button>
      </div>
      <div className="dashboard-page__content">
        <div className="dashboard-page__welcome">
          <h2>Witaj w aplikacji Nourishment! 🎉</h2>
          <p>Tu będzie dashboard z funkcjami aplikacji.</p>
        </div>
      </div>
    </div>
  );
};
