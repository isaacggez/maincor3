// backend/src/utils/password.js
const argon2 = require("argon2");

const argon2Options = {
  type: argon2.argon2id,
  memoryCost: 1 << 12, // 4 MiB
  timeCost: 2,
  parallelism: 1,
  saltLength: 16
};

// Hash para cadastro/atualização de senha
async function hashPassword(senha) {
  return await argon2.hash(senha, argon2Options);
}

// Comparar senha fornecida com hash armazenado (login)
async function compararSenha(senhaFornecida, hashArmazenado) {
  return await argon2.verify(hashArmazenado, senhaFornecida);
}

module.exports = { hashPassword, compararSenha };
