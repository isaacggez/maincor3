// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const db = require("./src/config/db");

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://maincor3.vercel.app',
        'https://maincor3-7hvksownh-isaacggezs-projects.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// Route handlers
const authRoutes = require("./src/routes/authRoutes");
const organizacaoRoutes = require("./src/routes/organizacaoRoutes");
const categoriaRoutes = require("./src/routes/categoriaRoutes");

app.use("/auth", authRoutes);
app.use("/organizacoes", organizacaoRoutes);
app.use("/categorias", categoriaRoutes);

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
