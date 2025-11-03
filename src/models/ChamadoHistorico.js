const db = require("../config/db");

const ChamadoHistorico = {
  async criar(id_chamado, id_usuario, acao, descricao) {
    const [resultado] = await db.execute(
      `INSERT INTO chamados_historico (id_chamado, id_usuario, acao, descricao, data_registro)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [id_chamado, id_usuario, acao, descricao || null]
    );
    return resultado.insertId;
  },

  async listarPorChamado(id_chamado) {
    const [linhas] = await db.execute(
      `SELECT h.*, u.nome AS autor
       FROM chamados_historico h
       LEFT JOIN usuarios u ON h.id_usuario = u.id_usuario
       WHERE h.id_chamado = ?
       ORDER BY h.data_registro DESC`,
      [id_chamado]
    );
    return linhas;
  }
};

module.exports = ChamadoHistorico;