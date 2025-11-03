const argon2 = require("argon2");

async function hashPassword(senha) {
  return await argon2.hash(senha);
}

async function verifyPassword(senha, hash) {
  return await argon2.verify(hash, senha);
}

module.exports = { hashPassword, verifyPassword };
