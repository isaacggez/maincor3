// backend/src/utils/password.js
const argon2 = require('argon2');

async function hashPassword(password) {
    try {
        return await argon2.hash(password);
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
}

async function compararSenha(senhaDigitada, hashArmazenado) {
    try {
        return await argon2.verify(hashArmazenado, senhaDigitada);
    } catch (err) {
        console.error('Error comparing passwords:', err);
        throw err;
    }
}

module.exports = {
    hashPassword,
    compararSenha
};
