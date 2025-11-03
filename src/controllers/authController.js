// backend/src/controllers/authController.js
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { hashPassword, compararSenha } = require("../utils/password");

const authController = {
  // Registrar novo usuário
  async registrar(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Preencha todos os campos" });
      }

      // Verifica se email já existe
      const [usuarios] = await db.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );
      if (usuarios.length > 0) {
        return res.status(400).json({ message: "E-mail já cadastrado" });
      }

      // Criptografa a senha usando Argon2
      const hash = await hashPassword(senha);

      // Tipo de usuário padrão
      const tipo_usuario = "usuario";

      const [resultado] = await db.execute(
        "INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)",
        [nome, email, hash, tipo_usuario]
      );

      const id_usuario = resultado.insertId;

      // Cria token JWT
      const token = jwt.sign(
        { id_usuario, nome, email, tipo_usuario },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.status(201).json({ id_usuario, nome, email, token });
    } catch (err) {
      console.error("Erro ao registrar:", err);
      res.status(500).json({ message: "Erro ao registrar usuário" });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: "Preencha todos os campos" });
      }

      const [usuarios] = await db.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );
      const usuario = usuarios[0];
      if (!usuario) return res.status(400).json({ message: "Usuário não encontrado" });

      // Verifica senha usando Argon2
      const senhaValida = await compararSenha(senha, usuario.senha);
      if (!senhaValida) return res.status(400).json({ message: "Senha incorreta" });

      const payload = {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

      res.json({ message: "Login realizado com sucesso", usuario: payload, token });
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      res.status(500).json({ message: "Erro ao fazer login" });
    }
  }
};

module.exports = authController;
