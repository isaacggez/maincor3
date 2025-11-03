const express = require('express');
const router = express.Router();
const Equipamento = require('../models/Equipamento');

// listar por local
router.get('/local/:id_local', async (req, res) => {
  try {
    const id_local = req.params.id_local;
    const itens = await Equipamento.listarPorLocal(id_local);
    return res.json(itens);
  } catch (err) {
    console.error('Erro listar equipamentos:', err);
    return res.status(500).json({ error: 'Erro ao listar equipamentos' });
  }
});

// criar equipamento para local
router.post('/local/:id_local', async (req, res) => {
  try {
    const id_local = req.params.id_local;
    const { nome, tipo, descricao, status } = req.body;
    if (!nome || !tipo) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    const insertId = await Equipamento.criar(id_local, nome, tipo, descricao || '', status || 'ativo');
    const created = await Equipamento.buscarPorId(insertId);
    return res.status(201).json(created);
  } catch (err) {
    console.error('Erro criar equipamento:', err);
    return res.status(500).json({ error: 'Erro ao criar equipamento' });
  }
});

// buscar por id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
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
    const id = req.params.id;
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
    const id = req.params.id;
    const affected = await Equipamento.deletar(id);
    if (!affected) return res.status(404).json({ error: 'Equipamento não encontrado' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Erro deletar equipamento:', err);
    return res.status(500).json({ error: 'Erro ao deletar equipamento' });
  }
});

module.exports = router;