const apiUrl = "http://localhost:3000/usuarios_admin";

const usuarioForm = document.getElementById("usuarioForm");
const campoNome = document.getElementById("USR_NAME");
const campoEmail = document.getElementById("USR_EMAIL");
const campoTelefone = document.getElementById("USR_TELEFONE");
const campoDataNascimento = document.getElementById("USR_DTNASC");
const campoSenha = document.getElementById("USR_SENHA");

function obterToken() {
  return localStorage.getItem("token");
}

function redirecionarParaLogin() {
  localStorage.removeItem("token");
  window.location.href = "./login-admin.html";
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

if (!usuarioForm || !campoNome || !campoEmail || !campoTelefone || !campoDataNascimento || !campoSenha) {
  console.error("Um ou mais elementos do formulário não foram encontrados no HTML.");
} else {
  campoTelefone.addEventListener("input", (event) => {
    event.target.value = aplicarMascaraTelefone(event.target.value);
  });

  usuarioForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = obterToken();

    if (!token) {
      alert("Você precisa estar logado para cadastrar um usuário.");
      redirecionarParaLogin();
      return;
    }

    const usuario = {
      USR_NAME: campoNome.value.trim(),
      USR_EMAIL: campoEmail.value.trim(),
      USR_TELEFONE: campoTelefone.value.trim(),
      USR_DTNASC: campoDataNascimento.value,
      USR_SENHA: campoSenha.value.trim(),
    };

    if (
      !usuario.USR_NAME ||
      !usuario.USR_EMAIL ||
      !usuario.USR_TELEFONE ||
      !usuario.USR_DTNASC ||
      !usuario.USR_SENHA
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
      });

      if (response.status === 401 || response.status === 403) {
        alert("Sessão expirada. Faça login novamente.");
        redirecionarParaLogin();
        return;
      }

      const respostaJson = await response.json().catch(() => null);

      if (!response.ok) {
        const mensagem = respostaJson?.mensagem || `Erro ao cadastrar usuário: ${response.status}`;
        throw new Error(mensagem);
      }

      alert("Usuário cadastrado com sucesso!");
      usuarioForm.reset();
      window.location.href = "./admin-usuarios.html";
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert(error.message || "Não foi possível cadastrar o usuário.");
    }
  });
}