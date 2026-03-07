import React, { useMemo } from "react";
import { shoppingListService } from "../../../services/shoppingListService";
import "./ShoppingListCard.css";

const ShoppingListCard = ({ list, onEdit, onDelete, onRefresh }) => {
  // Group products by category
  const groupedProducts = useMemo(() => {
    if (!list.products) return {};
    return list.products.reduce((acc, item) => {
      const categoryName = item.categoryName || "Inne";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    }, {});
  }, [list.products]);

  const toggleBought = async (productInList) => {
    try {
      const updatedProduct = {
        id: productInList.id,
        listId: productInList.listId,
        productId: productInList.productId,
        weight: productInList.weight,
        bought: !productInList.bought
      };
      await shoppingListService.updateProductOnList(updatedProduct);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Error toggling bought status:", err);
      alert("Nie udało się zaktualizować statusu produktu");
    }
  };

  const calculateProgress = () => {
    if (!list.products || list.products.length === 0) return 0;
    const boughtCount = list.products.filter(p => p.bought).length;
    return Math.round((boughtCount / list.products.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="shopping-list-card">
      <div className="shopping-list-card__header">
        <div className="shopping-list-card__title-group">
          <h3 className="shopping-list-card__name">{list.name}</h3>
          <span className="shopping-list-card__date">
            Edytowano: {new Date(list.editDate).toLocaleDateString()}
          </span>
        </div>
        <div className="shopping-list-card__actions">
          <button onClick={() => onEdit(list)} className="shopping-list-card__action-btn" title="Edytuj">✏️</button>
          <button onClick={() => onDelete(list.id)} className="shopping-list-card__action-btn shopping-list-card__action-btn--delete" title="Usuń">🗑️</button>
        </div>
      </div>

      <div className="shopping-list-card__progress-container">
        <div className="shopping-list-card__progress-bar" style={{ width: `${progress}%` }}></div>
        <span className="shopping-list-card__progress-text">{progress}% kupione</span>
      </div>

      <div className="shopping-list-card__content">
        {Object.entries(groupedProducts).map(([category, items]) => (
          <div key={category} className="shopping-list-card__category-section">
            <h4 className="shopping-list-card__category-name">{category}</h4>
            <ul className="shopping-list-card__products-list">
              {items.map((item) => (
                <li key={item.id} className={`shopping-list-card__product-item ${item.bought ? 'shopping-list-card__product-item--bought' : ''}`}>
                  <label className="shopping-list-card__checkbox-container">
                    <input
                      type="checkbox"
                      checked={item.bought}
                      onChange={() => toggleBought(item)}
                    />
                    <span className="shopping-list-card__checkmark"></span>
                  </label>
                  <div className="shopping-list-card__product-info">
                    <span className="shopping-list-card__product-name">{item.productName}</span>
                    <span className="shopping-list-card__product-amount">
                      {item.weight}{item.productUnit} 
                      {item.quantity > 0 && item.quantity !== 1 && ` (~${item.quantity.toFixed(2)} szt.)`}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {(!list.products || list.products.length === 0) && (
          <p className="shopping-list-card__empty-msg">Brak produktów na liście</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingListCard;
