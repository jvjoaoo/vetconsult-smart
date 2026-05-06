const apiUrl = "http://localhost:3000/usuarios_admin";
const usuariosTableBody = document.getElementById("usuariosTableBody");

const tokenAdmin = localStorage.getItem("tokenAdmin");
const adminLogado = localStorage.getItem("adminLogado");
const adminDados = localStorage.getItem("adminDados");

if (!tokenAdmin || adminLogado !== "true" || !adminDados) {
  window.location.href = "./login-admin.html";
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

function limparSessaoAdmin() {
  localStorage.removeItem("tokenAdmin");
  localStorage.removeItem("adminLogado");
  localStorage.removeItem("adminDados");
}

function sairAdmin() {
  const confirmarSaida = confirm("Deseja realmente sair?");

  if (!confirmarSaida) return;

  limparSessaoAdmin();

  window.location.href = "./login-admin.html";
}

async function listarUsuarios() {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenAdmin}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      limparSessaoAdmin();
      alert("Sua sessão expirou ou você não tem permissão para acessar esta página.");
      window.location.href = "./login-admin.html";
      return;
    }

    if (!response.ok) {
      throw new Error("Erro ao buscar usuários.");
    }

    const usuarios = await response.json();

    usuariosTableBody.innerHTML = "";

    usuarios.forEach((usuario) => {
      usuariosTableBody.innerHTML += `
        <tr>
          <td class="user-name">${usuario.USR_NAME}</td>
          <td>${usuario.USR_EMAIL}</td>
          <td>${formatarTelefone(usuario.USR_TELEFONE)}</td>
          <td>${formatarData(usuario.USR_DTNASC)}</td>
          <td class="table_actions">
            <button onclick="visualizarUsuario(${usuario.USR_ID})">Visualizar</button>
            <button onclick="editarUsuario(${usuario.USR_ID})">Editar</button>
            <button onclick="deletarUsuario(${usuario.USR_ID})">Excluir</button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
  }
}

function visualizarUsuario(id) {
  window.location.href = `./visualizar-usuario.html?id=${id}`;
}

function editarUsuario(id) {
  window.location.href = `./editar-usuario.html?id=${id}`;
}

async function deletarUsuario(id) {
  const confirmar = confirm("Deseja realmente excluir este usuário?");

  if (!confirmar) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${tokenAdmin}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      limparSessaoAdmin();
      alert("Sua sessão expirou ou você não tem permissão para realizar esta ação.");
      window.location.href = "./login-admin.html";
      return;
    }

    if (!response.ok) {
      throw new Error("Erro ao excluir usuário");
    }

    listarUsuarios();
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    alert("Não foi possível excluir o usuário.");
  }
}

/* BTN SAIR */
const btnSairAdmin = document.getElementById("btnSairAdmin");

if (btnSairAdmin) {
  btnSairAdmin.addEventListener("click", sairAdmin);
}

listarUsuarios();