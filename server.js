// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const db = require("./src/config/db"); // importa a pool do MySQL

if (!process.env.JWT_SECRET) {
  console.warn("⚠️  ATENÇÃO: JWT_SECRET não definido em .env — usar em produção!");
}

const app = express();

// Configuração básica do CORS
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://maincor3.vercel.app',
        'https://maincor3-7hvksownh-isaacggezs-projects.vercel.app', // Add this
        'https://*.vercel.app' // This will allow all Vercel subdomains
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
    maxAge: 86400 // Cache preflight requests for 24 hours
}));

// Add this right after CORS middleware
app.options('*', cors()); // Enable pre-flight for all routes

// ===== MIDDLEWARES =====
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ===== FUNÇÃO AUXILIAR PARA CARREGAR ROTAS =====
function tryRequire(pathRoute, name) {
  try {
    const mod = require(pathRoute);
    console.log(`✅ Rota carregada: ${name} -> ${pathRoute}`);
    return mod;
  } catch (err) {
    console.warn(`⚠️  Rota NÃO encontrada: ${name} (procure por ${pathRoute})`);
    return express.Router();
  }
}

// ===== CARREGAMENTO DAS ROTAS =====
const authRoutes = tryRequire("./src/routes/authRoutes", "authRoutes");
const usuarioRoutes = tryRequire("./src/routes/usuarioRoutes", "usuarioRoutes");
const organizacaoRoutes = tryRequire("./src/routes/organizacaoRoutes", "organizacaoRoutes");
const participacaoRoutes = tryRequire("./src/routes/participacaoRoutes", "participacaoRoutes");
const localRoutes = tryRequire("./src/routes/localRoutes", "localRoutes");
const equipamentoRoutes = tryRequire("./src/routes/equipamentoRoutes", "equipamentoRoutes");
const chamadoRoutes = tryRequire("./src/routes/chamadoRoutes", "chamadoRoutes");
const mensagensChamadoRoutes = tryRequire("./src/routes/mensagensChamado", "mensagensChamadoRoutes");
const mensagemPrivadaRoutes = tryRequire("./src/routes/mensagemPrivadaRoutes", "mensagemPrivadaRoutes");
const conviteRoutes = tryRequire("./src/routes/conviteRoutes", "conviteRoutes");
const categoriaRoutes = tryRequire("./src/routes/categoriaRoutes", "categoriaRoutes");

// ===== MONTAGEM DAS ROTAS =====
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/organizacoes", organizacaoRoutes);
app.use("/participacoes", participacaoRoutes);
app.use("/locais", localRoutes);
app.use("/equipamentos", equipamentoRoutes);
app.use("/chamados", chamadoRoutes);
app.use("/chamados/mensagens", mensagensChamadoRoutes);
app.use("/mensagens", mensagemPrivadaRoutes);
app.use("/convites", conviteRoutes);
app.use("/categorias", categoriaRoutes);

// ===== SERVIÇO DE ARQUIVOS ESTÁTICOS =====
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/avatars", express.static(path.join(__dirname, "public", "uploads", "avatars")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ===== HEALTH CHECK =====
app.get("/ping", (req, res) => res.json({ message: "pong", time: new Date().toISOString() }));

// ===== ROTA DE TESTE DO BANCO =====
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS now");
    res.json({ success: true, dbTime: rows[0].now });
  } catch (err) {
    console.error("❌ Erro no teste do banco:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== MIDDLEWARES DE ERRO / 404 =====
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);
  res.status(500).json({ message: "Erro interno do servidor" });
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app;
