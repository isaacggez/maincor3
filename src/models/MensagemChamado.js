// backend/src/models/MensagemChamado.js
const db = require("../config/db");

const MensagemChamado = {
  // Criar nova mensagem vinculada a um chamado
  async criar(id_chamado, id_usuario, conteudo) {
    const [resultado] = await db.execute(
      "INSERT INTO mensagens_chamado (id_chamado, id_usuario, conteudo) VALUES (?, ?, ?)",
      [id_chamado, id_usuario, conteudo]
    );
    return resultado.insertId;
  },

  // Listar todas mensagens de um chamado
  async listarPorChamado(id_chamado) {
    const [linhas] = await db.execute(
      `SELECT mc.*, u.nome AS usuario_nome
       FROM mensagens_chamado mc
       JOIN usuarios u ON mc.id_usuario = u.id_usuario
       WHERE mc.id_chamado = ?
       ORDER BY mc.data_envio ASC`,
      [id_chamado]
    );
    return linhas;
  }
};

module.exports = MensagemChamado;
