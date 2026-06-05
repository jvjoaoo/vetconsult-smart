import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ==== FUNCIONALIDADE usuarioRoutes.ts ====
// Mapear URLs → para funções do controller
// Definir como a API responde a cada requisição HTTP

// importação das rotas.
import usuarioRoutes from "./routes/usuarioRoutes";
import authRoutes from "./routes/authRoutes";
import tutorRoutes from "./routes/tutorRoutes";
import authTutorRoutes from "./routes/authTutorRoutes";
import petRoutes from "./routes/petRoutes";
import agendamentoRoutes from "./routes/agendamentoRoutes";
import prontuarioRoutes from "./routes/prontuarioRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ==== ROTAS DE AUTENTICAÇÃO ====
// Responsável pelo login do administrador
app.use(authRoutes);

// ==== ROTAS DE USUÁRIOS ADMIN ====
// Protegidas por autenticação (middleware verificarTokenAdmin)
app.use(usuarioRoutes);

// ==== ROTAS DE USUÁRIOS TUTORES ====
// Responsável pelo cadastro, listagem, atualização e exclusão de tutores
app.use(tutorRoutes);

// ==== ROTAS DE AUTENTICAÇÃO DOS TUTORES ====
// Responsável pelo login dos tutores
app.use(authTutorRoutes);

// ==== ROTAS DE PETS ====
// CRUD de pets vinculado ao tutor autenticado
app.use(petRoutes);

// ==== ROTAS DE AGENDAMENTOS ====
// CRUD de agendamentos vinculado ao tutor autenticado
// Permite criar, listar, atualizar e excluir agendamentos dos pets
app.use(agendamentoRoutes);

// ==== ROTAS DE PRONTUÁRIOS ====
// CRUD de prontuários vinculado aos agendamentos, tutores e pets
// Permite registrar informações clínicas após o atendimento
app.use(prontuarioRoutes);

export default app;