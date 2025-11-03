const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto_123";

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Não autenticado" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token inválido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = { id_usuario: decoded.id_usuario };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
