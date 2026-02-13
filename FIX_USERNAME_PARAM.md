# ✅ Naprawa parametru username

## ❌ Problem

Backend otrzymywał puste `username`:

```
QueryContext args=["","admin"]
User not found for username ''
401 Unauthorized
```

## 🔍 Diagnoza

### authService.js (przed naprawą):

```javascript
async login(email, password) {
  const response = await api.post("/login", {
    username: email,  // email był undefined!
    password
  });
}
```

### LandingPage.js wywołuje:

```javascript
await authService.login(formData.username, formData.password);
//                      ^^^^^^^^^^^^^^^^  przekazuje username
//                      ale funkcja oczekuje email!
```

**Konflikt nazw parametrów:**

- LandingPage przekazuje: `username` jako pierwszy argument
- authService oczekuje: `email` jako pierwszy parametr
- Rezultat: `email = formData.username`, ale potem `username: email` tworzy mapowanie gdzie `email` jest `undefined`

## ✅ Rozwiązanie

Zmiana nazwy parametru w `authService.js`:

```diff
- async login(email, password) {
+ async login(username, password) {
    const response = await api.post("/login", {
-     username: email,
+     username,
      password
    });
```

### Również w fallback endpoint:

```diff
  const altResponse = await api.post("/auth/login", {
-   username: email,
+   username,
    password
  });
```

## 🎯 Rezultat

### Teraz:

1. LandingPage: `authService.login(formData.username, formData.password)`
2. authService: `async login(username, password)`
3. Request body: `{ username: "ADMIN", password: "admin" }` ✅
4. Backend: Otrzymuje poprawne dane ✅

## 🧪 Test

Odśwież stronę w przeglądarce (Ctrl+R) i spróbuj zalogować się ponownie:

- Username: ADMIN
- Password: admin

Backend powinien teraz otrzymać:

```json
{
  "username": "ADMIN",
  "password": "admin"
}
```

I odpowiedzieć tokenem JWT! 🎉
