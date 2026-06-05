import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as agendamentoService from "../services/agendamentoService";

// ==== LISTAR AGENDAMENTOS ====
// Retorna todos os agendamentos do tutor autenticado
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
    res.status(500).json({
      mensagem: "Erro ao listar agendamentos.",
    });
  }
};

// ==== BUSCAR AGENDAMENTO POR ID ====
// Retorna um agendamento específico do tutor autenticado
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
      res.status(404).json({
        mensagem: "Agendamento não encontrado.",
      });
      return;
    }

    res.status(200).json(agendamento);
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    res.status(500).json({
      mensagem: "Erro ao buscar agendamento.",
    });
  }
};

// ==== CRIAR AGENDAMENTO ====
// Cria um novo agendamento para um pet do tutor autenticado
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
    res.status(500).json({
      mensagem: "Erro ao criar agendamento.",
    });
  }
};

// ==== ATUALIZAR AGENDAMENTO ====
// Atualiza um agendamento existente do tutor autenticado
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
        mensagem: "Agendamento não encontrado.",
      });
      return;
    }

    res.status(200).json({
      mensagem: "Agendamento atualizado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    res.status(500).json({
      mensagem: "Erro ao atualizar agendamento.",
    });
  }
};

// ==== EXCLUIR AGENDAMENTO ====
// Remove um agendamento do tutor autenticado
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

    const excluido = await agendamentoService.excluirAgendamento(
      agendamentoId,
      tutorId
    );

    if (!excluido) {
      res.status(404).json({
        mensagem: "Agendamento não encontrado.",
      });
      return;
    }

    res.status(200).json({
      mensagem: "Agendamento excluído com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    res.status(500).json({
      mensagem: "Erro ao excluir agendamento.",
    });
  }
};