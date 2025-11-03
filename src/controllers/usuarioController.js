// backend/src/controllers/usuarioController.js
const db = require("../config/db");
const { hashPassword } = require("../utils/password"); // <-- usar Argon2

const usuarioController = {
  // Retorna dados públicos do usuário autenticado
  async getPerfil(req, res) {
    try {
      const id = req.usuario && req.usuario.id_usuario;
      if (!id) return res.status(401).json({ message: "Não autenticado" });

      const [rows] = await db.execute(
        "SELECT id_usuario, nome, email, avatar, data_cadastro, tipo_usuario FROM usuarios WHERE id_usuario = ?",
        [id]
      );

      const user = rows[0];
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      user.avatar_url = user.avatar ? `/avatars/${user.avatar}` : `/avatars/default-avatar.png`;
      res.json(user);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar perfil" });
    }
  },

  // Atualizar nome e/ou senha
  async atualizarPerfil(req, res) {
    try {
      const id = req.usuario && req.usuario.id_usuario;
      if (!id) return res.status(401).json({ message: "Não autenticado" });

      const { nome, senha } = req.body;
      const updates = [];
      const params = [];

      if (nome !== undefined) {
        updates.push("nome = ?");
        params.push(nome);
      }

      if (senha !== undefined && senha !== "") {
        const hash = await hashPassword(senha); // <-- Argon2 aqui
        updates.push("senha = ?");
        params.push(hash);
      }

      if (!updates.length) return res.status(400).json({ message: "Nada para atualizar" });

      params.push(id);
      const sql = `UPDATE usuarios SET ${updates.join(", ")} WHERE id_usuario = ?`;
      await db.execute(sql, params);

      res.json({ message: "Perfil atualizado" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  },

  // Upload de avatar
  async uploadAvatar(req, res) {
    try {
      const id = req.usuario && req.usuario.id_usuario;
      if (!id) return res.status(401).json({ message: "Não autenticado" });

      if (!req.file) return res.status(400).json({ message: "Arquivo não enviado" });

      const filename = req.file.filename;

      // remover avatar antigo se não for default
      const [rows] = await db.execute("SELECT avatar FROM usuarios WHERE id_usuario = ?", [id]);
      const prev = rows[0] && rows[0].avatar;
      if (prev && prev !== "default-avatar.png") {
        const fs = require("fs");
        const path = require("path");
        const oldPath = path.join(__dirname, "..", "..", "public", "uploads", "avatars", prev);
        try { if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } catch(e){/* ignore */ }
      }

      await db.execute("UPDATE usuarios SET avatar = ? WHERE id_usuario = ?", [filename, id]);
      res.json({ message: "Avatar atualizado", avatar_url: `/avatars/${filename}` });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao enviar avatar" });
    }
  }
};

module.exports = usuarioController;
