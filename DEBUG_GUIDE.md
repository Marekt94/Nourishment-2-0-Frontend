# 🔍 Debug Guide - Puste username w backendzie

## ❌ Problem

Backend nadal otrzymuje puste `username`:

```
User not found for username ''
401 Unauthorized
```

## ✅ Zmiany wprowadzone

1. ✅ `authService.js` - parametr zmieniony na `username`
2. ✅ Frontend skompilowany poprawnie
3. ✅ Hot Module Replacement działał
4. ❌ Ale backend nadal otrzymuje puste pole

## 🔍 Dodane logi debugowania

### W authService.js:

```javascript
console.log("🔍 authService.login called with:", { username, password: "***" });
console.log("📤 Sending request to /login:", { username, password: "***" });
```

### W LandingPage.js:

```javascript
console.log("🔍 LandingPage handleSubmit - formData:", formData);
console.log("📤 Calling authService.login with:", { username, password: "***" });
```

## 🧪 Kroki debugowania

### 1. Hard Refresh w przeglądarce

**WAŻNE!** Cache przeglądarki może używać starej wersji kodu!

**Windows:**

- Chrome/Edge: `Ctrl + Shift + R` lub `Ctrl + F5`
- Firefox: `Ctrl + Shift + R`

**Alternatywnie:**

1. Otwórz DevTools (F12)
2. Kliknij prawym na ikonę odświeżenia
3. Wybierz "Empty Cache and Hard Reload"

### 2. Sprawdź Console (F12)

Po kliknięciu "Zaloguj się" powinieneś zobaczyć:

```
🔍 LandingPage handleSubmit - formData: { username: "ADMIN", password: "admin" }
📤 Calling authService.login with: { username: "ADMIN", password: "***" }
🔍 authService.login called with: { username: "ADMIN", password: "***" }
📤 Sending request to /login: { username: "ADMIN", password: "***" }
```

### 3. Sprawdź Network tab (F12)

1. Otwórz zakładkę **Network**
2. Kliknij "Zaloguj się"
3. Znajdź żądanie **`login`**
4. Kliknij na nie
5. Sprawdź zakładkę **Payload** lub **Request Payload**

**Powinno być:**

```json
{
  "username": "ADMIN",
  "password": "admin"
}
```

**Jeśli jest puste:**

```json
{
  "username": "",
  "password": "admin"
}
```

To znaczy, że formularz nie przechowuje danych poprawnie!

## 🔧 Możliwe rozwiązania

### A. Cache przeglądarki

```
Ctrl + Shift + R (Hard Refresh)
```

### B. Wyczyść localStorage i sessionStorage

Otwórz Console (F12) i wpisz:

```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### C. Restart przeglądarki

Zamknij całkowicie przeglądarkę i otwórz ponownie

### D. Sprawdź Service Workers

1. DevTools (F12) → Application
2. Service Workers
3. Jeśli jakiś jest zarejestrowany: kliknij "Unregister"
4. Odśwież stronę

### E. Użyj trybu incognito

Otwórz `http://localhost:3000` w trybie incognito/prywatnym

- Pomija cache
- Pomija rozszerzenia
- Czyste środowisko

## 📊 Analiza logów console

### Scenariusz 1: Logi pokazują poprawne dane

```
username: "ADMIN" ✅
```

**Problem:** Request jest modyfikowany po console.log (mało prawdopodobne) lub interceptor Axios

### Scenariusz 2: Logi pokazują puste dane

```
username: "" ❌
```

**Problem:** Formularz nie zapisuje danych do `formData.username`

**Sprawdź:**

- Czy pole input ma `name="username"`
- Czy `handleChange` jest podpięty
- Czy `value={formData.username}` jest ustawiony

### Scenariusz 3: Brak logów w ogóle

**Problem:** Stara wersja kodu z cache

**Rozwiązanie:** Hard refresh (Ctrl+Shift+R)

## 🎯 Test step-by-step

1. ✅ Otwórz DevTools (F12)
2. ✅ Przejdź do zakładki Console
3. ✅ Hard refresh: `Ctrl + Shift + R`
4. ✅ Wpisz w pole: ADMIN
5. ✅ Wpisz hasło: admin
6. ✅ Kliknij "Zaloguj się"
7. 📋 Sprawdź logi w Console
8. 📋 Sprawdź Network → login → Payload

## 💡 Quick Check

Otwórz Console (F12) i wpisz:

```javascript
// Sprawdź wersję kodu
console.log("Check authService:", authService.login.toString().substring(0, 100));
```

Powinno zawierać `username` jako parametr, nie `email`!

## 📞 Następne kroki

Po przeprowadzeniu debugowania wklej tutaj:

1. Logi z Console (🔍 i 📤 linie)
2. Payload z Network tab
3. Komunikat o błędzie (jeśli jest)

To pomoże dokładnie zdiagnozować problem!
