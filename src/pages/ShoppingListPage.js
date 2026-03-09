import React, { useState } from "react";
import useShoppingLists from "../hooks/useShoppingLists";
import ShoppingListCard from "../components/features/shoppingList/ShoppingListCard";
import { ShoppingListForm } from "../components/features/shoppingList/ShoppingListForm";
import { useToast } from "../contexts/ToastContext";
import "./ShoppingListPage.css";

export const ShoppingListPage = () => {
  const { addToast } = useToast();
  const { 
    shoppingLists, 
    isLoading, 
    error, 
    createShoppingList, 
    updateShoppingList, 
    deleteShoppingList,
    refetch 
  } = useShoppingLists();

  const [showForm, setShowForm] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreate = () => {
    setEditingList(null);
    setShowForm(true);
  };

  const handleEdit = (list) => {
    setEditingList(list);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę listę zakupów?")) {
      try {
        await deleteShoppingList(id);
        addToast("Lista zakupów usunięta", "success");
      } catch (err) {
        addToast("Błąd podczas usuwania listy", "error");
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingList) {
        await updateShoppingList(data);
      } else {
        await createShoppingList(data);
      }
      setShowForm(false);
      setEditingList(null);
    } catch (err) {
      console.error("Form submit error:", err);
      throw err;
    }
  };

  const filteredLists = shoppingLists.filter((list) =>
    list.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="shopping-list-page">
      <div className="shopping-list-page__header">
        <h1 className="shopping-list-page__title">🛒 Listy Zakupów</h1>
        {!showForm && (
          <button onClick={handleCreate} className="shopping-list-page__create-button">
            <span className="shopping-list-page__create-icon">➕</span>
            Nowa Lista
          </button>
        )}
      </div>

      {error && (
        <div className="shopping-list-page__error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {showForm ? (
        <div className="shopping-list-page__form-container">
          <ShoppingListForm
            shoppingList={editingList}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingList(null);
            }}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <>
          <div className="shopping-list-page__controls">
            <input
              type="text"
              className="shopping-list-page__search"
              placeholder="🔍 Szukaj listy po nazwie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading && <p>Ładowanie...</p>}

          {!isLoading && (
            <div className="shopping-list-page__list">
              {filteredLists.length === 0 ? (
                <div className="shopping-list-page__empty">
                  <span className="shopping-list-page__empty-icon">📭</span>
                  <h3>Brak list zakupów</h3>
                  <p>Kliknij "Nowa Lista", aby dodać pierwszą listę</p>
                </div>
              ) : (
                filteredLists.map((list) => (
                  <ShoppingListCard
                    key={list.id}
                    list={list}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRefresh={refetch}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
