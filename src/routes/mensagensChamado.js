// backend/src/routes/mensagensChamado.js
const express = require("express");
const router = express.Router();
const mensagemChamadoController = require("../controllers/mensagemChamadoController");
const authMiddleware = require("../middlewares/authMiddleware");

// Criar mensagem em um chamado
router.post("/", authMiddleware, mensagemChamadoController.criar);

// Listar mensagens de um chamado
router.get("/:id_chamado", authMiddleware, mensagemChamadoController.listarPorChamado);

module.exports = router;
