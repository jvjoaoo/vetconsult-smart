// ==== FUNCIONALIDADE petRoutes.ts ====
// Mapear URLs → para funções do controller
// Definir como a API responde a cada requisição HTTP

import { Router } from "express";

import {
  getPets,
  getPetPorId,
  getTotalPets,
  postPet,
  putPet,
  deletePet,
} from "../controllers/petController";

import {
  verificarTokenTutor,
  verificarTokenAdmin,
} from "../middlewares/authMiddleware";

const router = Router();

// == Total de pets para dashboard admin ==
// Importante: essa rota precisa vir antes de "/pets/:id"
router.get("/pets/total", verificarTokenAdmin, getTotalPets);

// == Listar pets do tutor logado ==
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