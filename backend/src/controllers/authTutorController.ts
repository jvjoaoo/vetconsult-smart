import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { buscarTutorLoginPorEmail } from "../services/tutorService";
import { comparePassword } from "../utils/password";

export async function loginTutor(req: Request, res: Response) {
  try {
    const { TUT_EMAIL, TUT_SENHA } = req.body;

    if (!TUT_EMAIL || !TUT_SENHA) {
      return res.status(400).json({
        message: "E-mail e senha são obrigatórios",
      });
    }

    const tutor = await buscarTutorLoginPorEmail(TUT_EMAIL);

    if (!tutor) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos",
      });
    }

    const senhaCorreta = await comparePassword(TUT_SENHA, tutor.TUT_SENHA);

    if (!senhaCorreta) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos",
      });
    }

    if (tutor.TUT_STATUS === "INATIVO") {
      return res.status(200).json({
        message: "Conta inativa. Deseja reativá-la?",
        contaInativa: true,
        tutor: {
          TUT_ID: tutor.TUT_ID,
          TUT_NOME: tutor.TUT_NOME,
          TUT_EMAIL: tutor.TUT_EMAIL,
          TUT_STATUS: tutor.TUT_STATUS,
        },
      });
    }

    if (tutor.TUT_STATUS !== "ATIVO") {
      return res.status(403).json({
        message: "Sua conta não está disponível para acesso",
      });
    }

    const token = jwt.sign(
      {
        id: tutor.TUT_ID,
        email: tutor.TUT_EMAIL,
        perfil: "tutor",
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      tutor: {
        TUT_ID: tutor.TUT_ID,
        TUT_NOME: tutor.TUT_NOME,
        TUT_EMAIL: tutor.TUT_EMAIL,
        TUT_STATUS: tutor.TUT_STATUS,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao realizar login do tutor",
      error,
    });
  }
}