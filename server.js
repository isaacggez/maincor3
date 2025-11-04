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

// Serve static files BEFORE route handlers
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

// Debug: log todas as requisições
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// Debug: rota temporária para listar rotas (retorna array simples)
app.get('/_routes', (req, res) => {
  try {
    const routes = [];
    app._router.stack.forEach(mw => {
      if (mw.route && mw.route.path) {
        const methods = Object.keys(mw.route.methods).join(',').toUpperCase();
        routes.push({ path: mw.route.path, methods });
      } else if (mw.name === 'router' && mw.handle && mw.regexp) {
        // router mounted; attempt to extract mount path
        routes.push({ router: mw.regexp.toString() });
      }
    });
    res.json(routes);
  } catch (err) {
    console.error('Erro listando rotas:', err);
    res.status(500).json({ error: 'Erro listando rotas' });
  }
});

// 404 handler - retorna JSON quando cliente aceita JSON
app.use((req, res, next) => {
  res.status(404);
  if (req.accepts('json')) return res.json({ message: 'Not Found' });
  if (req.accepts('html')) return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  return res.type('txt').send('Not Found');
});

// Error handler - sempre JSON quando aplicável
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500);
  if (req.accepts('json')) return res.json({ message: err.message || 'Internal Server Error' });
  if (req.accepts('html')) return res.send(`<pre>${err.stack}</pre>`);
  return res.type('txt').send(err.message || 'Internal Server Error');
});

module.exports = app;
