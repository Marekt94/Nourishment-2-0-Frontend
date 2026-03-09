/**
 * ProductsPage Component
 * Main page for products management
 */

import React, { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductList } from "../components/features/products/ProductList";
import { ProductForm } from "../components/features/products/ProductForm";
import { useToast } from "../contexts/ToastContext";
import "./ProductsPage.css";

export const ProductsPage = () => {
  const { addToast } = useToast();
  const { products, isLoading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, kcalPer100, proteins

  const handleCreateClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(formData);
        addToast("Product updated successfully!", "success");
      } else {
        await createProduct(formData);
        addToast("Product created successfully!", "success");
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      addToast(`Failed to ${editingProduct ? "update" : "create"} product: ${err.message}`, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      addToast("Product deleted successfully!", "success");
    } catch (err) {
      addToast(`Failed to delete product: ${err.message}`, "error");
    }
  };

  // Get unique categories from products
  const categories = [
    ...new Set(
      products
        .map((p) => {
          if (typeof p.category === "object" && p.category?.name) {
            return p.category.name;
          }
          return p.category;
        })
        .filter(Boolean),
    ),
  ];

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Search by name
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by category
      let matchesCategory = true;
      if (selectedCategory) {
        const productCategory = typeof product.category === "object" ? product.category?.name : product.category;
        matchesCategory = productCategory === selectedCategory;
      }

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort products
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "kcalPer100") {
        return (b.kcalPer100 || 0) - (a.kcalPer100 || 0);
      } else if (sortBy === "proteins") {
        return (b.proteins || 0) - (a.proteins || 0);
      }
      return 0;
    });

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-page__header">
        <h1 className="products-page__title">🥗 Produkty</h1>
        {!showForm && (
          <button onClick={handleCreateClick} className="products-page__create-button">
            <span className="products-page__create-icon">➕</span>
            Dodaj Produkt
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="products-page__container">
        {showForm ? (
          <div className="products-page__form-wrapper">
            <ProductForm
              product={editingProduct}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <>
            {/* Search and Filter Bar */}
            <div className="products-page__controls">
              <div className="products-page__search-wrapper">
                <input
                  type="text"
                  className="products-page__search"
                  placeholder="🔍 Szukaj produktów po nazwie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="products-page__clear-search"
                    onClick={() => setSearchTerm("")}
                    title="Wyczyść wyszukiwanie"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                className="products-page__filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Wszystkie kategorie</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select className="products-page__sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Sortuj po nazwie</option>
                <option value="kcalPer100">Sortuj po kaloriach</option>
                <option value="proteins">Sortuj po białku</option>
              </select>
            </div>

            <ProductList
              products={filteredProducts}
              isLoading={isLoading}
              error={error}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
    </div>
  );
};
