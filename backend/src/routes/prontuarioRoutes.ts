import { Router } from "express";
import {
  listarProntuarios,
  buscarProntuarioPorId,
  criarProntuario,
  atualizarProntuario,
  excluirProntuario,
} from "../controllers/prontuarioController";
import { verificarTokenTutor } from "../middlewares/authMiddleware";

const router = Router();

// ==== ROTAS DE PRONTUÁRIOS ====
// CRUD de prontuários vinculado ao tutor autenticado

// Lista todos os prontuários do tutor logado
router.get("/prontuarios", verificarTokenTutor, listarProntuarios);

// Busca um prontuário específico do tutor logado
router.get("/prontuarios/:id", verificarTokenTutor, buscarProntuarioPorId);

// Cria um novo prontuário vinculado a um agendamento
router.post("/prontuarios", verificarTokenTutor, criarProntuario);

// Atualiza um prontuário existente do tutor logado
router.put("/prontuarios/:id", verificarTokenTutor, atualizarProntuario);

// Exclui um prontuário existente do tutor logado
router.delete("/prontuarios/:id", verificarTokenTutor, excluirProntuario);

export default router;