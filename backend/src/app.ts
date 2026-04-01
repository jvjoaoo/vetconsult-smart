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
app.use(tutorRoutes);
app.use(authTutorRoutes);

export default app;



