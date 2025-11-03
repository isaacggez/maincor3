// backend/src/routes/conviteRoutes.js
const express = require("express");
const router = express.Router();
const conviteController = require("../controllers/conviteController");
const authMiddleware = require("../middlewares/authMiddleware");

// Criar convite
router.post("/", authMiddleware, conviteController.criar);

// Buscar convite por ID
router.get("/:id", authMiddleware, conviteController.buscarPorId);

// Listar convites de uma organização
router.get("/organizacao/:id_organizacao", authMiddleware, conviteController.listarPorOrganizacao);

// Atualizar status de um convite
router.put("/:id/status", authMiddleware, conviteController.atualizarStatus);

// Deletar convite
router.delete("/:id", authMiddleware, conviteController.deletar);

module.exports = router;
