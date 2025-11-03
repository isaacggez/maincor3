const Local = require("../models/Local");

const localController = {
  async listar(req, res) {
    try {
      const { id_organizacao } = req.params;
      const locais = await Local.listarPorOrganizacao(id_organizacao);

      const resposta = locais.map(local => ({
        id_local: local.id_local,
        nome: local.nome,
        descricao: local.descricao || "",
      }));

      res.json(resposta);
    } catch (err) {
      console.error("Erro ao listar locais:", err);
      res.status(500).json({ message: "Erro ao buscar locais" });
    }
  },

  async criar(req, res) {
    try {
      const { id_organizacao } = req.params;
      const { nome, descricao } = req.body;
      if (!nome) return res.status(400).json({ message: "O nome do local é obrigatório" });

      const id_local = await Local.criar(nome, descricao || null, id_organizacao);

      res.status(201).json({ id_local, nome, descricao: descricao || "", message: "Local criado com sucesso" });
    } catch (err) {
      console.error("Erro ao criar local:", err);
      res.status(500).json({ message: "Erro ao criar local" });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      const atualizado = await Local.atualizar(id, nome, descricao);
      if (!atualizado) return res.status(404).json({ message: "Local não encontrado" });

      res.json({ message: "Local atualizado com sucesso" });
    } catch (err) {
      console.error("Erro ao atualizar local:", err);
      res.status(500).json({ message: "Erro ao atualizar local" });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ message: "ID do local inválido" });
      }

      const deletado = await Local.deletar(id);
      if (!deletado) return res.status(404).json({ message: "Local não encontrado" });

      res.json({ message: "Local removido com sucesso" });
    } catch (err) {
      console.error("Erro ao excluir local:", err);
      res.status(500).json({ message: "Erro ao excluir local" });
    }
  }
};

module.exports = localController;
