// backend/src/models/CategoriaProblema.js
const db = require("../config/db");

const CategoriaProblema = {
  async listarTodas() {
    const [linhas] = await db.execute("SELECT * FROM categorias_problemas");
    return linhas;
  },

  async buscarPorId(id_categoria) {
    const [linhas] = await db.execute(
      "SELECT * FROM categorias_problemas WHERE id_categoria = ?",
      [id_categoria]
    );
    return linhas[0];
  },
};

module.exports = CategoriaProblema;
