// test-db.js
const path = require("path");
const db = require(path.join(__dirname, "src", "config", "db")); // caminho correto
require("dotenv").config();

async function testConnection() {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("Conexão OK! Test query result:", rows[0].result);
    process.exit(0);
  } catch (err) {
    console.error("Erro de conexão:", err.message);
    process.exit(1);
  }
}

testConnection();
