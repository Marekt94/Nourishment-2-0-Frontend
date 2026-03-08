import React, { useState, useEffect } from "react";
import { useProducts } from "../../../hooks/useProducts";
import useMealsInDay from "../../../hooks/useMealsInDay";
import { shoppingListService } from "../../../services/shoppingListService";
import { useNavigate } from "react-router-dom";
import "./GenerateShoppingListDialog.css";

const GenerateShoppingListDialog = ({ open, initialMealInDay, onClose }) => {
  const { products } = useProducts();
  const { mealsInDay } = useMealsInDay();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mealPlans, setMealPlans] = useState([]);
  const [looseProducts, setLooseProducts] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search states
  const [mealSearchTerm, setMealSearchTerm] = useState("");
  const [showMealDropdown, setShowMealDropdown] = useState(false);
  const [mealHighlightedIndex, setMealHighlightedIndex] = useState(-1);

  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [productHighlightedIndex, setProductHighlightedIndex] = useState(-1);

  useEffect(() => {
    if (open) {
      if (initialMealInDay && initialMealInDay.name) {
        setName(initialMealInDay.name);
      } else {
        const today = new Date().toISOString().split('T')[0];
        setName(`Zakupy z ${today}`);
      }
      
      if (initialMealInDay) {
        setMealPlans([{
          id: Math.random().toString(),
          mealInDay: initialMealInDay,
          days: 1
        }]);
      } else {
        setMealPlans([]);
      }
      setLooseProducts([]);
      setMealSearchTerm("");
      setProductSearchTerm("");
      setMealHighlightedIndex(-1);
      setProductHighlightedIndex(-1);
    }
  }, [open, initialMealInDay]);

  if (!open) return null;

  const getFilteredMeals = () => {
    const term = mealSearchTerm.toLowerCase();
    return mealsInDay.filter(m => m.name?.toLowerCase().includes(term));
  };

  const getFilteredProducts = () => {
    const term = productSearchTerm.toLowerCase();
    return products.filter(p => p.name?.toLowerCase().includes(term));
  };

  const addMealPlan = (meal) => {
    setMealPlans(prev => [...prev, {
      id: Math.random().toString(),
      mealInDay: meal,
      days: 1
    }]);
    setMealSearchTerm("");
    setShowMealDropdown(false);
    setMealHighlightedIndex(-1);
  };

  const changeDays = (id, newDays) => {
    setMealPlans(prev => prev.map(m => m.id === id ? { ...m, days: parseInt(newDays) || 1 } : m));
  };

  const removeMealPlan = (id) => {
    setMealPlans(prev => prev.filter(m => m.id !== id));
  };

  const addLooseProduct = (product) => {
    setLooseProducts(prev => [...prev, {
      id: Math.random().toString(),
      productId: product.id,
      productName: product.name,
      weight: product.weight || 100,
      unit: product.unit
    }]);
    setProductSearchTerm("");
    setShowProductDropdown(false);
    setProductHighlightedIndex(-1);
  };

  const changeWeight = (id, newWeight) => {
    setLooseProducts(prev => prev.map(p => p.id === id ? { ...p, weight: parseFloat(newWeight) || 0 } : p));
  };

  const removeLooseProduct = (id) => {
    setLooseProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Podaj nazwę listy");
    if (mealPlans.length === 0 && looseProducts.length === 0) return alert("Dodaj przynajmniej jeden plan dnia lub produkt");

    setIsSubmitting(true);
    try {
      const requestData = {
        name,
        mealPlans: mealPlans.map(m => ({ mealInDayId: m.mealInDay.id, days: m.days })),
        looseProducts: looseProducts.map(p => ({ productId: p.productId, weight: p.weight }))
      };
      
      const response = await shoppingListService.generateShoppingList(requestData);
      onClose();
      // Redirect to shopping lists page
      navigate("/shopping-lists");
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd przy generowaniu listy: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMealKeyDown = (e) => {
    if (!showMealDropdown) return;
    const items = getFilteredMeals().slice(0, 10);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setMealHighlightedIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setMealHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (mealHighlightedIndex >= 0 && mealHighlightedIndex < items.length) {
        addMealPlan(items[mealHighlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowMealDropdown(false);
    }
  };

  const handleProductKeyDown = (e) => {
    if (!showProductDropdown) return;
    const items = getFilteredProducts().slice(0, 10);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setProductHighlightedIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setProductHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (productHighlightedIndex >= 0 && productHighlightedIndex < items.length) {
        addLooseProduct(items[productHighlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowProductDropdown(false);
    }
  };

  return (
    <div className="generate-sl-dialog-overlay" onClick={onClose}>
      <div className="generate-sl-dialog" onClick={e => e.stopPropagation()}>
        <div className="generate-sl-dialog__header">
          <h2>Generuj Listę Zakupów</h2>
          <button className="generate-sl-dialog__close" onClick={onClose}>✕</button>
        </div>

        <div className="generate-sl-dialog__content">
          <div className="generate-sl-dialog__field">
            <label>Nazwa listy</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
            />
          </div>

          <div className="generate-sl-dialog__section">
            <h3>Plany Dnia</h3>
            {mealPlans.map(mp => (
              <div key={mp.id} className="generate-sl-dialog__item">
                <span className="generate-sl-dialog__item-name">{mp.mealInDay.name}</span>
                <div className="generate-sl-dialog__item-controls">
                  <label>Dni: </label>
                  <input 
                    type="number" 
                    min="1" 
                    value={mp.days} 
                    onChange={e => changeDays(mp.id, e.target.value)} 
                  />
                  <button type="button" title="Usuń" className="generate-sl-dialog__btn-icon" onClick={() => removeMealPlan(mp.id)}>🗑️</button>
                </div>
              </div>
            ))}
            
            <div className="generate-sl-dialog__search-wrap">
              <input 
                type="text" 
                placeholder="Dodaj kolejny plan dnia..." 
                value={mealSearchTerm}
                onChange={e => {
                  setMealSearchTerm(e.target.value);
                  setMealHighlightedIndex(-1);
                  setShowMealDropdown(true);
                }}
                onFocus={() => {
                  setMealHighlightedIndex(-1);
                  setShowMealDropdown(true);
                }}
                onBlur={() => setTimeout(() => setShowMealDropdown(false), 200)}
                onKeyDown={handleMealKeyDown}
              />
              {showMealDropdown && (
                <div className="generate-sl-dialog__dropdown">
                  {getFilteredMeals().slice(0, 10).map((m, idx) => (
                    <div 
                      key={m.id} 
                      className={`generate-sl-dialog__dropdown-item ${idx === mealHighlightedIndex ? 'highlighted' : ''}`}
                      onMouseEnter={() => setMealHighlightedIndex(idx)}
                      onClick={() => addMealPlan(m)}
                    >
                      {m.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="generate-sl-dialog__section">
            <h3>Osobne Produkty</h3>
            {looseProducts.map(lp => (
              <div key={lp.id} className="generate-sl-dialog__item">
                <span className="generate-sl-dialog__item-name">{lp.productName}</span>
                <div className="generate-sl-dialog__item-controls">
                  <input 
                    type="number" 
                    min="0"
                    step="0.01" 
                    value={lp.weight} 
                    onChange={e => changeWeight(lp.id, e.target.value)} 
                  />
                  <span>{lp.unit}</span>
                  <button type="button" title="Usuń" className="generate-sl-dialog__btn-icon" onClick={() => removeLooseProduct(lp.id)}>🗑️</button>
                </div>
              </div>
            ))}
            
            <div className="generate-sl-dialog__search-wrap">
              <input 
                type="text" 
                placeholder="Dodaj dodatkowy produkt..." 
                value={productSearchTerm}
                onChange={e => {
                  setProductSearchTerm(e.target.value);
                  setProductHighlightedIndex(-1);
                  setShowProductDropdown(true);
                }}
                onFocus={() => {
                  setProductHighlightedIndex(-1);
                  setShowProductDropdown(true);
                }}
                onBlur={() => setTimeout(() => setShowProductDropdown(false), 200)}
                onKeyDown={handleProductKeyDown}
              />
              {showProductDropdown && (
                <div className="generate-sl-dialog__dropdown">
                  {getFilteredProducts().slice(0, 10).map((p, idx) => (
                    <div 
                      key={p.id} 
                      className={`generate-sl-dialog__dropdown-item ${idx === productHighlightedIndex ? 'highlighted' : ''}`}
                      onMouseEnter={() => setProductHighlightedIndex(idx)}
                      onClick={() => addLooseProduct(p)}
                    >
                      {p.name} ({p.unit})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="generate-sl-dialog__actions">
          <button type="button" onClick={onClose} className="generate-sl-dialog__btn btn-cancel" disabled={isSubmitting}>Anuluj</button>
          <button type="button" onClick={handleSubmit} className="generate-sl-dialog__btn btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "Generowanie..." : "Wygeneruj"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateShoppingListDialog;
