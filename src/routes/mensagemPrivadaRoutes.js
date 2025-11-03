const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const msgCtrl = require("../controllers/mensagemPrivadaController");

router.use(authMiddleware);

router.post("/", msgCtrl.enviar);
router.get("/", msgCtrl.listarConversas);
router.get("/conversa/:id_outro", msgCtrl.listarEntre);
router.put("/lida/:id_msg", msgCtrl.marcarLida);

module.exports = router;