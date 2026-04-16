# Nourishment — Frontend

Aplikacja webowa do zarządzania żywieniem. Umożliwia planowanie posiłków, śledzenie makroskładników i tworzenie list zakupów.

## Funkcjonalności

- **Produkty** — baza produktów spożywczych z pełnym opisem wartości odżywczych (białko, tłuszcze, węglowodany, błonnik) i kategoriami
- **Posiłki (przepisy)** — tworzenie przepisów z wybranych produktów, automatyczne obliczanie makroskładników
- **Dziennik posiłków** — planowanie co jesz danego dnia, podział na porcje, podsumowanie kalorii
- **Szybki kalkulator** — błyskawiczne przeliczanie makroskładników bez zapisywania posiłku
- **Lista zakupów** — generowanie list zakupów na podstawie zaplanowanych posiłków
- **Autoryzacja** — logowanie z tokenem JWT, automatyczne wylogowanie po wygaśnięciu sesji

## Technologie

- React 18
- React Router 6
- Axios
- CSS (BEM)

## Uruchomienie

```bash
# Instalacja zależności
npm install

# Start w trybie deweloperskim (port 3000)
npm start
```

Wymagane zmienne środowiskowe w pliku `.env`:

```
REACT_APP_API_URL=http://localhost:8080
```

## Struktura projektu

```
src/
├── components/
│   ├── common/          # Współdzielone komponenty (Toast, Sidebar, SearchBar...)
│   ├── features/        # Moduły funkcjonalne
│   │   ├── meals/       # Przepisy
│   │   ├── mealsInDay/  # Dziennik posiłków
│   │   ├── products/    # Produkty
│   │   ├── quickCalc/   # Szybki kalkulator
│   │   └── shoppingList/# Lista zakupów
│   └── layout/          # Layouty stron
├── hooks/               # Custom hooks
├── pages/               # Widoki stron
└── services/            # Komunikacja z API
```

## Powiązane repozytoria

- [Backend (Go)](../nourishment_20_backend) — REST API i logika biznesowa
