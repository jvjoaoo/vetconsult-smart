import { Request, Response } from "express";
import {
  listarTutores,
  buscarTutorPorId,
  buscarTutorPorEmail,
  criarTutor,
  atualizarTutor,
  atualizarStatusTutor,
  deletarTutor
} from "../services/tutorService";
import { hashPassword, validatePasswordStrength } from "../utils/password";

export async function getTutores(_req: Request, res: Response) {
  try {
    const tutores = await listarTutores();
    res.json(tutores);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar tutores",
      error
    });
  }
}

export async function getTutorPorId(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const tutor = await buscarTutorPorId(id);

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor não encontrado"
      });
    }

    res.json(tutor);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar tutor",
      error
    });
  }
}

export async function postTutor(req: Request, res: Response) {
  try {
    const {
        TUT_NOME,
        TUT_CPF,
        TUT_EMAIL,
        TUT_TELEFONE,
        TUT_DTNASC,
        TUT_SENHA
    } = req.body;

    if (!TUT_NOME || !TUT_CPF || !TUT_EMAIL || !TUT_TELEFONE || !TUT_SENHA) {
        return res.status(400).json({
            message: "Nome, CPF, e-mail, telefone e senha são obrigatórios"
        });
    }

    const tutorExistente = await buscarTutorPorEmail(TUT_EMAIL);

    if (tutorExistente) {
      return res.status(409).json({
        message: "Já existe um tutor com este e-mail"
      });
    }

    const validacaoSenha = validatePasswordStrength(TUT_SENHA);

    if (!validacaoSenha.isValid) {
      return res.status(400).json({
        message: validacaoSenha.message
      });
    }

    const senhaHash = await hashPassword(TUT_SENHA);

    const result = await criarTutor({
        TUT_NOME,
        TUT_CPF,
        TUT_EMAIL,
        TUT_TELEFONE,
        TUT_DTNASC,
        TUT_SENHA: senhaHash,
        TUT_STATUS: "ATIVO"
    });

    res.status(201).json({
      message: "Tutor cadastrado com sucesso",
      tutorId: result.insertId
    });
    } catch (error) {
    console.error("Erro ao cadastrar tutor:", error);

    res.status(500).json({
        message: "Erro ao cadastrar tutor",
        error: error instanceof Error ? error.message : error
    });
    }
}

export async function putTutor(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const {
        TUT_NOME,
        TUT_CPF,
        TUT_EMAIL,
        TUT_TELEFONE,
        TUT_DTNASC,
        TUT_SENHA
    } = req.body;

    const tutor = await buscarTutorPorId(id);

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor não encontrado"
      });
    }

    if (!TUT_NOME || !TUT_CPF || !TUT_EMAIL || !TUT_TELEFONE) {
    return res.status(400).json({
        message: "Nome, CPF, e-mail e telefone são obrigatórios"
    });
    }

    const tutorComMesmoEmail = await buscarTutorPorEmail(TUT_EMAIL);

    if (tutorComMesmoEmail && tutorComMesmoEmail.TUT_ID !== id) {
      return res.status(409).json({
        message: "Já existe outro tutor com este e-mail"
      });
    }

    let senhaHash: string | undefined = undefined;

    if (TUT_SENHA) {
      const validacaoSenha = validatePasswordStrength(TUT_SENHA);

      if (!validacaoSenha.isValid) {
        return res.status(400).json({
          message: validacaoSenha.message
        });
      }

      senhaHash = await hashPassword(TUT_SENHA);
    }

    await atualizarTutor(id, {
        TUT_NOME,
        TUT_CPF,
        TUT_EMAIL,
        TUT_TELEFONE,
        TUT_DTNASC,
        TUT_SENHA: senhaHash
    });

    res.json({
      message: "Tutor atualizado com sucesso"
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar tutor",
      error
    });
  }
}

export async function patchStatusTutor(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { TUT_STATUS } = req.body;

    if (!["ATIVO", "INATIVO"].includes(TUT_STATUS)) {
      return res.status(400).json({
        message: "Status inválido. Use ATIVO ou INATIVO"
      });
    }

    const tutor = await buscarTutorPorId(id);

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor não encontrado"
      });
    }

    await atualizarStatusTutor(id, TUT_STATUS);

    res.json({
      message: `Status do tutor alterado para ${TUT_STATUS}`
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar status do tutor",
      error
    });
  }
}

export async function deleteTutor(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const tutor = await buscarTutorPorId(id);

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor não encontrado"
      });
    }

    await deletarTutor(id);

    res.json({
      message: "Tutor removido permanentemente com sucesso"
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar tutor",
      error
    });
  }
}