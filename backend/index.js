const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    'http://localhost:3000'
  ],
  credentials: true
}));
// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging personalizado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const token = req.headers.authorization ? req.headers.authorization.substring(0, 20) + '...' : 'No token';
  console.log(`[${timestamp}] ${req.method} ${req.path} - Token: ${token}`);
  next();
});

// Basic route
app.get("/", (req, res) => {
  res.json({ 
    message: "Backend Node.js funcionando 🚀",
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Sistema de Inventario Cloud API funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.use("/auth", require("./src/routes.auth"));

// Cloud routes
app.use("/cloud", require("./src/routes.cloud"));

// Profile routes
app.use("/profiles", require("./src/routes.profiles"));

// 404 handler - debe estar al final de todas las rutas
app.use((req, res) => {
  res.status(404).json({ 
    error: "Endpoint no encontrado",
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({ 
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
