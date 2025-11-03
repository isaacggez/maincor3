// src/models/Equipamento.js
const db = require("../config/db");

const Equipamento = {
  async criar(id_local, nome, tipo, descricao, status) {
    const [result] = await db.execute(
      "INSERT INTO equipamentos (id_local, nome, tipo, descricao, status) VALUES (?, ?, ?, ?, ?)",
      [id_local, nome, tipo, descricao, status]
    );
    return result.insertId;
  },

  async listarPorLocal(id_local) {
    const [equipamentos] = await db.execute(
      "SELECT * FROM equipamentos WHERE id_local = ?",
      [id_local]
    );
    return equipamentos;
  },

  async buscarPorId(id) {
    const [rows] = await db.execute(
      "SELECT e.*, l.nome as local_nome FROM equipamentos e LEFT JOIN locais l ON e.id_local = l.id_local WHERE e.id_equipamento = ?",
      [id]
    );
    return rows[0];
  },

  // --- NOVAS FUNCOES ---
  // atualiza campos permitidos (nome, descricao, tipo, status, id_local opcional)
  async atualizar(id, dados) {
    // dados = { nome?, descricao?, tipo?, status?, id_local? }
    const campos = [];
    const valores = [];

    if (dados.nome !== undefined) { campos.push("nome = ?"); valores.push(dados.nome); }
    if (dados.descricao !== undefined) { campos.push("descricao = ?"); valores.push(dados.descricao); }
    if (dados.tipo !== undefined) { campos.push("tipo = ?"); valores.push(dados.tipo); }
    if (dados.status !== undefined) { campos.push("status = ?"); valores.push(dados.status); }
    if (dados.id_local !== undefined) { campos.push("id_local = ?"); valores.push(dados.id_local); }

    if (campos.length === 0) return 0;

    const sql = `UPDATE equipamentos SET ${campos.join(", ")}, ultima_atualizacao = NOW() WHERE id_equipamento = ?`;
    valores.push(id);

    const [result] = await db.execute(sql, valores);
    return result.affectedRows;
  },

  async deletar(id) {
    const [result] = await db.execute(
      "DELETE FROM equipamentos WHERE id_equipamento = ?",
      [id]
    );
    return result.affectedRows;
  },

  // registra histórico de alteração
  async criarHistorico({ id_equipamento, user_id = null, user_nome = null, descricao = "", detalhes_json = null }) {
    const sql = `INSERT INTO equipamento_historico (id_equipamento, user_id, user_nome, descricao, detalhes_json) VALUES (?, ?, ?, ?, ?);`;
    const detalhes = detalhes_json ? JSON.stringify(detalhes_json) : null;
    const [res] = await db.execute(sql, [id_equipamento, user_id, user_nome, descricao, detalhes]);
    return res.insertId;
  }
};

module.exports = Equipamento;
