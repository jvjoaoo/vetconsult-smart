import { database } from "../config/database";

export async function listarPets(tutorId: number) {
  const [rows] = await database.execute(
    `
    SELECT *
    FROM pets
    WHERE TUT_ID = ?
    `,
    [tutorId]
  );

  return rows;
}

export async function buscarPetPorId(id: number, tutorId: number) {
  const [rows] = await database.execute(
    `
    SELECT *
    FROM pets
    WHERE PET_ID = ?
    AND TUT_ID = ?
    `,
    [id, tutorId]
  );

  return rows;
}

export async function criarPet(dadosPet: any) {
  const [result] = await database.execute(
    `
    INSERT INTO pets (
      PET_NOME,
      PET_ESPECIE,
      PET_RACA,
      PET_SEXO,
      PET_PORTE,
      PET_PESO,
      PET_COR,
      PET_DTNASC,
      TUT_ID
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      dadosPet.PET_NOME,
      dadosPet.PET_ESPECIE,
      dadosPet.PET_RACA,
      dadosPet.PET_SEXO,
      dadosPet.PET_PORTE,
      dadosPet.PET_PESO,
      dadosPet.PET_COR,
      dadosPet.PET_DTNASC,
      dadosPet.TUT_ID,
    ]
  );

  return result;
}

export async function atualizarPet(
  id: number,
  tutorId: number,
  dadosPet: any
) {
  const [result] = await database.execute(
    `
    UPDATE pets
    SET
      PET_NOME = ?,
      PET_ESPECIE = ?,
      PET_RACA = ?,
      PET_SEXO = ?,
      PET_PORTE = ?,
      PET_PESO = ?,
      PET_COR = ?,
      PET_DTNASC = ?
    WHERE PET_ID = ?
    AND TUT_ID = ?
    `,
    [
      dadosPet.PET_NOME,
      dadosPet.PET_ESPECIE,
      dadosPet.PET_RACA,
      dadosPet.PET_SEXO,
      dadosPet.PET_PORTE,
      dadosPet.PET_PESO,
      dadosPet.PET_COR,
      dadosPet.PET_DTNASC,
      id,
      tutorId,
    ]
  );

  return result;
}

export async function deletarPet(id: number, tutorId: number) {
  const [result] = await database.execute(
    `
    DELETE FROM pets
    WHERE PET_ID = ?
    AND TUT_ID = ?
    `,
    [id, tutorId]
  );

  return result;
}