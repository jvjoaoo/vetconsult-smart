import { Router } from "express";
import {
  listarAgendamentos,
  buscarAgendamentoPorId,
  criarAgendamento,
  atualizarAgendamento,
  cancelarAgendamento,
  concluirAgendamento,
  excluirAgendamento,
  contarAgendamentosAtivosAdmin,
} from "../controllers/agendamentoController";
import {
  verificarTokenTutor,
  verificarTokenAdmin,
} from "../middlewares/authMiddleware";

const router = Router();

// ==== ROTAS ADMIN ====
// Conta todos os agendamentos ativos do sistema
router.get(
  "/agendamentos/admin/total-ativos",
  verificarTokenAdmin,
  contarAgendamentosAtivosAdmin
);

// ==== ROTAS DE AGENDAMENTOS ====
// CRUD de agendamentos vinculado ao tutor autenticado

// Lista todos os agendamentos do tutor logado
router.get("/agendamentos", verificarTokenTutor, listarAgendamentos);

// Busca um agendamento específico do tutor logado
router.get("/agendamentos/:id", verificarTokenTutor, buscarAgendamentoPorId);

// Cria um novo agendamento para um pet do tutor logado
router.post("/agendamentos", verificarTokenTutor, criarAgendamento);

// Atualiza um agendamento marcado do tutor logado
router.put("/agendamentos/:id", verificarTokenTutor, atualizarAgendamento);

// Cancela um agendamento do tutor logado sem excluir o histórico
router.patch(
  "/agendamentos/:id/cancelar",
  verificarTokenTutor,
  cancelarAgendamento
);

// Marca um agendamento como concluído
router.patch(
  "/agendamentos/:id/concluir",
  verificarTokenTutor,
  concluirAgendamento
);

// Mantido para compatibilidade com o fluxo atual
// No service, essa rota também cancela o agendamento em vez de deletar
router.delete("/agendamentos/:id", verificarTokenTutor, excluirAgendamento);

export default router;