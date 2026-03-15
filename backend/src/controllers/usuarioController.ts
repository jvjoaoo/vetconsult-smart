//1. Recebe uma requisição para listar usuários
//2. Chama o service que consulta o banco
//3. Se der certo, devolve os usuários em JSON
//4. Se der erro, devolve status 500 com mensagem de erro

import { Request, Response } from "express";

// Importando as funções do banco
// Controller → chama Service 
// Service    → fala com banco
import {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario
} from "../services/usuarioService";

export async function getUsuarios(_req: Request, res: Response) {
  try {
    const usuarios = await listarUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar usuários",
      error
    });
  }
}

export async function getUsuarioPorId(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const usuario = await buscarUsuarioPorId(id);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado"
      });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar usuário",
      error
    });
  }
}

export async function postUsuario(req: Request, res: Response) {
  try {
    const usuario = req.body;

    await criarUsuario(usuario);

    res.status(201).json({
      message: "Usuário criado com sucesso"
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar usuário",
      error
    });
  }
}

export async function putUsuario(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const usuario = req.body;

    await atualizarUsuario(id, usuario);

    res.json({
      message: "Usuário atualizado com sucesso"
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar usuário",
      error
    });
  }
}

export async function deleteUsuario(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await deletarUsuario(id);

    res.json({
      message: "Usuário removido com sucesso"
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar usuário",
      error
    });
  }
}

