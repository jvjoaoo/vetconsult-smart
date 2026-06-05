import { Router } from "express";
import {
  listarAgendamentos,
  buscarAgendamentoPorId,
  criarAgendamento,
  atualizarAgendamento,
  excluirAgendamento,
} from "../controllers/agendamentoController";
import { verificarTokenTutor } from "../middlewares/authMiddleware";

const router = Router();

// ==== ROTAS DE AGENDAMENTOS ====
// CRUD de agendamentos vinculado ao tutor autenticado

// Lista todos os agendamentos do tutor logado
router.get("/agendamentos", verificarTokenTutor, listarAgendamentos);

// Busca um agendamento específico do tutor logado
router.get("/agendamentos/:id", verificarTokenTutor, buscarAgendamentoPorId);

// Cria um novo agendamento para um pet do tutor logado
router.post("/agendamentos", verificarTokenTutor, criarAgendamento);

// Atualiza um agendamento existente do tutor logado
router.put("/agendamentos/:id", verificarTokenTutor, atualizarAgendamento);

// Exclui um agendamento existente do tutor logado
router.delete("/agendamentos/:id", verificarTokenTutor, excluirAgendamento);

export default router;