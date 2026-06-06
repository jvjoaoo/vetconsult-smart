import { database } from "../config/database";

// ==== LISTAR AGENDAMENTOS ====
// Lista todos os agendamentos ativos do tutor autenticado
export async function listarAgendamentos(tutorId: number) {
  const [rows] = await database.query(
    `
    SELECT 
      a.AGD_ID,
      a.TUT_ID,
      a.PET_ID,
      p.PET_NOME,
      p.PET_ESPECIE,
      p.PET_RACA,
      p.PET_SEXO,
      p.PET_PORTE,
      p.PET_PESO,
      p.PET_COR,
      p.PET_DTNASC,
      a.AGD_DATA,
      a.AGD_HORA,
      a.AGD_TIPO,
      a.AGD_SINTOMAS,
      a.AGD_VACINA,
      a.AGD_EXAME,
      a.AGD_AGENDAMENTO_REFERENCIA_ID,
      a.AGD_STATUS,
      a.AGD_OBSERVACOES,
      a.AGD_CANCELADO_EM,
      a.AGD_MOTIVO_CANCELAMENTO,
      a.AGD_CREATED_AT,
      a.AGD_UPDATED_AT
    FROM agendamentos a
    INNER JOIN pets p ON a.PET_ID = p.PET_ID
    WHERE a.TUT_ID = ?
      AND a.AGD_STATUS = 'AGENDADO'
    ORDER BY a.AGD_DATA ASC, a.AGD_HORA ASC
    `,
    [tutorId]
  );

  return rows;
}

// ==== CONTAR AGENDAMENTOS ATIVOS - ADMIN ====
// Conta todos os agendamentos ativos do sistema para o dashboard admin
export async function contarAgendamentosAtivosAdmin() {
  const [rows]: any = await database.query(
    `
    SELECT COUNT(*) AS total
    FROM agendamentos
    WHERE AGD_STATUS <> 'CANCELADO'
    `
  );

  return Number(rows[0]?.total || 0);
}

// ==== BUSCAR AGENDAMENTO POR ID ====
// Busca um agendamento específico do tutor autenticado
export async function buscarAgendamentoPorId(
  agendamentoId: number,
  tutorId: number
) {
  const [rows]: any = await database.query(
    `
    SELECT 
      a.AGD_ID,
      a.TUT_ID,
      a.PET_ID,
      p.PET_NOME,
      p.PET_ESPECIE,
      p.PET_RACA,
      p.PET_SEXO,
      p.PET_PORTE,
      p.PET_PESO,
      p.PET_COR,
      p.PET_DTNASC,
      a.AGD_DATA,
      a.AGD_HORA,
      a.AGD_TIPO,
      a.AGD_SINTOMAS,
      a.AGD_VACINA,
      a.AGD_EXAME,
      a.AGD_AGENDAMENTO_REFERENCIA_ID,
      a.AGD_STATUS,
      a.AGD_OBSERVACOES,
      a.AGD_CANCELADO_EM,
      a.AGD_MOTIVO_CANCELAMENTO,
      a.AGD_CREATED_AT,
      a.AGD_UPDATED_AT
    FROM agendamentos a
    INNER JOIN pets p ON a.PET_ID = p.PET_ID
    WHERE a.AGD_ID = ?
      AND a.TUT_ID = ?
    `,
    [agendamentoId, tutorId]
  );

  return rows[0];
}

// ==== CRIAR AGENDAMENTO ====
// Cria um novo agendamento para um pet do tutor autenticado
export async function criarAgendamento(dados: any) {
  const {
    TUT_ID,
    PET_ID,
    AGD_DATA,
    AGD_HORA,
    AGD_TIPO,
    AGD_SINTOMAS,
    AGD_VACINA,
    AGD_EXAME,
    AGD_AGENDAMENTO_REFERENCIA_ID,
    AGD_OBSERVACOES,
  } = dados;

  const [result]: any = await database.query(
    `
    INSERT INTO agendamentos (
      TUT_ID,
      PET_ID,
      AGD_DATA,
      AGD_HORA,
      AGD_TIPO,
      AGD_SINTOMAS,
      AGD_VACINA,
      AGD_EXAME,
      AGD_AGENDAMENTO_REFERENCIA_ID,
      AGD_STATUS,
      AGD_OBSERVACOES
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'AGENDADO', ?)
    `,
    [
      TUT_ID,
      PET_ID,
      AGD_DATA,
      AGD_HORA,
      AGD_TIPO,
      AGD_SINTOMAS || null,
      AGD_VACINA || null,
      AGD_EXAME || null,
      AGD_AGENDAMENTO_REFERENCIA_ID || null,
      AGD_OBSERVACOES || null,
    ]
  );

  return {
    AGD_ID: result.insertId,
    TUT_ID,
    PET_ID,
    AGD_DATA,
    AGD_HORA,
    AGD_TIPO,
    AGD_SINTOMAS: AGD_SINTOMAS || null,
    AGD_VACINA: AGD_VACINA || null,
    AGD_EXAME: AGD_EXAME || null,
    AGD_AGENDAMENTO_REFERENCIA_ID:
      AGD_AGENDAMENTO_REFERENCIA_ID || null,
    AGD_STATUS: "AGENDADO",
    AGD_OBSERVACOES: AGD_OBSERVACOES || null,
    AGD_CANCELADO_EM: null,
    AGD_MOTIVO_CANCELAMENTO: null,
  };
}

