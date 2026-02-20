# Debug Dropdown - Test naprawy

## Problem:

Lista produktów luźnych nie wyświetla się po kliknięciu w pole wyszukiwania.

## Struktura HTML (z kodu):

```html
<div className="meal-in-day-form__product-search">
  <div className="meal-in-day-form__dropdown-container">
    <input onFocus="{()" ="" /> setShowProductDropdown(true)} /> {showProductDropdown && (
    <div className="meal-in-day-form__dropdown-wrapper">
      <!-- z-index: 20, position: absolute -->
      <div className="meal-in-day-form__dropdown">
        <!-- position: static (override) -->
        {products.map(product => (
        <div className="meal-in-day-form__dropdown-item">{product.name}</div>
        ))}
      </div>
    </div>
    )}
  </div>

  {showProductDropdown && (
  <div className="meal-in-day-form__dropdown-overlay" onClick="{...}" />
  <!-- z-index: 15 -->
  )}
</div>
```

## CSS Zmiany:

1. `.meal-in-day-form__dropdown-wrapper` - position: absolute, z-index: 20
2. `.meal-in-day-form__dropdown-wrapper .meal-in-day-form__dropdown` - position: static (override), max-height: 300px, overflow-y: auto
3. Dodano explicit styling dla items w dropdown wrapper

## Do sprawdzenia w przeglądarce:

1. Czy `showProductDropdown` zmienia się na `true` po kliknięciu?
2. Czy lista produktów nie jest pusta (`products.length > 0`)?
3. Czy dropdown-wrapper jest widoczny (sprawdź w DevTools)?
4. Czy overflow-y: auto działa?
5. Czy z-index jest poprawny (dropdown powyżej overlay)?

## Możliwe przyczyny jeśli nadal nie działa:

- `products` jest puste lub undefined
- `productsLoading` jest true
- `getFilteredProducts()` zwraca pustą tablicę
- Event onFocus nie odpala (check console.log)
- CSS overlay zasłania dropdown (mimo z-index)
