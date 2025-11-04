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

// Serve static files before routes
app.use(express.static(path.join(__dirname, 'public')));

// Route handlers
const authRoutes = require("./src/routes/authRoutes");
const organizacaoRoutes = require("./src/routes/organizacaoRoutes");
const categoriaRoutes = require("./src/routes/categoriaRoutes");
const localRoutes = require("./src/routes/localRoutes");
const equipamentoRoutes = require("./src/routes/equipamentoRoutes");
const chamadoRoutes = require("./src/routes/chamadoRoutes");

app.use("/auth", authRoutes);
app.use("/organizacoes", organizacaoRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/locais", localRoutes);
app.use("/equipamentos", equipamentoRoutes);
app.use("/chamados", chamadoRoutes);

// Handle HTML routes explicitly
app.get('/:page.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${req.params.page}.html`));
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
