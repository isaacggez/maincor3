// src/controllers/equipamentoController.js
const Equipamento = require("../models/Equipamento");

const equipamentoController = {
  // Atualiza equipamento e cria histórico com descrição do que mudou
  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (!id) return res.status(400).json({ error: "ID inválido" });

      // usuário vindo do middleware de auth (veja nota abaixo)
      const user = req.user || { id: null, nome: "anônimo" };

      // campos que podem ser atualizados
      const { nome, descricao, tipo, status, id_local, historico_descricao } = req.body;

      // busca estado atual
      const atual = await Equipamento.buscarPorId(id);
      if (!atual) return res.status(404).json({ error: "Equipamento não encontrado" });

      // monta objeto com diferenças para salvar no histórico
      const diferenças = {};
      if (nome !== undefined && nome !== atual.nome) diferenças.nome = { old: atual.nome, new: nome };
      if (descricao !== undefined && descricao !== atual.descricao) diferenças.descricao = { old: atual.descricao, new: descricao };
      if (tipo !== undefined && tipo !== atual.tipo) diferenças.tipo = { old: atual.tipo, new: tipo };
      if (status !== undefined && status !== atual.status) diferenças.status = { old: atual.status, new: status };
      if (id_local !== undefined && id_local !== atual.id_local) diferenças.id_local = { old: atual.id_local, new: id_local };

      // atualiza no banco (somente se houver algo)
      const dadosParaAtualizar = {};
      if (nome !== undefined) dadosParaAtualizar.nome = nome;
      if (descricao !== undefined) dadosParaAtualizar.descricao = descricao;
      if (tipo !== undefined) dadosParaAtualizar.tipo = tipo;
      if (status !== undefined) dadosParaAtualizar.status = status;
      if (id_local !== undefined) dadosParaAtualizar.id_local = id_local;

      if (Object.keys(dadosParaAtualizar).length > 0) {
        await Equipamento.atualizar(id, dadosParaAtualizar);
      }

      // cria mensagem textual legível para histórico
      let mensagem = "";
      if (historico_descricao && typeof historico_descricao === "string" && historico_descricao.trim().length > 0) {
        // se o frontend enviou uma descrição escrita pelo usuário, usa ela junto com as diferenças
        mensagem = `${user.nome || 'usuário'}: ${historico_descricao}`;
      } else {
        // gera mensagem automática com base nas diferenças
        const parts = [];
        for (const key of Object.keys(diferenças)) {
          const d = diferenças[key];
          parts.push(`${key} de "${d.old}" para "${d.new}"`);
        }
        mensagem = (parts.length > 0) ? `${user.nome || 'usuário'} mudou: ${parts.join("; ")}` : `${user.nome || 'usuário'} acessou sem alterações.`;
      }

      // salva histórico (detalhes_json contém o objeto diferenças)
      await Equipamento.criarHistorico({
        id_equipamento: id,
        user_id: user.id || null,
        user_nome: user.nome || user.username || null,
        descricao: mensagem,
        detalhes_json: Object.keys(diferenças).length ? diferenças : null
      });

      return res.json({ ok: true, message: "Equipamento atualizado" });
    } catch (err) {
      console.error("Erro atualizar equipamento:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  },

  // Deleta equipamento e registra no histórico (quem deletou)
  async deletar(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (!id) return res.status(400).json({ error: "ID inválido" });

      const user = req.user || { id: null, nome: "anônimo" };

      const atual = await Equipamento.buscarPorId(id);
      if (!atual) return res.status(404).json({ error: "Equipamento não encontrado" });

      // deleta
      await Equipamento.deletar(id);

      // grava histórico com snapshot da exclusão
      const descricao = `${user.nome || 'usuário'} deletou o equipamento "${atual.nome}" (id ${id})`;
      await Equipamento.criarHistorico({
        id_equipamento: id,
        user_id: user.id || null,
        user_nome: user.nome || null,
        descricao,
        detalhes_json: { deleted_snapshot: atual }
      });

      return res.json({ ok: true, message: "Equipamento deletado" });
    } catch (err) {
      console.error("Erro deletar equipamento:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }
};

module.exports = equipamentoController;
