const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoriaController");

// GET /categorias -> lista todas
router.get("/", categoriaController.listar);

// GET /categorias/:id -> busca por ID
router.get("/:id", categoriaController.buscarPorId);

module.exports = router;
