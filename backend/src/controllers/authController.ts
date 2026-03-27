import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { database } from "../config/database";

const TABELA_ADMIN = "usuarios_admin";

const COL_ID = "USR_ID";
const COL_NOME = "USR_NAME";
const COL_EMAIL = "USR_EMAIL";
const COL_SENHA = "USR_SENHA";

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    res.status(400).json({
      erro: "E-mail e senha são obrigatórios."
    });
    return;
  }

  const sql = `
    SELECT 
      ${COL_ID} AS id,
      ${COL_NOME} AS nome,
      ${COL_EMAIL} AS email,
      ${COL_SENHA} AS senha
    FROM ${TABELA_ADMIN}
    WHERE ${COL_EMAIL} = ?
    LIMIT 1
  `;

  try {
    const [rows] = await database.query(sql, [email]);
    const results = rows as any[];

    if (!results || results.length === 0) {
      res.status(401).json({
        erro: "Credenciais inválidas."
      });
      return;
    }

    const admin = results[0];

    const senhaValida = await bcrypt.compare(senha, admin.senha);

    if (!senhaValida) {
      res.status(401).json({
        erro: "Credenciais inválidas."
      });
      return;
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        perfil: "admin"
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        perfil: "admin"
      }
    });
  } catch (error) {
    console.error("Erro no login admin:", error);
    res.status(500).json({
      erro: "Erro interno no servidor."
    });
  }
};