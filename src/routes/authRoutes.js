const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { hashPassword, compararSenha } = require("../utils/password");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secreta";

// Registrar usuário
router.post("/registrar", async (req, res) => {
  console.log("⭐ Requisição recebida em /auth/registrar:", req.body);
  
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha)
      return res.status(400).json({ message: "Preencha todos os campos" });

    const [rows] = await db.execute("SELECT id_usuario FROM usuarios WHERE email = ?", [email]);
    if (rows.length) return res.status(400).json({ message: "Email já cadastrado" });

    const hash = await hashPassword(senha);
    await db.execute("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, hash]);

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha)
      return res.status(400).json({ message: "Preencha todos os campos" });

    const [rows] = await db.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (!rows.length)
      return res.status(400).json({ message: "Email ou senha incorretos" });

    const user = rows[0];
    const senhaValida = await compararSenha(senha, user.senha);
    if (!senhaValida)
      return res.status(400).json({ message: "Email ou senha incorretos" });

    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        nome: user.nome,
        email: user.email,
        tipo_usuario: user.tipo_usuario
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, nome: user.nome, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao fazer login" });
  }
});

module.exports = router;
