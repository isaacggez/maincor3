// backend/src/routes/chamadoRoutes.js
const express = require("express");
const chamadoController = require("../controllers/chamadoController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Listar chamados de um equipamento específico
router.get("/equipamento/:equipamentoId", chamadoController.listar);

// Criar chamado em um equipamento
router.post("/equipamento/:equipamentoId", chamadoController.criar);

// Atualizar status (mantido)
router.put("/:id", chamadoController.atualizarStatus);

// Responder (adicionar resposta ao histórico) e opcionalmente mudar status
router.post("/:id/responder", chamadoController.responder);

// Editar chamados (categoria/descrição)
router.patch("/:id", chamadoController.editar);

// Histórico de um chamado
router.get("/:id/historico", chamadoController.historico);

// Deletar chamado
router.delete("/:id", chamadoController.deletar);

module.exports = router;
