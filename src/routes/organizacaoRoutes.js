// backend/src/routes/organizacaoRoutes.js
const express = require("express");
const router = express.Router();
const organizacaoController = require("../controllers/organizacaoController");
const authMiddleware = require("../middlewares/authMiddleware");

// Criar organização
router.post("/", authMiddleware, organizacaoController.criar);

// Listar organizações do usuário logado
router.get("/", authMiddleware, organizacaoController.listarPorUsuario);

// Buscar organização por ID
router.get("/:id", authMiddleware, organizacaoController.buscarPorId);

// Atualizar organização
router.put("/:id", authMiddleware, organizacaoController.atualizar);

// Deletar organização
router.delete("/:id", authMiddleware, organizacaoController.deletar);

module.exports = router;
