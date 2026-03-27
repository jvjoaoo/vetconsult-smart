const apiUrl = "http://localhost:3000";

function obterToken() {
  return localStorage.getItem("token");
}

function redirecionarParaLogin() {
  localStorage.removeItem("token");
  window.location.href = "./login-admin.html";
}

function obterElementosFormulario() {
  return {
    form: document.getElementById("editarUsuarioForm"),
    nome: document.getElementById("USR_NAME"),
    email: document.getElementById("USR_EMAIL"),
    telefone: document.getElementById("USR_TELEFONE"),
    dataNascimento: document.getElementById("USR_DTNASC"),
    senha: document.getElementById("USR_SENHA"),
  };
}

async function carregarUsuario() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const token = obterToken();

  if (!token) {
    alert("Você precisa estar logado.");
    redirecionarParaLogin();
    return;
  }

  if (!id) {
    alert("ID do usuário não informado.");
    window.location.href = "./admin-usuarios.html";
    return;
  }

  const { nome, email, telefone, dataNascimento, senha } =
    obterElementosFormulario();

  if (!nome || !email || !telefone || !dataNascimento || !senha) {
    console.error(
      "Um ou mais campos do formulário não foram encontrados no HTML.",
    );
    return;
  }

  try {
    const resposta = await fetch(`${apiUrl}/usuarios_admin/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (resposta.status === 401 || resposta.status === 403) {
      alert("Sessão expirada. Faça login novamente.");
      redirecionarParaLogin();
      return;
    }

    if (!resposta.ok) {
      const erroResposta = await resposta.json().catch(() => null);
      const mensagem =
        erroResposta?.mensagem ||
        `Erro ao carregar usuário: ${resposta.status}`;
      throw new Error(mensagem);
    }

    const usuario = await resposta.json();

    nome.value = usuario.USR_NAME || usuario.nome || "";
    email.value = usuario.USR_EMAIL || usuario.email || "";
    telefone.value = usuario.USR_TELEFONE || usuario.telefone || "";
    dataNascimento.value = usuario.USR_DTNASC || usuario.data_nascimento || "";
    senha.value = "";
  } catch (error) {
    console.error("Erro ao carregar usuário:", error);
    alert(error.message || "Erro ao carregar usuário.");
  }
}

async function atualizarUsuario(event) {
  event.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const token = obterToken();

  if (!token) {
    alert("Você precisa estar logado.");
    redirecionarParaLogin();
    return;
  }

  if (!id) {
    alert("ID do usuário não informado.");
    window.location.href = "./admin-usuarios.html";
    return;
  }

  const { nome, email, telefone, dataNascimento, senha } =
    obterElementosFormulario();

  if (!nome || !email || !telefone || !dataNascimento || !senha) {
    alert("Campos do formulário não encontrados.");
    return;
  }

  const dadosAtualizados = {
    USR_NAME: nome.value.trim(),
    USR_EMAIL: email.value.trim(),
    USR_TELEFONE: telefone.value.trim(),
    USR_DTNASC: dataNascimento.value,
    USR_SENHA: senha.value.trim(),
  };

  if (
    !dadosAtualizados.USR_NAME ||
    !dadosAtualizados.USR_EMAIL ||
    !dadosAtualizados.USR_TELEFONE ||
    !dadosAtualizados.USR_DTNASC ||
    !dadosAtualizados.USR_SENHA
  ) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const resposta = await fetch(`${apiUrl}/usuarios_admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (resposta.status === 401 || resposta.status === 403) {
      alert("Sessão expirada. Faça login novamente.");
      redirecionarParaLogin();
      return;
    }

    if (!resposta.ok) {
      const erroResposta = await resposta.json().catch(() => null);
      const mensagem =
        erroResposta?.mensagem ||
        `Erro ao atualizar usuário: ${resposta.status}`;
      throw new Error(mensagem);
    }

    alert("Usuário atualizado com sucesso.");
    window.location.href = "./admin-usuarios.html";
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    alert(error.message || "Erro ao atualizar usuário.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const { form } = obterElementosFormulario();

  if (!form) {
    console.error('Formulário "editarUsuarioForm" não encontrado.');
    return;
  }

  form.addEventListener("submit", atualizarUsuario);
  carregarUsuario();
});
