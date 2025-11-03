const MensagemPrivada = require("../models/MensagemPrivada");

const mensagemPrivadaController = {
  async enviar(req, res) {
    try {
      const id_remetente = req.usuario?.id_usuario;
      const { id_destinatario, conteudo } = req.body;
      if (!id_remetente) return res.status(401).json({ message: "Usuário não autenticado" });
      if (!id_destinatario || !conteudo) return res.status(400).json({ message: "Campos obrigatórios ausentes" });

      const id = await MensagemPrivada.criar(id_remetente, id_destinatario, conteudo);
      res.status(201).json({ id_msg: id });
    } catch (err) {
      console.error("Erro ao enviar mensagem privada:", err);
      res.status(500).json({ message: "Erro ao enviar mensagem" });
    }
  },

  async listarConversas(req, res) {
    try {
      const id_usuario = req.usuario?.id_usuario;
      if (!id_usuario) return res.status(401).json({ message: "Usuário não autenticado" });
      const msgs = await MensagemPrivada.listarConversasParaUsuario(id_usuario);
      res.json(msgs);
    } catch (err) {
      console.error("Erro ao listar mensagens:", err);
      res.status(500).json({ message: "Erro ao carregar mensagens" });
    }
  },

  async listarEntre(req, res) {
    try {
      const id_usuario = req.usuario?.id_usuario;
      const { id_outro } = req.params;
      if (!id_usuario) return res.status(401).json({ message: "Usuário não autenticado" });
      const conv = await MensagemPrivada.listarEntre(id_usuario, id_outro);
      res.json(conv);
    } catch (err) {
      console.error("Erro ao listar conversa:", err);
      res.status(500).json({ message: "Erro ao carregar conversa" });
    }
  },

  async marcarLida(req, res) {
    try {
      const { id_msg } = req.params;
      const ok = await MensagemPrivada.marcarComoLida(id_msg);
      if (!ok) return res.status(404).json({ message: "Mensagem não encontrada" });
      res.json({ message: "Mensagem marcada como lida" });
    } catch (err) {
      console.error("Erro ao marcar lida:", err);
      res.status(500).json({ message: "Erro interno" });
    }
  }
};

module.exports = mensagemPrivadaController;