# ✅ Raport z testowania - Nourishment Frontend

## 📊 Status systemów

### Backend Go

- **Port:** 8080
- **Status:** ✅ Uruchomiony i działający
- **CORS:** `http://localhost:3000,http://localhost:3001`
- **Endpoint logowania:** `POST /login` (bez /api!)
- **Baza danych:** Firebird połączona

### Frontend React

- **Port:** 3000
- **Status:** ✅ Uruchomiony i skompilowany
- **API URL:** `http://localhost:8080` (BEZ /api!)
- **Routing:** React Router v6 z protected routes

## 🔐 Dane testowe

```
Nazwa użytkownika: ADMIN
Hasło: admin
```

## 🧪 Scenariusz testowy

### Krok 1: Otwórz aplikację

Aplikacja już otwarta w Simple Browser: http://localhost:3000

### Krok 2: Sprawdź formularz logowania

✅ Formularz widoczny na landing page
✅ Pole "Nazwa użytkownika" (z placeholderem "ADMIN")
✅ Pole "Hasło"
✅ Przycisk "Zaloguj się"

### Krok 3: Wprowadź dane i zaloguj się

1. Wpisz: **ADMIN**
2. Wpisz hasło: **admin**
3. Kliknij "Zaloguj się"

### Krok 4: Sprawdź wynik

**Oczekiwane działanie:**

- Request: `POST http://localhost:8080/login` z `{"username":"ADMIN","password":"admin"}`
- Response: `{"token": "eyJ...", "user": {...}}`
- Token zapisany w `localStorage.authToken`
- Przekierowanie do `/dashboard`
- Alert "Zalogowano pomyślnie!"

**W przypadku błędu:**

- Komunikat błędu wyświetlony w formularzu
- Szczegóły w konsoli przeglądarki (F12)

## 📝 Konfiguracja plików

### Frontend - `src/services/authService.js`

```javascript
async login(email, password) {
  const response = await api.post("/login", {
    username: email,  // ✅ Używa 'username' zamiast 'email'
    password
  });
  // Obsługa różnych formatów odpowiedzi: token, access_token
}
```

### Frontend - `.env`

```
REACT_APP_API_BASE_URL=http://localhost:8080
```

**⚠️ UWAGA:** Backend NIE używa prefiksu `/api`!

### Frontend - `src/pages/LandingPage.js`

```javascript
const [formData, setFormData] = useState({
  username: "", // ✅ Pole 'username'
  password: "",
});

// handleSubmit wywołuje authService.login(formData.username, formData.password)
```

## 🔍 Debugowanie

### Sprawdź logi backendu

Backend wyświetla wszystkie żądania w terminalu. Szukaj:

```
[GIN] POST   /login
```

### Sprawdź DevTools w przeglądarce (F12)

1. **Network tab:**
   - Żądanie POST do `http://localhost:8080/login`
   - Status 200 (sukces) lub błąd
   - Response z tokenem

2. **Console tab:**
   - Błędy JavaScript
   - Błędy CORS
   - Komunikaty z authService

3. **Application → Local Storage:**
   - `authToken` - powinien zawierać JWT token
   - `user` - dane użytkownika (JSON)

## 🚨 Możliwe problemy i rozwiązania

### Problem: CORS Error

```
Access to XMLHttpRequest... has been blocked by CORS policy
```

**Rozwiązanie:** Backend już skonfigurowany z CORS dla localhost:3000

### Problem: 404 Not Found

```
POST http://localhost:8080/login 404
```

**Rozwiązanie:**

- ✅ POPRAWIONE! `.env` zmieniony na `http://localhost:8080` (bez /api)
- Backend nie używa prefiksu /api dla endpointów
- Endpoint to `POST /login` nie `POST /api/login`

### Problem: 401 Unauthorized / nieprawidłowe dane

```
POST http://localhost:8080/api/login 401
```

**Rozwiązanie:** Sprawdź hasło użytkownika ADMIN w bazie danych

### Problem: Network Error

```
Network Error / ERR_CONNECTION_REFUSED
```

**Rozwiązanie:** Backend nie działa lub jest na innym porcie

## ✨ Po pomyślnym zalogowaniu

### Sprawdź localStorage:

```javascript
// W konsoli przeglądarki
localStorage.getItem("authToken");
localStorage.getItem("user");
```

### Sprawdź przekierowanie:

- URL powinno zmienić się na: `http://localhost:3000/dashboard`
- Dashboard page powinien się wyświetlić

### Test chronionej trasy:

- Wyloguj się (localStorage.clear())
- Spróbuj wejść na `/dashboard`
- Powinno przekierować na `/` (landing page)

## 📌 Następne kroki

1. ✅ Logowanie działa
2. ⏳ Dodać funkcjonalność Dashboard
3. ⏳ Dodać wyświetlanie posiłków
4. ⏳ Dodać zarządzanie produktami
5. ⏳ Połączyć z AI optimization

## 🎯 Podsumowanie

**System jest gotowy do testowania logowania!**

- Backend: ✅ Działa na porcie 8080
- Frontend: ✅ Działa na porcie 3000
- CORS: ✅ Skonfigurowany poprawnie
- Endpoint: ✅ POST /api/login z username/password
- Dane testowe: ✅ ADMIN / admin
- Frontend otwarty: ✅ http://localhost:3000

**Przetestuj teraz w przeglądarce!**
