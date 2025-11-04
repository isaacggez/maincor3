const express = require('express');
const router = express.Router();
const Equipamento = require('../models/Equipamento');

// listar por local
router.get('/local/:id_local', async (req, res) => {
  try {
    const id_local = Number(req.params.id_local);
    if (!Number.isInteger(id_local) || id_local <= 0) {
      return res.status(400).json({ error: 'id_local inválido' });
    }
    const itens = await Equipamento.listarPorLocal(id_local);
    return res.json(itens || []);
  } catch (err) {
    console.error('Erro listar equipamentos:', err);
    return res.status(500).json({ error: 'Erro ao listar equipamentos' });
  }
});

// criar equipamento para local (rota com id no path)
router.post('/local/:id_local', async (req, res) => {
  try {
    const id_local = Number(req.params.id_local);
    const { nome, tipo, descricao, status } = req.body;
    if (!Number.isInteger(id_local) || id_local <= 0) {
      return res.status(400).json({ error: 'id_local inválido' });
    }
    if (!nome || !tipo) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });

    const insertId = await Equipamento.criar(id_local, nome, tipo, descricao || '', status || 'ativo');
    const created = await Equipamento.buscarPorId(insertId);
    return res.status(201).json(created);
  } catch (err) {
    console.error('Erro criar equipamento:', err);
    return res.status(500).json({ error: 'Erro ao criar equipamento' });
  }
});

// criar equipamento via POST /equipamentos com id_local no body
router.post('/', async (req, res) => {
  try {
    const { id_local, nome, tipo, descricao, status } = req.body;
    const idLocalNum = Number(id_local);
    if (!Number.isInteger(idLocalNum) || idLocalNum <= 0) {
      return res.status(400).json({ error: 'id_local inválido ou ausente no body' });
    }
    if (!nome || !tipo) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });

    const insertId = await Equipamento.criar(idLocalNum, nome, tipo, descricao || '', status || 'ativo');
    const created = await Equipamento.buscarPorId(insertId);
    return res.status(201).json(created);
  } catch (err) {
    console.error('Erro criar equipamento (root):', err);
    return res.status(500).json({ error: 'Erro ao criar equipamento' });
  }
});

// buscar por id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'id inválido' });
    }
    const item = await Equipamento.buscarPorId(id);
    if (!item) return res.status(404).json({ error: 'Equipamento não encontrado' });
    return res.json(item);
  } catch (err) {
    console.error('Erro buscar equipamento:', err);
    return res.status(500).json({ error: 'Erro ao buscar equipamento' });
  }
});

// atualizar (PUT)
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'id inválido' });
    }
    const dados = req.body; // nome, descricao, tipo, status, id_local, historico_descricao opcional
    const affected = await Equipamento.atualizar(id, dados);
    if (!affected) return res.status(404).json({ error: 'Equipamento não encontrado ou sem alterações' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Erro atualizar equipamento:', err);
    return res.status(500).json({ error: 'Erro ao atualizar equipamento' });
  }
});

// deletar
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'id inválido' });
    }
    const affected = await Equipamento.deletar(id);
    if (!affected) return res.status(404).json({ error: 'Equipamento não encontrado' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Erro deletar equipamento:', err);
    return res.status(500).json({ error: 'Erro ao deletar equipamento' });
  }
});

module.exports = router;