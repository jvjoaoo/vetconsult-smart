import { database } from "../config/database";

// ==== LISTAR PRONTUÁRIOS ====
// Lista todos os prontuários vinculados ao tutor autenticado
export async function listarProntuarios(tutorId: number) {
  const [rows] = await database.query(
    `
    SELECT
      pr.PRT_ID,
      pr.AGD_ID,
      pr.TUT_ID,
      pr.PET_ID,
      p.PET_NOME,
      a.AGD_DATA,
      a.AGD_HORA,
      pr.PRT_DIAGNOSTICO,
      pr.PRT_PRESCRICAO,
      pr.PRT_OBSERVACOES,
      pr.PRT_DATA_ATENDIMENTO,
      pr.PRT_CREATED_AT,
      pr.PRT_UPDATED_AT
    FROM prontuarios pr
    INNER JOIN agendamentos a ON pr.AGD_ID = a.AGD_ID
    INNER JOIN pets p ON pr.PET_ID = p.PET_ID
    WHERE pr.TUT_ID = ?
    ORDER BY pr.PRT_DATA_ATENDIMENTO DESC
    `,
    [tutorId]
  );

  return rows;
}

// ==== BUSCAR PRONTUÁRIO POR ID ====
// Busca um prontuário específico vinculado ao tutor autenticado
export async function buscarProntuarioPorId(
  prontuarioId: number,
  tutorId: number
) {
  const [rows]: any = await database.query(
    `
    SELECT
      pr.PRT_ID,
      pr.AGD_ID,
      pr.TUT_ID,
      pr.PET_ID,
      p.PET_NOME,
      a.AGD_DATA,
      a.AGD_HORA,
      pr.PRT_DIAGNOSTICO,
      pr.PRT_PRESCRICAO,
      pr.PRT_OBSERVACOES,
      pr.PRT_DATA_ATENDIMENTO,
      pr.PRT_CREATED_AT,
      pr.PRT_UPDATED_AT
    FROM prontuarios pr
    INNER JOIN agendamentos a ON pr.AGD_ID = a.AGD_ID
    INNER JOIN pets p ON pr.PET_ID = p.PET_ID
    WHERE pr.PRT_ID = ?
      AND pr.TUT_ID = ?
    `,
    [prontuarioId, tutorId]
  );

  return rows[0];
}

// ==== CRIAR PRONTUÁRIO ====
// Cria um prontuário vinculado a um agendamento, tutor e pet
export async function criarProntuario(dados: any) {
  const {
    AGD_ID,
    TUT_ID,
    PET_ID,
    PRT_DIAGNOSTICO,
    PRT_PRESCRICAO,
    PRT_OBSERVACOES,
    PRT_DATA_ATENDIMENTO,
  } = dados;

  const [result]: any = await database.query(
    `
    INSERT INTO prontuarios (
      AGD_ID,
      TUT_ID,
      PET_ID,
      PRT_DIAGNOSTICO,
      PRT_PRESCRICAO,
      PRT_OBSERVACOES,
      PRT_DATA_ATENDIMENTO
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      AGD_ID,
      TUT_ID,
      PET_ID,
      PRT_DIAGNOSTICO,
      PRT_PRESCRICAO || null,
      PRT_OBSERVACOES || null,
      PRT_DATA_ATENDIMENTO,
    ]
  );

  return {
    PRT_ID: result.insertId,
    AGD_ID,
    TUT_ID,
    PET_ID,
    PRT_DIAGNOSTICO,
    PRT_PRESCRICAO: PRT_PRESCRICAO || null,
    PRT_OBSERVACOES: PRT_OBSERVACOES || null,
    PRT_DATA_ATENDIMENTO,
  };
}

// ==== ATUALIZAR PRONTUÁRIO ====
// Atualiza um prontuário existente vinculado ao tutor autenticado
export async function atualizarProntuario(
  prontuarioId: number,
  tutorId: number,
  dados: any
) {
  const {
    AGD_ID,
    PET_ID,
    PRT_DIAGNOSTICO,
    PRT_PRESCRICAO,
    PRT_OBSERVACOES,
    PRT_DATA_ATENDIMENTO,
  } = dados;

  const [result]: any = await database.query(
    `
    UPDATE prontuarios
    SET
      AGD_ID = ?,
      PET_ID = ?,
      PRT_DIAGNOSTICO = ?,
      PRT_PRESCRICAO = ?,
      PRT_OBSERVACOES = ?,
      PRT_DATA_ATENDIMENTO = ?
    WHERE PRT_ID = ?
      AND TUT_ID = ?
    `,
    [
      AGD_ID,
      PET_ID,
      PRT_DIAGNOSTICO,
      PRT_PRESCRICAO || null,
      PRT_OBSERVACOES || null,
      PRT_DATA_ATENDIMENTO,
      prontuarioId,
      tutorId,
    ]
  );

  return result.affectedRows > 0;
}

// ==== EXCLUIR PRONTUÁRIO ====
// Exclui um prontuário vinculado ao tutor autenticado
export async function excluirProntuario(
  prontuarioId: number,
  tutorId: number
) {
  const [result]: any = await database.query(
    `
    DELETE FROM prontuarios
    WHERE PRT_ID = ?
      AND TUT_ID = ?
    `,
    [prontuarioId, tutorId]
  );

  return result.affectedRows > 0;
}