# Nourishment Frontend

Nowoczesna aplikacja do zarządzania żywieniem zbudowana z React 18+ i JavaScript.

## 🚀 Technologie

- React 18+
- React Router DOM
- Axios
- Plain CSS (BEM methodology)

## 📦 Instalacja

```bash
npm install
```

## 🏃 Uruchomienie

```bash
npm start
```

Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

## 🔧 Konfiguracja

Utwórz plik `.env` w głównym katalogu projektu:

```
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

## 📁 Struktura projektu

```
src/
├── components/     # Komponenty UI
├── pages/          # Strony aplikacji
│   ├── LandingPage.js
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   └── DashboardPage.js
├── services/       # Serwisy (API, auth)
│   ├── api.js
│   └── authService.js
├── hooks/          # Custom hooks
├── utils/          # Funkcje pomocnicze
├── constants/      # Stałe
└── assets/         # Zasoby statyczne
```

## 🔐 Autentykacja

Aplikacja używa JWT tokenów do autentykacji:

- Token przechowywany w localStorage jako `authToken`
- Header: `Authorization: Bearer <token>`
- Automatyczne przekierowanie do logowania przy błędzie 401

## 📱 Features

- ✅ Nowoczesna Landing Page
- ✅ Strona logowania z walidacją
- ✅ Protected routes
- ✅ JWT Authentication
- ✅ Responsive design
- ⏳ Dashboard (w budowie)
- ⏳ Zarządzanie posiłkami (w budowie)

## 🎨 Design

Aplikacja używa:

- Gradient backgrounds
- Glassmorphism effects
- Smooth animations
- Modern shadows
- BEM CSS methodology

## 🔗 Backend

Backend repository: https://github.com/Marekt94/Nourishment-2-0.git
Local path: `/c:/Repo/nourishment_20/`

## 📄 License

MIT
