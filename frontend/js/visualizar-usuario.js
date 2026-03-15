const apiUrl = "http://localhost:3000/usuarios_admin";

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

    document.getElementById("USR_ID").textContent = usuario.USR_ID;
    document.getElementById("USR_NAME").textContent = usuario.USR_NAME;
    document.getElementById("USR_EMAIL").textContent = usuario.USR_EMAIL;
    document.getElementById("USR_TELEFONE").textContent = formatarTelefone(usuario.USR_TELEFONE);
    document.getElementById("USR_DTNASC").textContent = formatarData(usuario.USR_DTNASC);
  } catch (error) {
    console.error("Erro ao carregar usuário:", error);
    alert("Não foi possível carregar o usuário.");
    window.location.href = "./admin-usuarios.html";
  }
}

function formatarData(data) {
  if (!data) return "";

  const dataFormatada = new Date(data);
  const dia = String(dataFormatada.getDate()).padStart(2, "0");
  const mes = String(dataFormatada.getMonth() + 1).padStart(2, "0");
  const ano = dataFormatada.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

function formatarTelefone(telefone) {
  if (!telefone) return "";

  const numeros = telefone.replace(/\D/g, "");

  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  return telefone;
}

carregarUsuario();