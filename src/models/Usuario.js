// backend/src/models/Usuario.js
const db = require("../config/db");

const Usuario = {
  async criar(nome, email, senha, tipo_usuario = "usuario") {
    const [resultado] = await db.execute(
      "INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)",
      [nome, email, senha, tipo_usuario]
    );
    return resultado.insertId;
  },

  async buscarPorEmail(email) {
    const [linhas] = await db.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    return linhas[0];
  },

  async buscarPorId(id_usuario) {
    const [linhas] = await db.execute(
      "SELECT id_usuario, nome, email, tipo_usuario, data_cadastro FROM usuarios WHERE id_usuario = ?",
      [id_usuario]
    );
    return linhas[0];
  },

  async listarTodos() {
    const [linhas] = await db.execute(
      "SELECT id_usuario, nome, email, tipo_usuario, data_cadastro FROM usuarios"
    );
    return linhas;
  },
};

module.exports = Usuario;
