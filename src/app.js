const express = require("express");
const cors = require("cors");

// Rotas
const authRoutes = require("./routes/authRoutes");
const localRoutes = require("./routes/localRoutes");
const equipamentoRoutes = require("./routes/equipamentoRoutes");
const chamadoRoutes = require("./routes/chamadoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes"); // NOVO

// Middleware de autenticação
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

// middlewares globais
app.use(cors());
app.use(express.json());

// rotas públicas
app.use("/auth", authRoutes);

// rotas protegidas
app.use("/locais", authMiddleware, localRoutes);

// temporariamente para testes sem token:
app.use("/equipamentos", equipamentoRoutes); // <-- usar sem auth só em dev
// depois volte para:
// app.use("/equipamentos", authMiddleware, equipamentoRoutes);

app.use("/chamados", authMiddleware, chamadoRoutes);
app.use("/categorias", authMiddleware, categoriaRoutes); // NOVO

// rota de teste
app.get("/ping", (req, res) => {
  res.json({ message: "Backend está vivo! 🟢" });
});

module.exports = app;
