import mysql from "mysql2/promise"; //Importa a biblioteca que permite o Node conversar com o MySQL.
import dotenv from "dotenv"; //Importa a biblioteca que lê o arquivo .env.

dotenv.config(); //carrega as variáveis do .env para dentro de process.env.
/* === TESTES ===
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
*/


//Criação do pool de conexões.
export const database = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

