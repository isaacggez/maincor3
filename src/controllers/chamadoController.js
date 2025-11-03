const Chamado = require("../models/Chamado");
const CategoriaProblema = require("../models/CategoriaProblema");
const ChamadoHistorico = require("../models/ChamadoHistorico");
const { checkOrgRole } = require("../utils/authOrg");

const chamadoController = {
  // Listar chamados de um equipamento
  async listar(req, res) {
    try {
      const { equipamentoId } = req.params;
      if (!equipamentoId) {
        return res.status(400).json({ message: "ID do equipamento é obrigatório" });
      }
      const chamados = await Chamado.listarPorEquipamento(equipamentoId);
      res.json(chamados);
    } catch (err) {
      console.error("Erro ao listar chamados:", err);
      res.status(500).json({ message: "Erro ao buscar chamados" });
    }
  },

  // Criar novo chamado (qualquer participante da organização pode criar)
  async criar(req, res) {
    try {
      const { equipamentoId } = req.params;
      const { id_categoria, descricao } = req.body;
      const id_usuario_abertura = req.usuario && req.usuario.id_usuario;

      if (!equipamentoId || !id_categoria || !descricao) {
        return res.status(400).json({ message: "Campos obrigatórios ausentes" });
      }

      // valida participação (qualquer cargo)
      const auth = await checkOrgRole(id_usuario_abertura, { id_equipamento: equipamentoId }, []);
      if (!auth.ok) return res.status(auth.status || 403).json({ message: auth.message });

      // valida categoria
      const cat = await CategoriaProblema.buscarPorId(id_categoria);
      if (!cat) {
        return res.status(400).json({ message: "Categoria de problema inválida" });
      }

      const id = await Chamado.criar(
        equipamentoId,
        id_categoria,
        id_usuario_abertura,
        descricao
      );

      // criar histórico de abertura
      await ChamadoHistorico.criar(id, id_usuario_abertura, "abertura", descricao);

      res.status(201).json({
        id,
        id_equipamento: equipamentoId,
        id_categoria,
        id_usuario_abertura,
        descricao,
        status: "aberto",
      });
    } catch (err) {
      console.error("Erro ao criar chamado:", err);
      res.status(500).json({ message: "Erro ao criar chamado" });
    }
  },

  // Atualizar status do chamado (só técnico ou administrador)
  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, comentario } = req.body;
      const id_usuario = req.usuario && req.usuario.id_usuario;

      // busca chamado para obter equipamento e organização
      const chamado = await Chamado.buscarPorId(id);
      if (!chamado) return res.status(404).json({ message: "Chamado não encontrado" });

      const auth = await checkOrgRole(id_usuario, { id_equipamento: chamado.id_equipamento }, ['tecnico']);
      if (!auth.ok) return res.status(auth.status || 403).json({ message: auth.message });

      if (!status) {
        return res.status(400).json({ message: "Status é obrigatório" });
      }

      const ok = await Chamado.atualizarStatus(id, status);
      if (!ok) return res.status(404).json({ message: "Chamado não encontrado" });

      // registrar histórico com comentário opcional
      await ChamadoHistorico.criar(id, id_usuario, "status", comentario || `Status alterado para ${status}`);

      res.json({ id, status });
    } catch (err) {
      console.error("Erro ao atualizar chamado:", err);
      res.status(500).json({ message: "Erro ao atualizar chamado" });
    }
  },

  // Responder / adicionar texto de resposta ao chamado (só técnico ou administrador)
  async responder(req, res) {
    try {
      const { id } = req.params;
      const { resposta, status } = req.body;
      const id_usuario = req.usuario && req.usuario.id_usuario;

      const chamado = await Chamado.buscarPorId(id);
      if (!chamado) return res.status(404).json({ message: "Chamado não encontrado" });

      const auth = await checkOrgRole(id_usuario, { id_equipamento: chamado.id_equipamento }, ['tecnico']);
      if (!auth.ok) return res.status(auth.status || 403).json({ message: auth.message });

      if (!resposta && !status) {
        return res.status(400).json({ message: "Resposta ou status são necessários" });
      }

      // opcionalmente atualiza status
      if (status) {
        const ok = await Chamado.atualizarStatus(id, status);
        if (!ok) return res.status(404).json({ message: "Chamado não encontrado" });
        await ChamadoHistorico.criar(id, id_usuario, "status", `Status alterado para ${status}`);
      }

      if (resposta) {
        await ChamadoHistorico.criar(id, id_usuario, "resposta", resposta);
      }

      res.json({ message: "Resposta registrada" });
    } catch (err) {
      console.error("Erro ao responder chamado:", err);
      res.status(500).json({ message: "Erro ao responder chamado" });
    }
  },

  // Editar campos do chamado (categoria / descricao) - usa PATCH
  async editar(req, res) {
    try {
      const { id } = req.params;
      const { id_categoria, descricao } = req.body;
      const id_usuario = req.usuario && req.usuario.id_usuario;

      const chamado = await Chamado.buscarPorId(id);
      if (!chamado) return res.status(404).json({ message: "Chamado não encontrado" });

      // somente tecnico/admin pode editar
      const auth = await checkOrgRole(id_usuario, { id_equipamento: chamado.id_equipamento }, ['tecnico']);
      if (!auth.ok) return res.status(auth.status || 403).json({ message: auth.message });

      // valida categoria se fornecida
      if (id_categoria) {
        const cat = await CategoriaProblema.buscarPorId(id_categoria);
        if (!cat) return res.status(400).json({ message: "Categoria de problema inválida" });
      }

      const ok = await Chamado.editar(id, { id_categoria, descricao });
      if (!ok) return res.status(404).json({ message: "Chamado não encontrado ou nada para editar" });

      // registra histórico
      const partes = [];
      if (id_categoria) partes.push(`categoria alterada para ${id_categoria}`);
      if (descricao !== undefined) partes.push("descrição atualizada");
      await ChamadoHistorico.criar(id, id_usuario, "editar", partes.join("; ") || "edição");

      res.json({ message: "Chamado atualizado" });
    } catch (err) {
      console.error("Erro ao editar chamado:", err);
      res.status(500).json({ message: "Erro ao editar chamado" });
    }
  },

  // Histórico (permite qualquer participante visualizar)
  async historico(req, res) {
    try {
      const { id } = req.params;
      const id_usuario = req.usuario && req.usuario.id_usuario;

      const chamado = await Chamado.buscarPorId(id);
      if (!chamado) return res.status(404).json({ message: "Chamado não encontrado" });

      const auth = await checkOrgRole(id_usuario, { id_equipamento: chamado.id_equipamento }, []);
      if (!auth.ok) return res.status(auth.status || 403).json({ message: auth.message });

      const historico = await ChamadoHistorico.listarPorChamado(id);
      res.json(historico);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
      res.status(500).json({ message: "Erro ao buscar histórico" });
    }
  },

  // Deletar chamado (somente administrador)
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const id_usuario = req.usuario && req.usuario.id_usuario;

      const chamado = await Chamado.buscarPorId(id);
      if (!chamado) return res.status(404).json({ message: "Chamado não encontrado" });

      const auth = await checkOrgRole(id_usuario, { id_equipamento: chamado.id_equipamento }, ['administrador']);
      if (!auth.ok) return res.status(auth.status || 403).json({ message: auth.message });

      const ok = await Chamado.deletar(id);
      if (!ok) return res.status(404).json({ message: "Chamado não encontrado" });
      res.json({ message: "Chamado removido" });
    } catch (err) {
      console.error("Erro ao excluir chamado:", err);
      res.status(500).json({ message: "Erro ao excluir chamado" });
    }
  },
};

module.exports = chamadoController;