// backend/src/models/Convite.js
const db = require("../config/db");

const Convite = {
  // Criar convite
  async criar(id_organizacao, email_convidado, id_usuario_convidado = null) {
    const [resultado] = await db.execute(
      `INSERT INTO convites (id_organizacao, email_convidado, id_usuario_convidado) 
       VALUES (?, ?, ?)`,
      [id_organizacao, email_convidado, id_usuario_convidado]
    );
    return resultado.insertId;
  },

  // Buscar convite por ID
  async buscarPorId(id_convite) {
    const [linhas] = await db.execute(
      "SELECT * FROM convites WHERE id_convite = ?",
      [id_convite]
    );
    return linhas[0];
  },

  // Listar convites de uma organização
  async listarPorOrganizacao(id_organizacao) {
    const [linhas] = await db.execute(
      "SELECT * FROM convites WHERE id_organizacao = ?",
      [id_organizacao]
    );
    return linhas;
  },

  // Atualizar status do convite
  async atualizarStatus(id_convite, status) {
    const [resultado] = await db.execute(
      "UPDATE convites SET status = ?, data_resposta = NOW() WHERE id_convite = ?",
      [status, id_convite]
    );
    return resultado.affectedRows > 0;
  },

  // Deletar convite
  async deletar(id_convite) {
    const [resultado] = await db.execute(
      "DELETE FROM convites WHERE id_convite = ?",
      [id_convite]
    );
    return resultado.affectedRows > 0;
  },
};

module.exports = Convite;
