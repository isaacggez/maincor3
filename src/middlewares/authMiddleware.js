// backend/src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token não fornecido" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Formato de token inválido" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreta");
    // popula req.usuario com o payload inteiro (id_usuario, nome, email, tipo_usuario)
    req.usuario = {
      id_usuario: decoded.id_usuario,
      nome: decoded.nome,
      email: decoded.email,
      tipo_usuario: decoded.tipo_usuario
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") return res.status(401).json({ message: "Token expirado" });
    return res.status(401).json({ message: "Token inválido" });
  }
}

module.exports = authMiddleware;
