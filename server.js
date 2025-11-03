// backend/server.js
// Arquivo principal do servidor - monta middlewares, rotas e arquivos estáticos.
// Mantive a estrutura original e acrescentei comentários e pequenas melhorias
// para suportar avatares, health-check, carregamento seguro de rotas e mensagens.

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // carrega .env -> certifique-se de ter JWT_SECRET definido

// alerta útil se JWT_SECRET não estiver setado (ajuda em dev)
if (!process.env.JWT_SECRET) {
  console.warn("⚠️  ATENÇÃO: JWT_SECRET não definido em .env — usar em produção!");
}

const app = express();

// ===== MIDDLEWARES =====
// CORS e parsers de body (JSON e urlencoded). Mantive o limite maior para uploads leves.
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ===== FUNÇÃO AUXILIAR PARA CARREGAR ROTAS DE FORMA RESILIENTE =====
function tryRequire(pathRoute, name) {
  try {
    const mod = require(pathRoute);
    console.log(`✅ Rota carregada: ${name} -> ${pathRoute}`);
    return mod;
  } catch (err) {
    console.warn(`⚠️  Rota NÃO encontrada: ${name} (procure por ${pathRoute})`);
    return express.Router(); // retorna router vazio para não quebrar app
  }
}

// ===== CARREGAMENTO DAS ROTAS (use tryRequire para não quebrar se arquivos faltarem) =====
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
// Rotas públicas / auth
app.use("/auth", authRoutes);

// Rotas que usam autenticação — os próprios routers devem aplicar authMiddleware quando necessário
app.use("/usuarios", usuarioRoutes);
app.use("/organizacoes", organizacaoRoutes);
app.use("/participacoes", participacaoRoutes);
app.use("/locais", localRoutes);
app.use("/equipamentos", equipamentoRoutes);
app.use("/chamados", chamadoRoutes);
app.use("/chamados/mensagens", mensagensChamadoRoutes);
app.use("/mensagens", mensagemPrivadaRoutes); // rota para mensagens privadas
app.use("/convites", conviteRoutes);
app.use("/categorias", categoriaRoutes);

// ===== SERVIÇO DE ARQUIVOS ESTÁTICOS FRONTEND E UPLOADS =====
// Serve arquivos do frontend (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, "frontend")));

// Serve arquivos de avatar (uploads) em /avatars/<filename>
// Certifique-se de criar a pasta: d:\backend\public\uploads\avatars e colocar default-avatar.png
app.use("/avatars", express.static(path.join(__dirname, "public", "uploads", "avatars")));

// fallback para o index.html (dashboard) quando acessar raiz via browser
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ===== HEALTH CHECK =====
app.get("/ping", (req, res) => res.json({ message: "pong", time: new Date().toISOString() }));

// ===== MIDDLEWARES DE ERRO / 404 =====
// rota não encontrada (colocar antes do handler de erro genérico)
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// handler global de erros — loga e retorna 500
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);
  // retorno genérico para o cliente; detalhes ficam no log
  res.status(500).json({ message: "Erro interno do servidor" });
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
