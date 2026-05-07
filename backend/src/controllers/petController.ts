import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { ResultSetHeader } from "mysql2";

import {
  listarPets,
  buscarPetPorId,
  criarPet,
  atualizarPet,
  deletarPet,
} from "../services/petService";

export async function getPets(req: AuthRequest, res: Response) {
  try {
    const tutorId = req.tutor?.id;

    if (!tutorId) {
      res.status(401).json({ message: "Tutor não identificado." });
      return;
    }

    const pets = (await listarPets(tutorId)) as any[];

    if (pets.length === 0) {
      res.json({
        message: "Nenhum pet cadastrado até o momento.",
        pets: [],
      });
      return;
    }

    res.json({
      message: "Pets encontrados com sucesso.",
      pets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar pets",
      error,
    });
  }
}

export async function getPetPorId(req: AuthRequest, res: Response) {
  try {
    const tutorId = req.tutor?.id;
    const id = Number(req.params.id);

    if (!tutorId) {
      res.status(401).json({ message: "Tutor não identificado." });
      return;
    }

    if (!id) {
      res.status(400).json({ message: "ID do pet inválido." });
      return;
    }

    const pet = await buscarPetPorId(id, tutorId) as any[];

    if (pet.length === 0) {
      res.status(404).json({
        message: "Pet não encontrado ou não pertence ao tutor logado.",
      });
      return;
    }

    res.json(pet[0]);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar pet",
      error,
    });
  }
}

export async function postPet(req: AuthRequest, res: Response) {
  try {
    const tutorId = req.tutor?.id;

    if (!tutorId) {
      res.status(401).json({ message: "Tutor não identificado." });
      return;
    }

    const {
      PET_NOME,
      PET_ESPECIE,
      PET_RACA,
      PET_SEXO,
      PET_PORTE,
      PET_PESO,
      PET_COR,
      PET_DTNASC,
    } = req.body;

    if (!PET_NOME || !PET_ESPECIE || !PET_SEXO) {
      res.status(400).json({
        message: "Nome, espécie e sexo do pet são obrigatórios.",
      });
      return;
    }

    const dadosPet = {
      PET_NOME,
      PET_ESPECIE,
      PET_RACA: PET_RACA || null,
      PET_SEXO,
      PET_PORTE: PET_PORTE || null,
      PET_PESO: PET_PESO || null,
      PET_COR: PET_COR || null,
      PET_DTNASC: PET_DTNASC || null,
      PET_TUTOR_ID: tutorId,
    };

    const petCriado = await criarPet(dadosPet);

    res.status(201).json({
      message: "Pet cadastrado com sucesso.",
      pet: petCriado,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao cadastrar pet",
      error,
    });
  }
}

export async function putPet(req: AuthRequest, res: Response) {
  try {
    const tutorId = req.tutor?.id;
    const id = Number(req.params.id);

    if (!tutorId) {
      res.status(401).json({ message: "Tutor não identificado." });
      return;
    }

    if (!id) {
      res.status(400).json({ message: "ID do pet inválido." });
      return;
    }

    const {
      PET_NOME,
      PET_ESPECIE,
      PET_RACA,
      PET_SEXO,
      PET_PORTE,
      PET_PESO,
      PET_COR,
      PET_DTNASC,
    } = req.body;

    if (!PET_NOME || !PET_ESPECIE || !PET_SEXO) {
      res.status(400).json({
        message: "Nome, espécie e sexo do pet são obrigatórios.",
      });
      return;
    }

    const dadosPet = {
      PET_NOME,
      PET_ESPECIE,
      PET_RACA: PET_RACA || null,
      PET_SEXO,
      PET_PORTE: PET_PORTE || null,
      PET_PESO: PET_PESO || null,
      PET_COR: PET_COR || null,
      PET_DTNASC: PET_DTNASC || null,
    };

    const petAtualizado = (await atualizarPet(
      id,
      tutorId,
      dadosPet
    )) as ResultSetHeader;

    if (petAtualizado.affectedRows === 0) {
      res.status(404).json({
        message: "Pet não encontrado ou não pertence ao tutor logado.",
      });
      return;
    }

    res.json({
      message: "Pet atualizado com sucesso.",
      pet: petAtualizado,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar pet",
      error,
    });
  }
}

export async function deletePet(req: AuthRequest, res: Response) {
  try {
    const tutorId = req.tutor?.id;
    const id = Number(req.params.id);

    if (!tutorId) {
      res.status(401).json({ message: "Tutor não identificado." });
      return;
    }

    if (!id) {
      res.status(400).json({ message: "ID do pet inválido." });
      return;
    }

    const petDeletado = (await deletarPet(
      id,
      tutorId
    )) as ResultSetHeader;

    if (petDeletado.affectedRows === 0) {
      res.status(404).json({
        message: "Pet não encontrado ou não pertence ao tutor logado.",
      });
      return;
    }

    res.json({
      message: "Pet removido com sucesso.",
      pet: petDeletado,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover pet",
      error,
    });
  }
}