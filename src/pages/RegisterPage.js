import { Link } from "react-router-dom";
import "./RegisterPage.css";

export const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-page__container">
        <h1 className="register-page__title">Strona rejestracji</h1>
        <p className="register-page__text">Będzie gotowa wkrótce</p>
        <Link to="/login" className="register-page__link">
          Wróć do logowania
        </Link>
      </div>
    </div>
  );
};
