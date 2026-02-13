/**
 * ProductList Component
 * Displays a grid of product cards
 */

import React from "react";
import { ProductCard } from "./ProductCard";
import "./ProductList.css";

export const ProductList = ({ products, isLoading, error, onEdit, onDelete }) => {
  // Debug: log products structure
  React.useEffect(() => {
    if (products && products.length > 0) {
      console.log("📦 Products received:", products);
      console.log("📦 First product:", products[0]);
    }
  }, [products]);

  if (isLoading) {
    return (
      <div className="product-list__loading">
        <div className="product-list__spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list__error">
        <p>⚠️ Error: {error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-list__empty">
        <p>No products found. Create your first product!</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
