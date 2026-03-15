// ==== FUNCIONALIDADE usuarioRoutes.ts ====
// Mapear URLs → para funções do controller
// Definir como a API responde a cada requisição HTTP


// importação das funções.
import { Router } from "express";
import {
  getUsuarios,
  getUsuarioPorId,
  postUsuario,
  putUsuario,
  deleteUsuario
} from "../controllers/usuarioController";

const router = Router();

// == Listar usuários ==
router.get("/usuarios_admin", getUsuarios);
router.get("/usuarios_admin/:id", getUsuarioPorId);
// == Criar usuário ==
router.post("/usuarios_admin", postUsuario);
// == Atualizar usuário ==
router.put("/usuarios_admin/:id", putUsuario);
// == Remover usuário ==
router.delete("/usuarios_admin/:id", deleteUsuario);

export default router;