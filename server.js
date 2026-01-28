/**
 * Simple Mock Backend Server for Testing
 * Run with: node server.js
 */
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3001;
const SECRET_KEY = "test-secret-key-12345";

// Middleware
app.use(cors());
app.use(express.json());

// Mock users database
const users = [
  {
    id: 1,
    email: "test@example.com",
    password: "password123",
    name: "Test User",
    role: "user",
  },
  {
    id: 2,
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
];

// Mock meals database
let meals = [
  {
    id: 1,
    name: "Śniadanie",
    calories: 450,
    protein: 20,
    carbs: 50,
    fat: 15,
    date: new Date().toISOString(),
    userId: 1,
  },
  {
    id: 2,
    name: "Obiad",
    calories: 750,
    protein: 40,
    carbs: 80,
    fat: 25,
    date: new Date().toISOString(),
    userId: 1,
  },
];

// Login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", { email, password });

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: "24h" },
  );

  console.log("Login successful for:", user.email);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Get all meals (protected)
app.get("/api/meals", authenticateToken, (req, res) => {
  const userMeals = meals.filter((m) => m.userId === req.user.id);
  res.json(userMeals);
});

// Create meal (protected)
app.post("/api/meals", authenticateToken, (req, res) => {
  const newMeal = {
    id: meals.length + 1,
    ...req.body,
    userId: req.user.id,
    date: new Date().toISOString(),
  };
  meals.push(newMeal);
  res.status(201).json(newMeal);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Mock backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Mock Backend Server running on http://localhost:${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  console.log(`\n👤 Test Credentials:`);
  console.log(`   Email: test@example.com`);
  console.log(`   Password: password123`);
  console.log(`\n   Email: admin@example.com`);
  console.log(`   Password: admin123\n`);
});
