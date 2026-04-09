import React, { useState, useEffect } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { useToast } from "../../../contexts/ToastContext";
import "./ShoppingListForm.css";

export const ShoppingListForm = ({ shoppingList, onSubmit, onCancel, onSuccess, onError, isLoading }) => {
  const { addToast } = useToast();
  const { products, createProduct } = useProducts();
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    products: []
  });

  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  useEffect(() => {
    if (shoppingList) {
      setFormData({
        id: shoppingList.id,
        name: shoppingList.name || "",
        products: (shoppingList.products || []).map(p => ({
          ...p,
          tempId: p.id || Math.random(),
          // Ensure we have the necessary info for display from the flat structure
          productName: p.productName,
          productUnit: p.productUnit,
          unitWeight: p.weight / (p.quantity || 1) // Approximation if not provided
        }))
      });
    }
  }, [shoppingList]);

  const handleNameChange = (e) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };

  const getFilteredProducts = () => {
    const term = productSearchTerm.toLowerCase();
    return products.filter(p => p.name?.toLowerCase().includes(term));
  };

  const handleAddProduct = (product) => {
    const newProductEntry = {
      tempId: Math.random(),
      productId: product.id,
      productName: product.name,
      productUnit: product.unit,
      unitWeight: product.weight,
      weight: product.weight || 100,
      quantity: 1,
      bought: false
    };

    setFormData(prev => ({
      ...prev,
      products: [...prev.products, newProductEntry]
    }));
    setProductSearchTerm("");
    setShowProductDropdown(false);
  };

  const handleCreateNewProduct = async (name) => {
    if (!name.trim()) return;
    setIsCreatingProduct(true);
    try {
      const newProductData = {
        name: name.trim(),
        kcalPer100: 0,
        weight: 100,
        proteins: 0,
        fat: 0,
        sugar: 0,
        carbohydrates: 0,
        sugarAndCarb: 0,
        fiber: 0,
        salt: 0,
        unit: "g",
        category: { id: 1 }
      };
      const created = await createProduct(newProductData);
      handleAddProduct(created);
    } catch (err) {
      addToast("Nie udało się utworzyć nowego produktu: " + err.message, "error");
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleRemoveProduct = (tempId) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.tempId !== tempId)
    }));
  };

  const handleProductWeightChange = (tempId, weight) => {
    const val = parseFloat(weight) || 0;
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.tempId === tempId) {
          const quantity = p.unitWeight > 0 ? val / p.unitWeight : 0;
          return { ...p, weight: val, quantity };
        }
        return p;
      })
    }));
  };

  const handleProductQuantityChange = (tempId, quantity) => {
    const val = parseFloat(quantity) || 0;
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.tempId === tempId) {
          const weight = p.unitWeight > 0 ? val * p.unitWeight : p.weight;
          return { ...p, quantity: val, weight };
        }
        return p;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast("Proszę podać nazwę listy", "warning");
      return;
    }

    // Transform products to only send what the backend expects
    const submissionData = {
      ...formData,
      products: formData.products.map(p => ({
        id: p.id > 0 ? p.id : 0,
        listId: formData.id || 0,
        productId: p.productId,
        weight: p.weight,
        bought: p.bought || false
      }))
    };

    try {
      await onSubmit(submissionData);
      onSuccess?.();
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <form className="shopping-list-form" onSubmit={handleSubmit}>
      <h2 className="shopping-list-form__title">
        {shoppingList ? "Edytuj listę zakupów" : "Nowa lista zakupów"}
      </h2>

      <div className="shopping-list-form__section">
        <label className="shopping-list-form__label">Nazwa listy</label>
        <input
          type="text"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="np. Zakupy na tydzień"
          className="shopping-list-form__input"
          required
          autoFocus
        />
      </div>

      <div className="shopping-list-form__section">
        <label className="shopping-list-form__label">Dodaj produkty</label>
        <div className="shopping-list-form__product-search">
          <input
            type="text"
            placeholder="Szukaj produktu..."
            value={productSearchTerm}
            onChange={(e) => {
              setProductSearchTerm(e.target.value);
              setShowProductDropdown(true);
            }}
            onFocus={() => setShowProductDropdown(true)}
            onBlur={() => setTimeout(() => setShowProductDropdown(false), 200)}
            className="shopping-list-form__input"
          />
          {showProductDropdown && productSearchTerm && (
            <div className="shopping-list-form__dropdown">
              {getFilteredProducts().slice(0, 10).map((p, idx) => (
                <div
                  key={p.id}
                  className="shopping-list-form__dropdown-item"
                  onClick={() => handleAddProduct(p)}
                >
                  {p.name} ({p.unit})
                </div>
              ))}
              {getFilteredProducts().length === 0 && productSearchTerm && (
                <div 
                  className="shopping-list-form__dropdown-item shopping-list-form__dropdown-item--create"
                  onClick={() => handleCreateNewProduct(productSearchTerm)}
                >
                  {isCreatingProduct ? "Tworzenie..." : `+ Dodaj nowy produkt: "${productSearchTerm}"`}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="shopping-list-form__products-list">
          {formData.products.map((item) => (
            <div key={item.tempId} className="shopping-list-form__product-row">
              <span className="shopping-list-form__product-name">{item.productName}</span>
              <div className="shopping-list-form__product-inputs">
                <div className="shopping-list-form__input-group">
                  <input
                    type="number"
                    step="0.01"
                    value={item.weight}
                    onChange={(e) => handleProductWeightChange(item.tempId, e.target.value)}
                    className="shopping-list-form__number-input"
                  />
                  <span className="shopping-list-form__unit">{item.productUnit}</span>
                </div>
                {item.unitWeight > 0 && (
                  <div className="shopping-list-form__input-group">
                    <input
                      type="number"
                      step="0.1"
                      value={item.quantity.toFixed(1)}
                      onChange={(e) => handleProductQuantityChange(item.tempId, e.target.value)}
                      className="shopping-list-form__number-input"
                    />
                    <span className="shopping-list-form__unit">szt.</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(item.tempId)}
                  className="shopping-list-form__remove-btn"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shopping-list-form__actions">
        <button type="button" onClick={onCancel} className="shopping-list-form__btn shopping-list-form__btn--cancel">
          Anuluj
        </button>
        <button type="submit" className="shopping-list-form__btn shopping-list-form__btn--submit" disabled={isLoading}>
          {isLoading ? "Zapisywanie..." : "Zapisz listę"}
        </button>
      </div>
    </form>
  );
};
