const loginUrl = "http://localhost:3000/auth/admin/login";

const form = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

document.addEventListener("DOMContentLoaded", () => {
  verificarSessaoAdmin();
});

function verificarSessaoAdmin() {
  const tokenAdmin = localStorage.getItem("tokenAdmin");
  const adminLogado = localStorage.getItem("adminLogado");
  const adminDados = localStorage.getItem("adminDados");

  if (!tokenAdmin || adminLogado !== "true" || !adminDados) {
    return;
  }

  try {
    JSON.parse(adminDados);
    window.location.replace("./dashboard-admin.html");
  } catch (error) {
    limparSessaoAdmin();
  }
}

function limparSessaoAdmin() {
  localStorage.removeItem("tokenAdmin");
  localStorage.removeItem("adminLogado");
  localStorage.removeItem("adminDados");
}

function salvarSessaoAdmin(data) {
  const admin = data?.usuario || {};

  const adminId = admin.id || null;
  const adminNome = admin.nome || "";
  const adminEmail = admin.email || "";
  const token = data?.token || "";

  if (!token || !adminId) {
    throw new Error("Dados insuficientes para salvar a sessão do administrador.");
  }

  localStorage.setItem("tokenAdmin", token);
  localStorage.setItem("adminLogado", "true");
  localStorage.setItem(
    "adminDados",
    JSON.stringify({
      id: adminId,
      nome: adminNome,
      email: adminEmail,
      perfil: admin.perfil || "admin"
    })
  );

  localStorage.removeItem("token");
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("tipoUsuario");
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    const email = emailInput?.value.trim() || "";
    const senha = senhaInput?.value.trim() || "";

    if (mensagem) {
      mensagem.textContent = "";
    }

    if (!email || !senha) {
      if (mensagem) {
        mensagem.textContent = "Preencha e-mail e senha para continuar.";
      }
      return;
    }

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        if (mensagem) {
          mensagem.textContent =
            data?.erro || "E-mail ou senha inválidos.";
        }
        return;
      }

      salvarSessaoAdmin(data);
      window.location.replace("./dashboard-admin.html");
    } catch (error) {
      console.error("Erro ao realizar login:", error);

      if (mensagem) {
        mensagem.textContent = "Não foi possível conectar ao servidor.";
      }
    }
  });
}