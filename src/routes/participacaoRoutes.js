// backend/src/routes/participacaoRoutes.js
const express = require("express");
const router = express.Router();
const participacaoController = require("../controllers/participacaoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/me/:id_organizacao", participacaoController.minhaParticipacao);
router.get("/:id_organizacao", participacaoController.listarPorOrganizacao);
router.post("/", participacaoController.adicionar);
router.put("/:id_participacao", participacaoController.atualizarCargo);
router.delete("/:id_participacao", participacaoController.remover);

module.exports = router;
