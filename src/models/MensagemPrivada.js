const db = require("../config/db");

const MensagemPrivada = {
  async criar(id_remetente, id_destinatario, conteudo) {
    const [resultado] = await db.execute(
      "INSERT INTO mensagens_privadas (id_remetente, id_destinatario, conteudo) VALUES (?, ?, ?)",
      [id_remetente, id_destinatario, conteudo]
    );
    return resultado.insertId;
  },

  async listarConversasParaUsuario(id_usuario) {
    const [rows] = await db.execute(
      `SELECT mp.*, u.nome AS remetente_nome, u2.nome AS destinatario_nome
       FROM mensagens_privadas mp
       JOIN usuarios u ON mp.id_remetente = u.id_usuario
       JOIN usuarios u2 ON mp.id_destinatario = u2.id_usuario
       WHERE mp.id_remetente = ? OR mp.id_destinatario = ?
       ORDER BY mp.data_envio DESC`,
      [id_usuario, id_usuario]
    );
    return rows;
  },

  async listarEntre(id_usuario_a, id_usuario_b) {
    const [rows] = await db.execute(
      `SELECT mp.*, u.nome AS remetente_nome
       FROM mensagens_privadas mp
       JOIN usuarios u ON mp.id_remetente = u.id_usuario
       WHERE (mp.id_remetente = ? AND mp.id_destinatario = ?)
          OR (mp.id_remetente = ? AND mp.id_destinatario = ?)
       ORDER BY mp.data_envio ASC`,
      [id_usuario_a, id_usuario_b, id_usuario_b, id_usuario_a]
    );
    return rows;
  },

  async marcarComoLida(id_msg) {
    const [res] = await db.execute("UPDATE mensagens_privadas SET lida = 1 WHERE id_msg = ?", [id_msg]);
    return res.affectedRows > 0;
  }
};

module.exports = MensagemPrivada;