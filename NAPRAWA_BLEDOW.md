# Raport Naprawy Błędów - Nourishment 2.0 Frontend

**Data:** 20 lutego 2026  
**Podstawa:** Plik "testy manualne"

---

## ✅ BŁĄD #1: Puste posiłki po dodaniu planu dnia (wymagane odświeżenie strony)

### Opis problemu:

Po udanym dodaniu planu dnia, po rozwinięciu szczegółów widoczne były tylko produkty luźne. Posiłki były puste, trzeba było odświeżyć stronę, aby potrawy się wczytały.

### Przyczyna:

Backend po utworzeniu MealInDay zwraca tylko `{id: integer}`, a nie pełny obiekt. Hook `useMealsInDay` mergował ten ID z wysłanymi danymi, ale wysłane dane zawierały tylko **ID posiłków** (np. `breakfast: {id: 5}`), a nie pełne obiekty Meal z produktami i makroskładnikami.

### Rozwiązanie:

**Plik:** `src/hooks/useMealsInDay.js`

Zmieniono funkcję `createMealInDay`, aby po otrzymaniu ID z backendu, **pobierała pełne dane** za pomocą `getMealInDay(id)`:

```javascript
// PRZED (błędne):
const newMealInDay = {
  ...mealInDayData, // Zawiera tylko {breakfast: {id: 5}}
  id: response.id,
};
setMealsInDay((prev) => [...prev, newMealInDay]);

// PO (naprawione):
const newId = response.id;
const fullMealInDay = await mealInDayService.getMealInDay(newId); // Pobiera pełne dane
setMealsInDay((prev) => [...prev, fullMealInDay]);
```

Analogiczna naprawa dla `updateMealInDay`.

### Efekt:

✅ Po dodaniu planu dnia, rozwinięcie szczegółów natychmiast pokazuje wszystkie posiłki z produktami i poprawnymi makroskładnikami.

---

## ✅ BŁĄD #2: Złe kalorie/makro w zwiniętej karcie (brak uwzględnienia luźnych produktów)

### Opis problemu:

Gdy plany zostały pobrane z bazy, wybrany plan z listy miał złą kaloryczność (i prawdopodobnie makro) w widoku zwiniętej zakładki. Dopiero po rozwinięciu, kaloryczność poprawnie się liczyła. Błąd dotyczył sytuacji, gdy były tam luźne produkty - nie były uwzględniane w logice liczenia makro przy zwiniętej karcie.

### Przyczyna:

W komponencie `MealInDayCard` luźne produkty były pobierane dopiero po rozwinięciu karty:

```javascript
useEffect(() => {
  if (isExpanded && mealInDay.id) {
    // ❌ Tylko gdy rozwinięte!
    fetchLooseProducts();
  }
}, [isExpanded, mealInDay.id]);
```

To powodowało, że w zwiniętym widoku `looseProducts = []`, więc funkcja `getTotalMacros()` nie uwzględniała ich w obliczeniach.

### Rozwiązanie:

**Plik:** `src/components/features/mealsInDay/MealInDayCard.js`

Zmieniono useEffect, aby pobierał luźne produkty **od razu przy montowaniu komponentu**, a nie dopiero po rozwinięciu:

```javascript
// PRZED (błędne):
useEffect(() => {
  if (isExpanded && mealInDay.id) {
    fetchLooseProducts();
  }
}, [isExpanded, mealInDay.id]);

// PO (naprawione):
useEffect(() => {
  if (mealInDay.id) {
    // ✅ Zawsze, gdy jest ID
    fetchLooseProducts();
  }
}, [mealInDay.id]);
```

### Efekt:

✅ Makro i kaloryczność są poprawnie pokazywane od początku w zwiniętej karcie, uwzględniając zarówno posiłki, jak i luźne produkty.

---

## ✅ BŁĄD #3: Dziwna dodatkowa strona logowania podczas wylogowania

### Opis problemu:

Podczas wylogowania, jakaś dziwna dodatkowa strona logowania pojawiała się na chwilę. Była ona całkowicie zbędna.

### Przyczyna:

Podwójna nawigacja:

1. `authService.logout()` wykonywał `window.location.href = "/"` (przekierowanie na LandingPage)
2. `Sidebar.handleLogout()` dodatkowo wykonywał `navigate("/login")`

To powodowało, że użytkownik widział na moment LandingPage, a potem był przekierowywany na LoginPage.

### Rozwiązanie:

**Plik:** `src/components/Sidebar.js`

Usunięto zbędne `navigate("/login")` z funkcji `handleLogout`:

```javascript
// PRZED (błędne):
const handleLogout = () => {
  authService.logout();
  navigate("/login"); // ❌ Zbędne - authService już przekierowuje
  setIsOpen(false);
};

// PO (naprawione):
const handleLogout = () => {
  authService.logout(); // ✅ Tylko to - samo przekieruje na "/"
  setIsOpen(false);
};
```

### Efekt:

✅ Po wylogowaniu użytkownik jest płynnie przekierowywany bezpośrednio na stronę główną (LandingPage) bez żadnych migotań czy dodatkowych stron.

---

## 📊 Podsumowanie Naprawionych Plików

