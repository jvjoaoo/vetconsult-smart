import { database } from "../config/database";

export interface TutorPayload {
  TUT_NOME: string;
  TUT_CPF: string;
  TUT_EMAIL: string;
  TUT_TELEFONE: string;
  TUT_DTNASC?: string | null;
  TUT_SENHA?: string | null;
  TUT_STATUS?: "ATIVO" | "INATIVO";
}

export async function listarTutores() {
  const [rows] = await database.execute(
    `SELECT 
        TUT_ID,
        TUT_NOME,
        TUT_EMAIL,
        TUT_TELEFONE,
        TUT_DTNASC,
        TUT_STATUS,
        TUT_CREATED_AT,
        TUT_UPDATED_AT
     FROM tutores
     ORDER BY TUT_ID DESC`
  );

  return rows;
}

export async function buscarTutorPorId(id: number) {
  const [rows]: any = await database.execute(
    `SELECT 
        TUT_ID,
        TUT_NOME,
        TUT_EMAIL,
        TUT_TELEFONE,
        TUT_DTNASC,
        TUT_STATUS,
        TUT_CREATED_AT,
        TUT_UPDATED_AT
     FROM tutores
     WHERE TUT_ID = ?`,
    [id]
  );

  return rows[0];
}

export async function buscarTutorPorEmail(email: string) {
  const [rows]: any = await database.execute(
    `SELECT * FROM tutores WHERE TUT_EMAIL = ?`,
    [email]
  );

  return rows[0];
}

export async function criarTutor(data: TutorPayload) {
  const [result]: any = await database.execute(
    `INSERT INTO tutores (
      TUT_NOME,
      TUT_CPF,
      TUT_EMAIL,
      TUT_TELEFONE,
      TUT_DTNASC,
      TUT_SENHA,
      TUT_STATUS
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.TUT_NOME,
      data.TUT_CPF,
      data.TUT_EMAIL,
      data.TUT_TELEFONE,
      data.TUT_DTNASC || null,
      data.TUT_SENHA || null,
      data.TUT_STATUS || "ATIVO"
    ]
  );

  return result;
}

export async function atualizarTutor(id: number, data: TutorPayload) {
  if (data.TUT_SENHA) {
    const [result]: any = await database.execute(
      `UPDATE tutores
       SET
         TUT_NOME = ?,
         TUT_EMAIL = ?,
         TUT_TELEFONE = ?,
         TUT_DTNASC = ?,
         TUT_SENHA = ?
       WHERE TUT_ID = ?`,
      [
        data.TUT_NOME,
        data.TUT_EMAIL,
        data.TUT_TELEFONE,
        data.TUT_DTNASC || null,
        data.TUT_SENHA || null,
        id
      ]
    );

    return result;
  }

  const [result]: any = await database.execute(
    `UPDATE tutores
     SET
       TUT_NOME = ?,
       TUT_EMAIL = ?,
       TUT_TELEFONE = ?,
       TUT_DTNASC = ?
     WHERE TUT_ID = ?`,
    [
      data.TUT_NOME,
      data.TUT_EMAIL,
      data.TUT_TELEFONE,
      data.TUT_DTNASC || null,
      id
    ]
  );

  return result;
}

export async function atualizarStatusTutor(
  id: number,
  status: "ATIVO" | "INATIVO"
) {
  const [result]: any = await database.execute(
    `UPDATE tutores
     SET TUT_STATUS = ?
     WHERE TUT_ID = ?`,
    [status, id]
  );

  return result;
}

export async function deletarTutor(id: number) {
  const [result]: any = await database.execute(
    `DELETE FROM tutores WHERE TUT_ID = ?`,
    [id]
  );

  return result;
}

export async function buscarTutorLoginPorEmail(email: string) {
  const [rows]: any = await database.execute(
    `SELECT * FROM tutores WHERE TUT_EMAIL = ? LIMIT 1`,
    [email]
  );

  return rows[0];
}