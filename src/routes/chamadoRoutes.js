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

// Criar chamado em um equipamento
router.post("/", async (req, res) => {
  console.log('[REQ] POST /chamados headers:', req.headers);
  console.log('[REQ] POST /chamados raw body (type):', typeof req.body, req.body);
  try {
    // aceita body = number (ex: 27), body = "27", ou body = { id_equipamento, ... }
    let id_equipamento;
    if (typeof req.body === 'number') {
      id_equipamento = req.body;
    } else if (typeof req.body === 'string' && /^\d+$/.test(req.body.trim())) {
      id_equipamento = Number(req.body.trim());
    } else if (req.body && typeof req.body === 'object') {
      id_equipamento =
        req.body.id_equipamento ||
        req.body.equipamentoId ||
        (req.body.equipamento && (req.body.equipamento.id || req.body.equipamento.id_equipamento)) ||
        undefined;
    }

    id_equipamento = Number(id_equipamento);

    const { titulo, descricao, prioridade } = (typeof req.body === 'object') ? req.body : {};

    // validações mínimas
    if (!Number.isInteger(id_equipamento) || id_equipamento <= 0) {
      return res.status(400).json({ message: 'id_equipamento inválido ou ausente' });
    }
    if (!descricao || String(descricao).trim() === '') {
      return res.status(400).json({ message: 'descricao é obrigatória' });
    }

    const created = await chamadoController.create({
      id_equipamento,
      titulo: titulo || null,
      descricao,
      prioridade: prioridade || 'media'
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error('Erro POST /chamados:', err);
    const status = err.status || 500;
    const message = err.message || 'Erro ao criar chamado';
    const detail = err.sqlMessage || err.detail || undefined;
    return res.status(status).json({ message, detail });
  }
});

module.exports = router;
