/**
 * ProductsPage Component
 * Main page for products management
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductList } from "../components/features/products/ProductList";
import { ProductForm } from "../components/features/products/ProductForm";
import "./ProductsPage.css";

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { products, isLoading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, kcalPer100, proteins

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

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
        alert("Product updated successfully!");
      } else {
        await createProduct(formData);
        alert("Product created successfully!");
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      alert(`Failed to ${editingProduct ? "update" : "create"} product: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      alert("Product deleted successfully!");
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
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
      {/* Header */}
      <header className="products-page__header">
        <div className="products-page__header-content">
          <h1 className="products-page__title">Products</h1>
          <div className="products-page__header-actions">
            <button
              className="products-page__button products-page__button--create"
              onClick={handleCreateClick}
              disabled={isLoading}
            >
              + Create Product
            </button>
            <button className="products-page__button products-page__button--logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="products-page__main">
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
                    placeholder="🔍 Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="products-page__clear-search"
                      onClick={() => setSearchTerm("")}
                      title="Clear search"
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
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select className="products-page__sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Sort by Name</option>
                  <option value="kcalPer100">Sort by Calories</option>
                  <option value="proteins">Sort by Protein</option>
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
      </main>
    </div>
  );
};
