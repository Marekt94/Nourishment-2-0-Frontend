import React, { useState, useEffect } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { useToast } from "../../../contexts/ToastContext";
import { ProductForm } from "../products/ProductForm";
import "./ShoppingListForm.css";

export const ShoppingListForm = ({ shoppingList, onSubmit, onCancel, onSuccess, onError, isLoading }) => {
  const { addToast } = useToast();
  const { products, createProduct } = useProducts();
  const [showQuickProductModal, setShowQuickProductModal] = useState(false);
  const [quickProductName, setQuickProductName] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    products: []
  });

  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [highlightedProductIndex, setHighlightedProductIndex] = useState(0);

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
    const availableProducts = products.filter(
      (p) => !formData.products.some((fp) => fp.productId === p.id)
    );
    if (!term) return availableProducts;
    return availableProducts.filter((product) => product.name?.toLowerCase().includes(term));
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
      products: [newProductEntry, ...prev.products]
    }));
    setProductSearchTerm("");
    setHighlightedProductIndex(0);
    setShowProductDropdown(false);
  };

  const handleProductSearchKeyDown = (e) => {
    const filtered = getFilteredProducts();
    const hasAddOption = productSearchTerm.trim() !== "";
    const totalOptions = filtered.length + (hasAddOption ? 1 : 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedProductIndex((prev) => Math.min(prev + 1, totalOptions - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedProductIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Tab") {
      if (hasAddOption) {
        e.preventDefault();
        setHighlightedProductIndex(filtered.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedProductIndex < filtered.length) {
        if (filtered[highlightedProductIndex]) {
          handleAddProduct(filtered[highlightedProductIndex]);
        }
      } else if (hasAddOption && highlightedProductIndex === filtered.length) {
        setQuickProductName(productSearchTerm);
        setShowProductDropdown(false);
        setShowQuickProductModal(true);
      }
    } else if (e.key === "Escape") {
      setShowProductDropdown(false);
    }
  };

  const handleCreateNewProduct = (name) => {
    if (!name.trim()) return;
    setQuickProductName(name.trim());
    setShowProductDropdown(false);
    setShowQuickProductModal(true);
  };

  const handleQuickProductSubmit = async (newProductData) => {
    try {
      const created = await createProduct(newProductData);
      handleAddProduct(created);
      setShowQuickProductModal(false);
    } catch (err) {
      addToast("Nie udało się utworzyć nowego produktu: " + err.message, "error");
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
    <>
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
              setHighlightedProductIndex(0);
              setShowProductDropdown(true);
            }}
            onClick={() => setShowProductDropdown(true)}
            onFocus={() => setShowProductDropdown(true)}
            onKeyDown={handleProductSearchKeyDown}
            className="shopping-list-form__input"
          />
          
          {showProductDropdown && (
            <div className="shopping-list-form__dropdown">
              {getFilteredProducts().length === 0 ? (
                <div className="shopping-list-form__dropdown-item shopping-list-form__dropdown-item--empty">
                  Brak produktów
                </div>
              ) : (
                getFilteredProducts().map((product, idx) => (
                  <div
                    key={product.id}
                    className={`shopping-list-form__dropdown-item ${
                      idx === highlightedProductIndex ? "shopping-list-form__dropdown-item--highlighted" : ""
                    }`}
                    onMouseEnter={() => setHighlightedProductIndex(idx)}
                    onClick={() => handleAddProduct(product)}
                  >
                    {product.name} ({product.unit})
                  </div>
                ))
              )}
              {productSearchTerm.trim() !== "" && (
                <div
                  className={`shopping-list-form__dropdown-item shopping-list-form__dropdown-item--create ${
                    highlightedProductIndex === getFilteredProducts().length
                      ? "shopping-list-form__dropdown-item--highlighted"
                      : ""
                  }`}
                  style={{ borderTop: "1px solid #e5e7eb", color: "#3b82f6", fontWeight: "600" }}
                  onMouseEnter={() => setHighlightedProductIndex(getFilteredProducts().length)}
                  onClick={() => handleCreateNewProduct(productSearchTerm)}
                >
                  ➕ Utwórz nowy produkt: {productSearchTerm}
                </div>
              )}
            </div>
          )}
          {showProductDropdown && (
            <div className="shopping-list-form__dropdown-overlay" onClick={() => setShowProductDropdown(false)} />
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
    {showQuickProductModal && (
      <div className="shopping-list-form__modal-overlay" onClick={() => setShowQuickProductModal(false)}>
        <div className="shopping-list-form__modal-content" onClick={(e) => e.stopPropagation()}>
          <ProductForm
            product={{ name: quickProductName }}
            onSubmit={handleQuickProductSubmit}
            onCancel={() => setShowQuickProductModal(false)}
            isLoading={isLoading}
          />
        </div>
      </div>
    )}
    </>
  );
};
