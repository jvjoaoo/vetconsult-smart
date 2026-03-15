import { database } from "../config/database";

export async function listarUsuarios() {
  const [rows] = await database.query(
    "SELECT * FROM usuarios_admin"
  );
  return rows;
}

export async function buscarUsuarioPorId(id: number) {
  const [rows]: any = await database.query(
    "SELECT * FROM usuarios_admin WHERE USR_ID = ?",
    [id]
  );

  return rows[0];
}

//   Lógica dessa função: criarUsuario()
// 1. recebe os dados do usuário
// 2. separa os campos
// 3. executa um INSERT no banco
// 4. retorna o resultado da inserção
export async function criarUsuario(usuario: any) {
  const { USR_NAME, USR_EMAIL, USR_TELEFONE, USR_DTNASC, USR_SENHA } = usuario;

  const [result] = await database.query(
    `INSERT INTO usuarios_admin 
    (USR_NAME, USR_EMAIL, USR_TELEFONE, USR_DTNASC, USR_SENHA)
    VALUES (?, ?, ?, ?, ?)`,
    [USR_NAME, USR_EMAIL, USR_TELEFONE, USR_DTNASC, USR_SENHA]
  );

  return result;
}

//   Lógica dessa função: atualizarUsuario()
// 1. recebe o id do usuário
// 2. recebe os novos dados
// 3. executa um UPDATE na tabela
// 4. retorna o resultado da atualização

export async function atualizarUsuario(id: number, usuario: any) {
  const { USR_NAME, USR_EMAIL, USR_TELEFONE, USR_DTNASC } = usuario;

  const [result] = await database.query(
    `UPDATE usuarios_admin
     SET USR_NAME = ?, USR_EMAIL = ?, USR_TELEFONE = ?, USR_DTNASC = ?
     WHERE USR_ID = ?`,
    [USR_NAME, USR_EMAIL, USR_TELEFONE, USR_DTNASC, id]
  );

  return result;
}

//  Lógica dessa função: deletarUsuario()
// 1. recebe o id do usuário
// 2. executa DELETE no banco
// 3. retorna o resultado da exclusão

export async function deletarUsuario(id: number) {
  const [result] = await database.query(
    "DELETE FROM usuarios_admin WHERE USR_ID = ?",
    [id]
  );

  return result;
}