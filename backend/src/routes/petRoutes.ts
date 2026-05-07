// ==== FUNCIONALIDADE petRoutes.ts ====
// Mapear URLs → para funções do controller
// Definir como a API responde a cada requisição HTTP

import { Router } from "express";

import {
  getPets,
  getPetPorId,
  postPet,
  putPet,
  deletePet
} from "../controllers/petController";

import { verificarTokenTutor } from "../middlewares/authMiddleware";

const router = Router();

// == Listar pets ==
router.get("/pets", verificarTokenTutor, getPets);

// == Buscar pet por ID ==
router.get("/pets/:id", verificarTokenTutor, getPetPorId);

// == Criar pet ==
router.post("/pets", verificarTokenTutor, postPet);

// == Atualizar pet ==
router.put("/pets/:id", verificarTokenTutor, putPet);

// == Remover pet ==
router.delete("/pets/:id", verificarTokenTutor, deletePet);

export default router;