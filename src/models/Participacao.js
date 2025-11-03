const db = require("../config/db");

const Participacao = {
  async listarPorOrganizacao(id_organizacao) {
    const [linhas] = await db.execute(
      `SELECT p.id_participacao, p.id_usuario, p.id_organizacao, p.cargo, p.data_entrada,
              u.nome AS usuario_nome, u.email AS usuario_email, u.avatar AS usuario_avatar
       FROM participacoes p
       JOIN usuarios u ON p.id_usuario = u.id_usuario
       WHERE p.id_organizacao = ?
       ORDER BY p.data_entrada DESC`,
      [id_organizacao]
    );
    return linhas;
  },

  async buscarPorUsuarioEOrganizacao(id_usuario, id_organizacao) {
    const [linhas] = await db.execute(
      "SELECT * FROM participacoes WHERE id_usuario = ? AND id_organizacao = ?",
      [id_usuario, id_organizacao]
    );
    return linhas[0];
  },

  async adicionar(id_usuario, id_organizacao, cargo) {
    const [resultado] = await db.execute(
      "INSERT INTO participacoes (id_usuario, id_organizacao, cargo) VALUES (?, ?, ?)",
      [id_usuario, id_organizacao, cargo]
    );
    return resultado.insertId;
  },

  async atualizarCargo(id_participacao, cargo) {
    const [resultado] = await db.execute(
      "UPDATE participacoes SET cargo = ? WHERE id_participacao = ?",
      [cargo, id_participacao]
    );
    return resultado.affectedRows > 0;
  },

  async remover(id_participacao) {
    const [resultado] = await db.execute(
      "DELETE FROM participacoes WHERE id_participacao = ?",
      [id_participacao]
    );
    return resultado.affectedRows > 0;
  }
};

module.exports = Participacao;
