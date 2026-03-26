const bcrypt = require("bcrypt");

async function gerar() {
  const senha = "admMaster@2026"; // senha atual do master
  const hash = await bcrypt.hash(senha, 12);
  console.log(hash);
}

gerar();