import React from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingListCard.css";

const ShoppingListCard = ({ list, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const calculateProgress = () => {
    if (!list.products || list.products.length === 0) return 0;
    const boughtCount = list.products.filter(p => p.bought).length;
    return Math.round((boughtCount / list.products.length) * 100);
  };

  const progress = calculateProgress();

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on actions
    if (e.target.closest('.shopping-list-card__actions')) return;
    navigate(`/shopping-lists/${list.id}`);
  };

  return (
    <div className="shopping-list-card shopping-list-card--clickable" onClick={handleCardClick}>
      <div className="shopping-list-card__header">
        <div className="shopping-list-card__title-group">
          <h3 className="shopping-list-card__name">{list.name}</h3>
        </div>
        <div className="shopping-list-card__actions">
          <button onClick={(e) => { e.stopPropagation(); onEdit(list); }} className="shopping-list-card__action-btn" title="Edytuj">✏️</button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(list.id); }} className="shopping-list-card__action-btn shopping-list-card__action-btn--delete" title="Usuń">🗑️</button>
        </div>
      </div>

      <div className="shopping-list-card__progress-container">
        <div className="shopping-list-card__progress-bar" style={{ width: `${progress}%` }}></div>
        <span className="shopping-list-card__progress-text">{progress}% kupione</span>
      </div>
      
      <div className="shopping-list-card__footer">
        <span className="shopping-list-card__open-text">Kliknij aby otworzyć listę →</span>
      </div>
    </div>
  );
};

export default ShoppingListCard;
