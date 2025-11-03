/// backend/src/models/Chamado.js
const db = require("../config/db");

const Chamado = {
  // Criar novo chamado
  async criar(id_equipamento, id_categoria, id_usuario_abertura, descricao) {
    const [resultado] = await db.execute(
      `INSERT INTO chamados 
        (id_equipamento, id_categoria, id_usuario_abertura, descricao) 
       VALUES (?, ?, ?, ?)`,
      [id_equipamento, id_categoria, id_usuario_abertura, descricao]
    );
    return resultado.insertId;
  },

  async buscarPorId(id_chamado) {
    const [linhas] = await db.execute(
      `SELECT c.*, 
              e.nome AS equipamento_nome, 
              cat.nome AS categoria_nome, 
              u.nome AS usuario_abertura 
       FROM chamados c
       JOIN equipamentos e ON c.id_equipamento = e.id_equipamento
       JOIN categorias_problemas cat ON c.id_categoria = cat.id_categoria
       JOIN usuarios u ON c.id_usuario_abertura = u.id_usuario
       WHERE c.id_chamado = ?`,
      [id_chamado]
    );
    return linhas[0];
  },

  async listarTodos() {
    const [linhas] = await db.execute(
      `SELECT c.*, 
              e.nome AS equipamento_nome, 
              cat.nome AS categoria_nome, 
              u.nome AS usuario_abertura 
       FROM chamados c
       JOIN equipamentos e ON c.id_equipamento = e.id_equipamento
       JOIN categorias_problemas cat ON c.id_categoria = cat.id_categoria
       JOIN usuarios u ON c.id_usuario_abertura = u.id_usuario
       ORDER BY c.data_abertura DESC`
    );
    return linhas;
  },

  async listarPorEquipamento(id_equipamento) {
    const [linhas] = await db.execute(
      `SELECT * FROM chamados WHERE id_equipamento = ? ORDER BY data_abertura DESC`,
      [id_equipamento]
    );
    return linhas;
  },

  async atualizarStatus(id_chamado, status) {
    const [resultado] = await db.execute(
      `UPDATE chamados SET status = ? WHERE id_chamado = ?`,
      [status, id_chamado]
    );
    return resultado.affectedRows > 0;
  },

  // editar campos do chamado (categoria/descricao)
  async editar(id_chamado, dados = {}) {
    const updates = [];
    const params = [];

    if (dados.id_categoria !== undefined) {
      updates.push("id_categoria = ?");
      params.push(dados.id_categoria);
    }
    if (dados.descricao !== undefined) {
      updates.push("descricao = ?");
      params.push(dados.descricao);
    }

    if (!updates.length) return false;

    params.push(id_chamado);
    const sql = `UPDATE chamados SET ${updates.join(", ")} WHERE id_chamado = ?`;
    const [resultado] = await db.execute(sql, params);
    return resultado.affectedRows > 0;
  },

  async deletar(id_chamado) {
    const [resultado] = await db.execute(
      `DELETE FROM chamados WHERE id_chamado = ?`,
      [id_chamado]
    );
    return resultado.affectedRows > 0;
  },
};

module.exports = Chamado;
