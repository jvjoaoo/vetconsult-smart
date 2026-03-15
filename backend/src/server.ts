// Subindo o servidor

import app from "./app"; // Importa a aplicação configurada no app.ts.

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});