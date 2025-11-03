const CategoriaProblema = require("../models/CategoriaProblema");

const categoriaController = {
  listar: async (req, res) => {
    try {
      const categorias = await CategoriaProblema.listarTodas();
      res.json(categorias);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao listar categorias" });
    }
  },

  buscarPorId: async (req, res) => {
    const { id } = req.params;
    try {
      const categoria = await CategoriaProblema.buscarPorId(id);
      if (!categoria) return res.status(404).json({ message: "Categoria não encontrada" });
      res.json(categoria);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar categoria" });
    }
  },
};

module.exports = categoriaController;
