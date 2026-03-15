const apiUrl = "http://localhost:3000/usuarios_admin";

const form = document.getElementById("editarUsuarioForm");
const campoNome = document.getElementById("USR_NAME");
const campoEmail = document.getElementById("USR_EMAIL");
const campoTelefone = document.getElementById("USR_TELEFONE");
const campoDataNascimento = document.getElementById("USR_DTNASC");
const campoSenha = document.getElementById("USR_SENHA");


function obterIdDaUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function carregarUsuario() {
  const id = obterIdDaUrl();

  if (!id) {
    alert("ID do usuário não informado.");
    window.location.href = "./admin-usuarios.html";
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${id}`);

    if (!response.ok) {
      throw new Error("Usuário não encontrado");
    }

    const usuario = await response.json();

    campoNome.value = usuario.USR_NAME || "";
    campoEmail.value = usuario.USR_EMAIL || "";
    campoTelefone.value = usuario.USR_TELEFONE || "";
    campoDataNascimento.value = usuario.USR_DTNASC
      ? usuario.USR_DTNASC.split("T")[0]
      : "";
    campoSenha.value = usuario.USR_SENHA || "";
  } catch (error) {
    console.error("Erro ao carregar usuário:", error);
    alert("Não foi possível carregar os dados do usuário.");
    window.location.href = "./admin-usuarios.html";
  }
}

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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = obterIdDaUrl();

  const usuario = {
    USR_NAME: campoNome.value,
    USR_EMAIL: campoEmail.value,
    USR_TELEFONE: campoTelefone.value,
    USR_DTNASC: campoDataNascimento.value,
    USR_SENHA: campoSenha.value
  };

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuario)
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar usuário");
    }

    alert("Usuário atualizado com sucesso!");
    window.location.href = "./admin-usuarios.html";
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    alert("Não foi possível atualizar o usuário.");
  }
});

carregarUsuario();