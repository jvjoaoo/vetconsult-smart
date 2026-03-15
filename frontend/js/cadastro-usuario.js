const apiUrl = "http://localhost:3000/usuarios_admin";

const usuarioForm = document.getElementById("usuarioForm");

const campoNome = document.getElementById("USR_NAME");
const campoEmail = document.getElementById("USR_EMAIL");
const campoContato = document.getElementById("USR_TELEFONE");
const campoDataNascimento = document.getElementById("USR_DTNASC");
const campoSenha = document.getElementById("USR_SENHA");
const campoTelefone = document.getElementById("USR_TELEFONE");

function aplicarMascaraTelefone(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 7) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

campoTelefone.addEventListener("input", (event) => {
  event.target.value = aplicarMascaraTelefone(event.target.value);
});

usuarioForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const usuario = {
    USR_NAME: campoNome.value,
    USR_EMAIL: campoEmail.value,
    USR_TELEFONE: campoContato.value,
    USR_DTNASC: campoDataNascimento.value,
    USR_SENHA: campoSenha.value
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuario)
    });

    if (!response.ok) {
      throw new Error("Erro ao cadastrar usuário");
    }

    alert("Usuário cadastrado com sucesso!");
    usuarioForm.reset();

    window.location.href = "./admin-usuarios.html";
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    alert("Não foi possível cadastrar o usuário.");
  }
});