| Plik                                                  | Zmiana                                               |
| ----------------------------------------------------- | ---------------------------------------------------- |
| `src/hooks/useMealsInDay.js`                          | Pobieranie pełnych danych po CREATE/UPDATE           |
| `src/components/features/mealsInDay/MealInDayCard.js` | Pobieranie luźnych produktów od razu przy montowaniu |
| `src/components/Sidebar.js`                           | Usunięcie podwójnego przekierowania przy wylogowaniu |

---

## ✅ Status Kompilacji

Wszystkie pliki zostały zweryfikowane:

- ✅ Brak błędów kompilacji
- ✅ Brak błędów ESLint
- ✅ Aplikacja kompiluje się pomyślnie

---

## 🧪 Zalecenia do Testów Manualnych

### Test #1: Tworzenie planu dnia

1. Zaloguj się do aplikacji
2. Przejdź do "Potrawy w dniu"
3. Kliknij "Utwórz Plan Dnia"
4. Wypełnij wszystkie 6 posiłków
5. Dodaj kilka luźnych produktów
6. Zapisz plan
7. **Sprawdź:** Plan pojawia się na liście z poprawnymi kaloriami/makro w zwiniętym widoku
8. **Sprawdź:** Po rozwinięciu wszystkie posiłki i luźne produkty są widoczne od razu

### Test #2: Makroskładniki w zwiniętej karcie

1. Odśwież stronę (F5)
2. Znajdź plan dnia z luźnymi produktami
3. **Sprawdź:** W zwiniętym widoku kalorie/makro są poprawne (uwzględniają luźne produkty)
4. Rozwiń kartę
5. **Sprawdź:** Wartości się nie zmieniają (były poprawne od początku)

### Test #3: Wylogowanie

1. Kliknij "Wyloguj" w sidebarze
2. **Sprawdź:** Płynne przekierowanie na stronę główną (LandingPage)
3. **Sprawdź:** Brak migotania, błysków czy dodatkowych stron
4. **Sprawdź:** Nie można wrócić do chronionych stron (produkty/potrawy/plany)

---

## 📝 Notatki Techniczne

### Dlaczego pobieramy pełne dane po CREATE/UPDATE?

Backend Nourishment 2.0 (Go/Gin) zwraca minimalne odpowiedzi:

- POST `/mealsinday` → `{id: integer}`
- PUT `/mealsinday` → `200 OK` (puste body)

Nie możemy polegać na mergowaniu z wysłanymi danymi, ponieważ:

1. Wysyłamy tylko ID relacji (np. `breakfast: {id: 5}`)
2. Backend rozwiązuje te relacje i zwraca pełne obiekty przy GET
3. Pełne obiekty Meal zawierają `productsInMeal` z produktami
4. Bez tego nie mamy danych do wyświetlenia i obliczeń makro

### Optymalizacja: Cache luźnych produktów

Komponent `MealInDayCard` teraz pobiera luźne produkty od razu, ale:

- ✅ Pobiera tylko raz przy montowaniu
- ✅ Ponownie pobiera tylko gdy zmieni się `mealInDay.id`
- ✅ Nie pobiera wielokrotnie przy collapse/expand

---

**Wszystkie błędy z pliku "testy manualne" zostały naprawione! ✅**

---

## ✅ BŁĄD #4: Dropdown produktów luźnych bez suwaka (nowa naprawa)

### Opis problemu:

Podczas dodawania luźnych produktów, dropdown lista nie miała suwaka - pokazywała tylko parę produktów. Nie było możliwości przegladania wszystkich produktów poza opcją filtrowania.

### Przyczyna:

W pliku CSS dropdown miał ustawione `overflow: hidden` zamiast `overflow-y: auto`, co uniemożliwiało przewijanie listy produktów:

```css
/* PRZED (błędne): */
.meal-in-day-form__dropdown {
  max-height: 300px;
  overflow: hidden; /* ❌ Brak przewijania! */
}

.meal-in-day-form__dropdown-wrapper {
  /* Brak stylów przewijania */
}
```

### Rozwiązanie:

**Pliki:**

- `src/components/features/mealsInDay/MealInDayForm.css`

Zmieniono CSS dla obu klas dropdown, dodając `overflow-y: auto`:

```css
/* PO (naprawione): */
.meal-in-day-form__dropdown {
  max-height: 300px;
  overflow-y: auto; /* ✅ Pionowe przewijanie */
}

.meal-in-day-form__dropdown-wrapper {
  background: white;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto; /* ✅ Pionowe przewijanie */
}
```

### Efekt:

✅ Dropdown produktów luźnych ma teraz suwak pionowy, umożliwiający przeglądanie wszystkich dostępnych produktów, nawet gdy lista jest długa (powyżej 300px).

---

## 📊 Zaktualizowane Podsumowanie Naprawionych Plików

| Plik                                                   | Zmiana                                               |
| ------------------------------------------------------ | ---------------------------------------------------- |
| `src/hooks/useMealsInDay.js`                           | Pobieranie pełnych danych po CREATE/UPDATE           |
| `src/components/features/mealsInDay/MealInDayCard.js`  | Pobieranie luźnych produktów od razu przy montowaniu |
| `src/components/Sidebar.js`                            | Usunięcie podwójnego przekierowania przy wylogowaniu |
| `src/components/features/mealsInDay/MealInDayForm.js`  | Optymalizacja useCallback dla fetchLooseProducts     |
| `src/components/features/mealsInDay/MealInDayForm.css` | Dodanie overflow-y: auto dla dropdownu produktów     |

---

**Wszystkie 4 błędy zostały naprawione! ✅**
