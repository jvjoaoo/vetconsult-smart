import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  usuario?: {
    id: number;
    email: string;
    perfil: string;
  };
}

export function verificarTokenAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ erro: "Token não informado." });
    return;
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    res.status(401).json({ erro: "Token inválido." });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthRequest["usuario"];

    if (!decoded || decoded.perfil !== "admin") {
      res.status(403).json({ erro: "Acesso permitido apenas para administradores." });
      return;
    }

    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ erro: "Token expirado ou inválido." });
  }
}