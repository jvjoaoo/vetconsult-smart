// No terminal rodar os seguintes comandos para iniciar o servidor:
//cd backend
//npm run dev


// Criação das Rotas 
import express from "express"; // Importação do framework express
import cors from "cors";
import { database } from "./config/database"; //Importando a conexão com o banco
import usuarioRoutes from "./routes/usuarioRoutes";


const app = express();

app.use(cors({
  origin: "http://127.0.0.1:5500"
}));

app.use(express.json());

app.use(usuarioRoutes);



app.get("/", async (req, res) => {
  try {
    const [rows] = await database.query("SELECT 1");
    res.json({
      message: "Conexão com banco funcionando!",
      database: rows
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao conectar com banco",
      error
    });
  }
});

export default app;


