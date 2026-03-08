import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useShoppingLists from '../hooks/useShoppingLists';
import { shoppingListService } from '../services/shoppingListService';
import './ShoppingListDetailsPage.css';

export const ShoppingListDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shoppingLists, isLoading, error, refetch } = useShoppingLists();
  const [list, setList] = useState(null);
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [collapsedCategories, setCollapsedCategories] = useState({});

  // Find the list from the general context or fetch if not present
  useEffect(() => {
    if (shoppingLists.length > 0) {
      const foundList = shoppingLists.find(l => l.id === parseInt(id));
      if (foundList) {
        setList(foundList);
      } else {
         // Fallback if not in the cached list, could fetch single list here if we had the endpoint
      }
    }
  }, [id, shoppingLists]);
  
  // Load saved category order from localStorage
  useEffect(() => {
    if (list) {
      const savedOrder = localStorage.getItem(`shopping-list-order-${list.id}`);
      if (savedOrder) {
        setCategoryOrder(JSON.parse(savedOrder));
      }
    }
  }, [list]);

  // Group products by category
  const groupedProducts = useMemo(() => {
    if (!list || !list.products) return {};
    return list.products.reduce((acc, item) => {
      const categoryName = item.categoryName || "Inne";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    }, {});
  }, [list]);

  // Sort categories based on saved order
  const getSortedCategories = () => {
    const defaultCategories = Object.keys(groupedProducts);
    
    if (categoryOrder.length === 0) {
      return defaultCategories;
    }

    // Merge saved order with any new categories that might have appeared, and remove old ones
    const sorted = [];
    categoryOrder.forEach(cat => {
      if (defaultCategories.includes(cat)) {
        sorted.push(cat);
      }
    });

    defaultCategories.forEach(cat => {
      if (!sorted.includes(cat)) {
        sorted.push(cat);
      }
    });

    return sorted;
  };

  const sortedCategories = getSortedCategories();

  const handleDragStart = (e, categoryName) => {
    e.dataTransfer.setData('text/plain', categoryName);
    e.currentTarget.classList.add('shopping-list-details__category--dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('shopping-list-details__category--dragging');
    const categories = document.querySelectorAll('.shopping-list-details__category');
    categories.forEach(cat => cat.classList.remove('shopping-list-details__category--drag-over'));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('shopping-list-details__category--drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('shopping-list-details__category--drag-over');
  };

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();
    e.currentTarget.classList.remove('shopping-list-details__category--drag-over');
    
    const draggedCategory = e.dataTransfer.getData('text/plain');
    if (draggedCategory === targetCategory) return;

    let newOrder = [...sortedCategories];
    const draggedIndex = newOrder.indexOf(draggedCategory);
    const targetIndex = newOrder.indexOf(targetCategory);

    // Remove dragged item
    newOrder.splice(draggedIndex, 1);
    // Insert at new index
    newOrder.splice(targetIndex, 0, draggedCategory);

    setCategoryOrder(newOrder);
    localStorage.setItem(`shopping-list-order-${list.id}`, JSON.stringify(newOrder));
  };

  const toggleCategory = (category) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

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
      refetch(true); // reload list from backend
    } catch (err) {
      console.error("Error toggling bought status:", err);
      alert("Nie udało się zaktualizować statusu produktu");
    }
  };

  const calculateProgress = () => {
    if (!list || !list.products || list.products.length === 0) return 0;
    const boughtCount = list.products.filter(p => p.bought).length;
    return Math.round((boughtCount / list.products.length) * 100);
  };

  if (isLoading) return <div className="shopping-list-details__loading">Ładowanie...</div>;
  if (error) return <div className="shopping-list-details__error">Błąd: {error}</div>;
  if (!list) return <div className="shopping-list-details__not-found">Nie znaleziono listy.</div>;
  
  const progress = calculateProgress();

  return (
    <div className="shopping-list-details">
        <div className="shopping-list-details__header">
            <button className="shopping-list-details__back-btn" onClick={() => navigate('/shopping-lists')}>
                ← Wróć do list
            </button>
            <div className="shopping-list-details__title-group">
                <h1 className="shopping-list-details__title">{list.name}</h1>
            </div>
        </div>

        <div className="shopping-list-details__progress-container">
            <div className="shopping-list-details__progress-bar" style={{ width: `${progress}%` }}></div>
            <span className="shopping-list-details__progress-text">{progress}% kupione</span>
        </div>

        <div className="shopping-list-details__content">
            {sortedCategories.map((category) => {
                const isCollapsed = collapsedCategories[category];
                return (
                  <div 
                      key={category} 
                      className="shopping-list-details__category"
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, category)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, category)}
                  >
                      <div className="shopping-list-details__category-header" onClick={() => toggleCategory(category)}>
                          <span className="shopping-list-details__drag-handle" title="Przeciągnij, aby zmienić koleność" onClick={(e) => e.stopPropagation()}>☰</span>
                          <h2 className="shopping-list-details__category-name">{category}</h2>
                          <span className="shopping-list-details__collapse-icon">
                              {isCollapsed ? '▼' : '▲'}
                          </span>
                      </div>
                      
                      {!isCollapsed && (
                        <ul className="shopping-list-details__products">
                            {groupedProducts[category].map((item) => (
                                <li key={item.id} className={`shopping-list-details__product ${item.bought ? 'shopping-list-details__product--bought' : ''}`}>
                                    <label className="shopping-list-details__checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={item.bought}
                                            onChange={() => toggleBought(item)}
                                        />
                                        <span className="shopping-list-details__checkmark"></span>
                                    </label>
                                    <div className="shopping-list-details__product-info">
                                        <span className="shopping-list-details__product-name">{item.productName}</span>
                                        <span className="shopping-list-details__product-amount">
                                            {item.weight}{item.productUnit} 
                                            {item.quantity > 0 && item.quantity !== 1 && ` (~${item.quantity.toFixed(2)} szt.)`}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                      )}
                  </div>
                );
            })}
            {(!list.products || list.products.length === 0) && (
              <p className="shopping-list-details__empty-msg">Brak produktów na liście</p>
            )}
        </div>
    </div>
  );
};
