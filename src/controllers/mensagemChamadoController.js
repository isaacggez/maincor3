// backend/src/controllers/mensagemChamadoController.js
const MensagemChamado = require("../models/MensagemChamado");

const mensagemChamadoController = {
  // Criar uma nova mensagem
  async criar(req, res) {
    try {
      const { id_chamado, conteudo } = req.body;
      const id_usuario = req.usuario.id_usuario; // vem do token JWT

      if (!id_chamado || !conteudo) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios" });
      }

      const id_mensagem = await MensagemChamado.criar(id_chamado, id_usuario, conteudo);

      res.status(201).json({
        id_mensagem,
        id_chamado,
        id_usuario,
        conteudo,
      });
    } catch (error) {
      console.error("Erro ao criar mensagem:", error);
      res.status(500).json({ message: "Erro ao criar mensagem" });
    }
  },

  // Listar mensagens de um chamado
  async listarPorChamado(req, res) {
    try {
      const { id_chamado } = req.params;
      const mensagens = await MensagemChamado.listarPorChamado(id_chamado);

      res.json(mensagens);
    } catch (error) {
      console.error("Erro ao listar mensagens:", error);
      res.status(500).json({ message: "Erro ao listar mensagens" });
    }
  },
};

module.exports = mensagemChamadoController;
