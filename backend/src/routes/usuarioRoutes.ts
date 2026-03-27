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
import { verificarTokenAdmin } from "../middlewares/authMiddleware";

const router = Router();

// == Listar usuários ==
router.get("/usuarios_admin", verificarTokenAdmin, getUsuarios);
router.get("/usuarios_admin/:id", verificarTokenAdmin, getUsuarioPorId);
// == Criar usuário ==
router.post("/usuarios_admin", verificarTokenAdmin, postUsuario);
// == Atualizar usuário ==
router.put("/usuarios_admin/:id", verificarTokenAdmin, putUsuario);
// == Remover usuário ==
router.delete("/usuarios_admin/:id", verificarTokenAdmin, deleteUsuario);

export default router;