// ==== ATUALIZAR AGENDAMENTO ====
// Atualiza um agendamento existente do tutor autenticado
export async function atualizarAgendamento(
  agendamentoId: number,
  tutorId: number,
  dados: any
) {
  const {
    PET_ID,
    AGD_DATA,
    AGD_HORA,
    AGD_TIPO,
    AGD_SINTOMAS,
    AGD_VACINA,
    AGD_EXAME,
    AGD_AGENDAMENTO_REFERENCIA_ID,
    AGD_OBSERVACOES,
  } = dados;

  const [result]: any = await database.query(
    `
    UPDATE agendamentos
    SET 
      PET_ID = ?,
      AGD_DATA = ?,
      AGD_HORA = ?,
      AGD_TIPO = ?,
      AGD_SINTOMAS = ?,
      AGD_VACINA = ?,
      AGD_EXAME = ?,
      AGD_AGENDAMENTO_REFERENCIA_ID = ?,
      AGD_OBSERVACOES = ?
    WHERE AGD_ID = ?
      AND TUT_ID = ?
      AND AGD_STATUS <> 'CANCELADO'
    `,
    [
      PET_ID,
      AGD_DATA,
      AGD_HORA,
      AGD_TIPO,
      AGD_SINTOMAS || null,
      AGD_VACINA || null,
      AGD_EXAME || null,
      AGD_AGENDAMENTO_REFERENCIA_ID || null,
      AGD_OBSERVACOES || null,
      agendamentoId,
      tutorId,
    ]
  );

  return result.affectedRows > 0;
}

// ==== CANCELAR AGENDAMENTO ====
// Cancela um agendamento do tutor autenticado sem excluir o histórico
export async function cancelarAgendamento(
  agendamentoId: number,
  tutorId: number,
  motivoCancelamento?: string | null
) {
  const [result]: any = await database.query(
    `
    UPDATE agendamentos
    SET 
      AGD_STATUS = 'CANCELADO',
      AGD_CANCELADO_EM = NOW(),
      AGD_MOTIVO_CANCELAMENTO = ?
    WHERE AGD_ID = ?
      AND TUT_ID = ?
      AND AGD_STATUS <> 'CANCELADO'
    `,
    [motivoCancelamento || null, agendamentoId, tutorId]
  );

  return result.affectedRows > 0;
}

// ==== CONCLUIR AGENDAMENTO ====
// Marca um agendamento como concluído
export async function concluirAgendamento(
  agendamentoId: number,
  tutorId: number
) {
  const [result]: any = await database.query(
    `
    UPDATE agendamentos
    SET 
      AGD_STATUS = 'CONCLUIDO'
    WHERE AGD_ID = ?
      AND TUT_ID = ?
      AND AGD_STATUS = 'AGENDADO'
    `,
    [agendamentoId, tutorId]
  );

  return result.affectedRows > 0;
}

// ==== EXCLUIR AGENDAMENTO ====
// Mantido apenas para não quebrar o fluxo atual.
// No fluxo normal do tutor, ele cancela o agendamento em vez de deletar.
export async function excluirAgendamento(
  agendamentoId: number,
  tutorId: number
) {
  const [result]: any = await database.query(
    `
    UPDATE agendamentos
    SET 
      AGD_STATUS = 'CANCELADO',
      AGD_CANCELADO_EM = NOW(),
      AGD_MOTIVO_CANCELAMENTO = 'Cancelado pelo tutor'
    WHERE AGD_ID = ?
      AND TUT_ID = ?
      AND AGD_STATUS <> 'CANCELADO'
    `,
    [agendamentoId, tutorId]
  );

  return result.affectedRows > 0;
}