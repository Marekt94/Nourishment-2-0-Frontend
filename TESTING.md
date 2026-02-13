# Instrukcja testowania aplikacji

## Konfiguracja

### Backend Go

**Lokalizacja:** `C:\Repo\nourishment_20`
**Port:** 8080
**Status:** ✅ Uruchomiony
**CORS:** MUSI zawierać `http://localhost:3001` (lub port frontendu)

### Frontend React

**Lokalizacja:** `C:\Repo\nourishment_20_frontend`
**Port:** 3001 (jeśli 3000 jest zajęty)
**API URL:** `http://localhost:8080/api`

## ⚠️ WAŻNE - Konfiguracja CORS

Backend MUSI być uruchomiony z poprawną konfiguracją CORS!

### Opcja 1: Użyj skryptu pomocniczego

```powershell
cd C:\Repo\nourishment_20_frontend
.\restart-backend-with-cors.ps1
```

### Opcja 2: Ręczny restart z CORS

```powershell
# Zatrzymaj obecny backend (Ctrl+C w terminalu Go)

cd C:\Repo\nourishment_20
$env:CORS_ALLOW_ORIGINS_LIST = "http://localhost:3001,http://localhost:3000,http://www.localhost:8080"
go run cmd/nourishment/main.go
```

### Opcja 3: Edytuj plik .env (wymaga restartu)

Edytuj plik `C:\Repo\nourishment_20\.env`:

```env
CORS_ALLOW_ORIGINS_LIST="http://localhost:3000,http://www.localhost:8080"
```

Następnie zrestartuj backend:

```powershell
cd C:\Repo\nourishment_20
go run cmd/nourishment/main.go
```

## Dane testowe

### Użytkownik ADMIN

```
Username: ADMIN
Password: admin
```

### Użytkownik READER

```
Username: READER
Password: (sprawdź w bazie danych)
```

## Endpoint logowania

```
POST http://localhost:8080/api/login
Content-Type: application/json

{
  "username": "ADMIN",
  "password": "admin"
}
```

### Przykładowa odpowiedź

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "ADMIN"
  }
}
```

## Testowanie

### 1. Test API bezpośrednio (PowerShell)

```powershell
$body = '{"username":"ADMIN","password":"admin"}'
$headers = @{"Content-Type"="application/json"}
Invoke-WebRequest -Uri "http://localhost:8080/api/login" -Method POST -Body $body -Headers $headers -UseBasicParsing
```

### 2. Test przez frontend

1. Otwórz http://localhost:3000
2. Wpisz:
   - **Nazwa użytkownika:** ADMIN
   - **Hasło:** admin
3. Kliknij "Zaloguj się"
4. Sprawdź:
   - Token w `localStorage.authToken`
   - Przekierowanie do `/dashboard`
   - Komunikat sukcesu

### 3. Sprawdzenie localStorage

Otwórz DevTools (F12) → Application → Local Storage → http://localhost:3000

- `authToken`: JWT token
- `user`: Dane użytkownika (JSON)

## Rozwiązywanie problemów

### CORS Error

```
Access to XMLHttpRequest at 'http://localhost:8080/api/login' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Rozwiązanie:** Zaktualizuj `CORS_ALLOW_ORIGINS_LIST` w pliku `.env` backendu i zrestartuj backend.

### 401 Unauthorized

- Sprawdź, czy hasło jest poprawne
- Sprawdź logi backendu w terminalu

### 404 Not Found

- Upewnij się, że backend działa na porcie 8080
- Sprawdź endpoint: `http://localhost:8080/api/login`

### Network Error

- Sprawdź, czy backend jest uruchomiony
- Sprawdź, czy port 8080 jest otwarty
- Sprawdź konfigurację w `.env`: `REACT_APP_API_BASE_URL=http://localhost:8080/api`

## API Endpoints (Backend Go)

```
POST   /login                    - Logowanie
GET    /meals                    - Lista posiłków
GET    /meals/:id                - Szczegóły posiłku
POST   /meals                    - Tworzenie posiłku
PUT    /meals                    - Aktualizacja posiłku
DELETE /meals/:id                - Usuwanie posiłku
GET    /products                 - Lista produktów
GET    /products/:id             - Szczegóły produktu
POST   /products                 - Tworzenie produktu
PUT    /products                 - Aktualizacja produktu
DELETE /products/:id             - Usuwanie produktu
GET    /categories               - Lista kategorii
GET    /mealsinday               - Posiłki w dniu
GET    /looseproductsinday       - Produkty w dniu
POST   /optimizemeal             - Optymalizacja posiłku (AI)
```

Wszystkie endpointy (oprócz `/login`) wymagają nagłówka:

```
Authorization: Bearer <token>
```
