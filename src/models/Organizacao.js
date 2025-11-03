const db = require("../config/db");

const Organizacao = {
  async criar(nome, descricao, id_usuario) {
    if (!nome) throw new Error("Nome da organização é obrigatório");
    if (!id_usuario) throw new Error("ID do usuário não fornecido");

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [resultado] = await conn.execute(
        `INSERT INTO organizacoes (nome, descricao, id_usuario_criador) VALUES (?, ?, ?)`,
        [nome, descricao || null, id_usuario]
      );
      const id_organizacao = resultado.insertId;

      await conn.execute(
        `INSERT INTO participacoes (id_usuario, id_organizacao, cargo) VALUES (?, ?, 'administrador')`,
        [id_usuario, id_organizacao]
      );

      await conn.commit();
      return id_organizacao;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async listarPorUsuario(id_usuario) {
    const [rows] = await db.execute(
      `SELECT o.id_organizacao, o.nome, o.descricao
       FROM organizacoes o
       JOIN participacoes p ON o.id_organizacao = p.id_organizacao
       WHERE p.id_usuario = ?`,
      [id_usuario]
    );
    return rows;
  },

  async buscarPorId(id_organizacao) {
    const [rows] = await db.execute(
      `SELECT * FROM organizacoes WHERE id_organizacao = ?`,
      [id_organizacao]
    );
    return rows[0];
  },

  async atualizar(id_organizacao, nome, descricao) {
    const [resultado] = await db.execute(
      `UPDATE organizacoes SET nome = ?, descricao = ? WHERE id_organizacao = ?`,
      [nome, descricao || null, id_organizacao]
    );
    return resultado.affectedRows > 0;
  },

  async deletar(id_organizacao) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Deletar participações
      await conn.execute(
        "DELETE FROM participacoes WHERE id_organizacao = ?",
        [id_organizacao]
      );

      // Deletar equipamentos dos locais vinculados
      await conn.execute(
        `DELETE e FROM equipamentos e
         JOIN locais l ON e.id_local = l.id_local
         WHERE l.id_organizacao = ?`,
        [id_organizacao]
      );

      // Deletar locais (salas)
      await conn.execute(
        "DELETE FROM locais WHERE id_organizacao = ?",
        [id_organizacao]
      );

      // Finalmente, deletar organização
      const [resultado] = await conn.execute(
        "DELETE FROM organizacoes WHERE id_organizacao = ?",
        [id_organizacao]
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

module.exports = Organizacao;
