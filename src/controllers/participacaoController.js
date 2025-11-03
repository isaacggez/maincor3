const ParticipacaoModel = require("../models/Participacao");
const db = require("../config/db");

const participacaoController = {
  // Lista todas participações de uma organização
  async listarPorOrganizacao(req, res) {
    try {
      const { id_organizacao } = req.params;
      const rows = await ParticipacaoModel.listarPorOrganizacao(id_organizacao);
      res.json(rows);
    } catch (err) {
      console.error("Erro ao listar participações:", err);
      res.status(500).json({ message: "Erro ao listar participações" });
    }
  },

  // Retorna a participação do usuário logado nessa organização (se existir)
  async minhaParticipacao(req, res) {
    try {
      const id_usuario = req.usuario?.id_usuario;
      const { id_organizacao } = req.params;
      if (!id_usuario) return res.status(401).json({ message: "Usuário não autenticado" });
      const p = await ParticipacaoModel.buscarPorUsuarioEOrganizacao(id_usuario, id_organizacao);
      res.json(p || null);
    } catch (err) {
      console.error("Erro ao buscar participação:", err);
      res.status(500).json({ message: "Erro ao buscar participação" });
    }
  },

  // Adicionar usuário à organização (somente admin da organização pode)
  async adicionar(req, res) {
    try {
      const id_usuario_req = req.usuario?.id_usuario;
      const { id_usuario, id_organizacao, cargo } = req.body;
      if (!id_usuario || !id_organizacao || !cargo) {
        return res.status(400).json({ message: "Campos obrigatórios ausentes" });
      }

      // valida se solicitante é admin
      const adminPart = await ParticipacaoModel.buscarPorUsuarioEOrganizacao(id_usuario_req, id_organizacao);
      if (!adminPart || adminPart.cargo !== "administrador") {
        return res.status(403).json({ message: "Sem permissão para adicionar membros" });
      }

      const id = await ParticipacaoModel.adicionar(id_usuario, id_organizacao, cargo);
      res.status(201).json({ id_participacao: id, id_usuario, id_organizacao, cargo });
    } catch (err) {
      console.error("Erro ao adicionar participação:", err);
      if (err && err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Usuário já participa desta organização" });
      res.status(500).json({ message: "Erro ao adicionar participação" });
    }
  },

  // Atualiza cargo (somente admin pode)
  async atualizarCargo(req, res) {
    try {
      const id_usuario_req = req.usuario?.id_usuario;
      const { id_participacao } = req.params;
      const { cargo } = req.body;
      if (!cargo) return res.status(400).json({ message: "Cargo obrigatório" });

      // busca participacao alvo para saber organização
      const [rows] = await db.execute("SELECT * FROM participacoes WHERE id_participacao = ?", [id_participacao]);
      const target = rows[0];
      if (!target) return res.status(404).json({ message: "Participação não encontrada" });

      const adminPart = await ParticipacaoModel.buscarPorUsuarioEOrganizacao(id_usuario_req, target.id_organizacao);
      if (!adminPart || adminPart.cargo !== "administrador") {
        return res.status(403).json({ message: "Sem permissão para atualizar cargo" });
      }

      const ok = await ParticipacaoModel.atualizarCargo(id_participacao, cargo);
      if (!ok) return res.status(404).json({ message: "Não foi possível atualizar cargo" });
      res.json({ message: "Cargo atualizado" });
    } catch (err) {
      console.error("Erro ao atualizar cargo:", err);
      res.status(500).json({ message: "Erro ao atualizar cargo" });
    }
  },

  // Remove participação (somente admin pode)
  async remover(req, res) {
    try {
      const id_usuario_req = req.usuario?.id_usuario;
      const { id_participacao } = req.params;

      const [rows] = await db.execute("SELECT * FROM participacoes WHERE id_participacao = ?", [id_participacao]);
      const target = rows[0];
      if (!target) return res.status(404).json({ message: "Participação não encontrada" });

      const adminPart = await ParticipacaoModel.buscarPorUsuarioEOrganizacao(id_usuario_req, target.id_organizacao);
      if (!adminPart || adminPart.cargo !== "administrador") {
        return res.status(403).json({ message: "Sem permissão para remover membro" });
      }

      const ok = await ParticipacaoModel.remover(id_participacao);
      if (!ok) return res.status(404).json({ message: "Não foi possível remover participação" });
      res.json({ message: "Participação removida" });
    } catch (err) {
      console.error("Erro ao remover participação:", err);
      res.status(500).json({ message: "Erro ao remover participação" });
    }
  }
};

module.exports = participacaoController;
