// backend/src/models/Local.js
const db = require("../config/db");

const Local = {
  async criar(nome, descricao, id_organizacao) {
    const [resultado] = await db.execute(
      "INSERT INTO locais (nome, descricao, id_organizacao) VALUES (?, ?, ?)",
      [nome, descricao, id_organizacao]
    );
    return resultado.insertId;
  },

  async buscarPorId(id_local) {
    const [linhas] = await db.execute(
      "SELECT * FROM locais WHERE id_local = ?",
      [id_local]
    );
    return linhas[0];
  },

  async listarPorOrganizacao(id_organizacao) {
    const [linhas] = await db.execute(
      "SELECT * FROM locais WHERE id_organizacao = ?",
      [id_organizacao]
    );
    return linhas;
  },

  async atualizar(id_local, nome, descricao) {
    const [resultado] = await db.execute(
      "UPDATE locais SET nome = ?, descricao = ? WHERE id_local = ?",
      [nome, descricao, id_local]
    );
    return resultado.affectedRows > 0;
  },

  async deletar(id_local) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Apagar equipamentos ligados a esse local
      await conn.execute(
        "DELETE FROM equipamentos WHERE id_local = ?",
        [id_local]
      );

      // Agora apagar o local
      const [resultado] = await conn.execute(
        "DELETE FROM locais WHERE id_local = ?",
        [id_local]
      );

      await conn.commit();
      return resultado.affectedRows > 0;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};

module.exports = Local;
