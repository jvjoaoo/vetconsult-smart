import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as agendamentoService from "../services/agendamentoService";

// ==== LISTAR AGENDAMENTOS ====
export const listarAgendamentos = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const agendamentos = await agendamentoService.listarAgendamentos(tutorId);

    res.status(200).json(agendamentos);
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    res.status(500).json({ mensagem: "Erro ao listar agendamentos." });
  }
};

// ==== BUSCAR AGENDAMENTO POR ID ====
export const buscarAgendamentoPorId = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;
    const agendamentoId = Number(req.params.id);

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const agendamento = await agendamentoService.buscarAgendamentoPorId(
      agendamentoId,
      tutorId
    );

    if (!agendamento) {
      res.status(404).json({ mensagem: "Agendamento não encontrado." });
      return;
    }

    res.status(200).json(agendamento);
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    res.status(500).json({ mensagem: "Erro ao buscar agendamento." });
  }
};

// ==== CRIAR AGENDAMENTO ====
export const criarAgendamento = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const novoAgendamento = await agendamentoService.criarAgendamento({
      ...req.body,
      TUT_ID: tutorId,
    });

    res.status(201).json({
      mensagem: "Agendamento criado com sucesso.",
      agendamento: novoAgendamento,
    });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({ mensagem: "Erro ao criar agendamento." });
  }
};

// ==== ATUALIZAR AGENDAMENTO ====
export const atualizarAgendamento = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;
    const agendamentoId = Number(req.params.id);

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const atualizado = await agendamentoService.atualizarAgendamento(
      agendamentoId,
      tutorId,
      req.body
    );

    if (!atualizado) {
      res.status(404).json({
        mensagem:
          "Agendamento não encontrado ou não pode ser atualizado.",
      });
      return;
    }

    res.status(200).json({
      mensagem: "Agendamento atualizado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    res.status(500).json({ mensagem: "Erro ao atualizar agendamento." });
  }
};

// ==== CANCELAR AGENDAMENTO ====
// Cancela sem excluir o registro do banco
export const cancelarAgendamento = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;
    const agendamentoId = Number(req.params.id);
    const { motivoCancelamento, motivo } = req.body;

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const cancelado = await agendamentoService.cancelarAgendamento(
      agendamentoId,
      tutorId,
      motivoCancelamento || motivo || "Cancelado pelo tutor"
    );

    if (!cancelado) {
      res.status(404).json({
        mensagem:
          "Agendamento não encontrado ou já está cancelado.",
      });
      return;
    }

    res.status(200).json({
      mensagem: "Agendamento cancelado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    res.status(500).json({ mensagem: "Erro ao cancelar agendamento." });
  }
};

// ==== CONCLUIR AGENDAMENTO ====
export const concluirAgendamento = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;
    const agendamentoId = Number(req.params.id);

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const concluido = await agendamentoService.concluirAgendamento(
      agendamentoId,
      tutorId
    );

    if (!concluido) {
      res.status(404).json({
        mensagem:
          "Agendamento não encontrado ou não pode ser concluído.",
      });
      return;
    }

    res.status(200).json({
      mensagem: "Agendamento concluído com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao concluir agendamento:", error);
    res.status(500).json({ mensagem: "Erro ao concluir agendamento." });
  }
};

// ==== EXCLUIR AGENDAMENTO ====
// Mantido com o mesmo nome para não quebrar a rota atual.
// Agora ele cancela o agendamento em vez de deletar.
export const excluirAgendamento = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;
    const agendamentoId = Number(req.params.id);

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const cancelado = await agendamentoService.excluirAgendamento(
      agendamentoId,
      tutorId
    );

    if (!cancelado) {
      res.status(404).json({
        mensagem:
          "Agendamento não encontrado ou já está cancelado.",
      });
      return;
    }

    res.status(200).json({
      mensagem: "Agendamento cancelado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    res.status(500).json({ mensagem: "Erro ao cancelar agendamento." });
  }
};