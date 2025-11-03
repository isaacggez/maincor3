// backend/src/controllers/conviteController.js
const Convite = require("../models/Convite");

const conviteController = {
  // Criar convite
  async criar(req, res) {
    try {
      const { id_organizacao, email_convidado, id_usuario_convidado } = req.body;

      if (!id_organizacao || !email_convidado) {
        return res
          .status(400)
          .json({ message: "Organização e e-mail do convidado são obrigatórios" });
      }

      const id_convite = await Convite.criar(
        id_organizacao,
        email_convidado,
        id_usuario_convidado || null
      );

      res.status(201).json({ id_convite, id_organizacao, email_convidado });
    } catch (error) {
      console.error("Erro ao criar convite:", error);
      res.status(500).json({ message: "Erro ao criar convite" });
    }
  },

  // Buscar convite por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const convite = await Convite.buscarPorId(id);

      if (!convite) {
        return res.status(404).json({ message: "Convite não encontrado" });
      }

      res.json(convite);
    } catch (error) {
      console.error("Erro ao buscar convite:", error);
      res.status(500).json({ message: "Erro ao buscar convite" });
    }
  },

  // Listar convites de uma organização
  async listarPorOrganizacao(req, res) {
    try {
      const { id_organizacao } = req.params;
      const convites = await Convite.listarPorOrganizacao(id_organizacao);
      res.json(convites);
    } catch (error) {
      console.error("Erro ao listar convites:", error);
      res.status(500).json({ message: "Erro ao listar convites" });
    }
  },

  // Atualizar status de um convite
  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pendente", "aceito", "recusado", "expirado"].includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }

      const atualizado = await Convite.atualizarStatus(id, status);

      if (!atualizado) {
        return res.status(404).json({ message: "Convite não encontrado" });
      }

      res.json({ message: "Status do convite atualizado com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar status do convite:", error);
      res.status(500).json({ message: "Erro ao atualizar status do convite" });
    }
  },

  // Deletar convite
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await Convite.deletar(id);

      if (!deletado) {
        return res.status(404).json({ message: "Convite não encontrado" });
      }

      res.json({ message: "Convite deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar convite:", error);
      res.status(500).json({ message: "Erro ao deletar convite" });
    }
  },
};

module.exports = conviteController;
