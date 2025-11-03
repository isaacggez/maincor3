const Organizacao = require("../models/Organizacao");
const Participacao = require("../models/Participacao");

const organizacaoController = {
  async criar(req, res) {
    try {
      const { nome, descricao } = req.body;
      if (!req.usuario) return res.status(401).json({ message: "Usuário não autenticado" });
      const id_usuario = req.usuario.id_usuario;
      if (!nome) return res.status(400).json({ message: "Nome da organização é obrigatório" });

      const id_organizacao = await Organizacao.criar(nome, descricao || null, id_usuario);

      res.status(201).json({ id_organizacao, nome, descricao: descricao || "", message: "Organização criada com sucesso" });
    } catch (error) {
      console.error("Erro ao criar organização:", error);
      res.status(500).json({ message: "Erro ao criar organização", error: error.message });
    }
  },

  async listarPorUsuario(req, res) {
    try {
      const id_usuario = req.usuario?.id_usuario;
      if (!id_usuario) return res.status(401).json({ message: "Usuário não autenticado" });

      const organizacoes = await Organizacao.listarPorUsuario(id_usuario);
      const resposta = organizacoes.map(org => ({ id_organizacao: org.id_organizacao, nome: org.nome, descricao: org.descricao || "" }));

      res.json(resposta);
    } catch (error) {
      console.error("Erro ao listar organizações:", error);
      res.status(500).json({ message: "Erro ao listar organizações", error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const organizacao = await Organizacao.buscarPorId(id);
      if (!organizacao) return res.status(404).json({ message: "Organização não encontrada" });

      res.json({ id_organizacao: organizacao.id_organizacao, nome: organizacao.nome, descricao: organizacao.descricao || "" });
    } catch (error) {
      console.error("Erro ao buscar organização:", error);
      res.status(500).json({ message: "Erro ao buscar organização", error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;
      const id_usuario = req.usuario?.id_usuario;
      if (!id_usuario) return res.status(401).json({ message: "Usuário não autenticado" });

      const participacao = await Participacao.buscarPorUsuarioEOrganizacao(id_usuario, id);
      if (!participacao || participacao.cargo !== "administrador") return res.status(403).json({ message: "Sem permissão para atualizar organização" });

      const atualizado = await Organizacao.atualizar(id, nome, descricao);
      if (!atualizado) return res.status(404).json({ message: "Organização não encontrada" });

      res.json({ message: "Organização atualizada com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar organização:", error);
      res.status(500).json({ message: "Erro ao atualizar organização", error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const id_usuario = req.usuario?.id_usuario;
      if (!id_usuario) return res.status(401).json({ message: "Usuário não autenticado" });

      const participacao = await Participacao.buscarPorUsuarioEOrganizacao(id_usuario, id);
      if (!participacao || participacao.cargo !== "administrador") return res.status(403).json({ message: "Sem permissão para deletar organização" });

      const deletado = await Organizacao.deletar(id);
      if (!deletado) return res.status(404).json({ message: "Organização não encontrada" });

      res.json({ message: "Organização deletada com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar organização:", error);
      res.status(500).json({ message: "Erro ao deletar organização", error: error.message });
    }
  }
};

module.exports = organizacaoController;
