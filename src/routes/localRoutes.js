// backend/src/routes/localRoutes.js
const express = require("express");
const localController = require("../controllers/localController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// aplica autenticação em todas rotas deste router
router.use(authMiddleware);

// Listar locais de uma organização
router.get("/organizacao/:id_organizacao", localController.listar);

// Criar local dentro de uma organização
router.post("/:id_organizacao", localController.criar);

// Atualizar local
router.put("/:id", localController.atualizar);

// Deletar local
router.delete("/:id", localController.deletar);

module.exports = router;
