const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// todas as rotas abaixo exigem autenticação
router.use(authMiddleware);

// pasta de upload
const uploadDir = path.join(__dirname, "..", "..", "public", "uploads", "avatars");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `avatar_${req.usuario.id_usuario}_${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.test(ext)) return cb(new Error("Tipo de arquivo não suportado"), false);
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }
});

router.get("/me", usuarioController.getPerfil);
router.patch("/me", usuarioController.atualizarPerfil);
router.post("/me/avatar", upload.single("avatar"), usuarioController.uploadAvatar);

module.exports = router;
