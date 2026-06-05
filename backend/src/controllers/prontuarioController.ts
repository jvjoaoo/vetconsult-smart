import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as prontuarioService from "../services/prontuarioService";

// ==== LISTAR PRONTUÁRIOS ====
// Retorna todos os prontuários vinculados ao tutor autenticado
export const listarProntuarios = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const prontuarios = await prontuarioService.listarProntuarios(tutorId);

    res.status(200).json(prontuarios);
  } catch (error) {
    console.error("Erro ao listar prontuários:", error);
    res.status(500).json({
      mensagem: "Erro ao listar prontuários.",
    });
  }
};

// ==== BUSCAR PRONTUÁRIO POR ID ====
// Retorna um prontuário específico vinculado ao tutor autenticado
export const buscarProntuarioPorId = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;
    const prontuarioId = Number(req.params.id);

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const prontuario = await prontuarioService.buscarProntuarioPorId(
      prontuarioId,
      tutorId
    );

    if (!prontuario) {
      res.status(404).json({
        mensagem: "Prontuário não encontrado.",
      });
      return;
    }

    res.status(200).json(prontuario);
  } catch (error) {
    console.error("Erro ao buscar prontuário:", error);
    res.status(500).json({
      mensagem: "Erro ao buscar prontuário.",
    });
  }
};

// ==== CRIAR PRONTUÁRIO ====
// Cria um prontuário vinculado ao tutor autenticado
export const criarProntuario = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const novoProntuario = await prontuarioService.criarProntuario({
      ...req.body,
      TUT_ID: tutorId,
    });

    res.status(201).json({
      mensagem: "Prontuário criado com sucesso.",
      prontuario: novoProntuario,
    });
  } catch (error) {
    console.error("Erro ao criar prontuário:", error);
    res.status(500).json({
      mensagem: "Erro ao criar prontuário.",
    });
  }
};

// ==== ATUALIZAR PRONTUÁRIO ====
// Atualiza um prontuário existente vinculado ao tutor autenticado
export const atualizarProntuario = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;
    const prontuarioId = Number(req.params.id);

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const atualizado = await prontuarioService.atualizarProntuario(
      prontuarioId,
      tutorId,
      req.body
    );

    if (!atualizado) {
      res.status(404).json({
        mensagem: "Prontuário não encontrado.",
      });
      return;
    }

    res.status(200).json({
      mensagem: "Prontuário atualizado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao atualizar prontuário:", error);
    res.status(500).json({
      mensagem: "Erro ao atualizar prontuário.",
    });
  }
};

// ==== EXCLUIR PRONTUÁRIO ====
// Exclui um prontuário vinculado ao tutor autenticado
export const excluirProntuario = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tutorId = req.tutor?.id;
    const prontuarioId = Number(req.params.id);

    if (!tutorId) {
      res.status(401).json({ mensagem: "Tutor não autenticado." });
      return;
    }

    const excluido = await prontuarioService.excluirProntuario(
      prontuarioId,
      tutorId
    );

    if (!excluido) {
      res.status(404).json({
        mensagem: "Prontuário não encontrado.",
      });
      return;
    }

    res.status(200).json({
      mensagem: "Prontuário excluído com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir prontuário:", error);
    res.status(500).json({
      mensagem: "Erro ao excluir prontuário.",
    });
  }
};