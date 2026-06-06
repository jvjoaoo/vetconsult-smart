document.addEventListener("DOMContentLoaded", async () => {
  const tokenAdmin = localStorage.getItem("tokenAdmin");
  const adminLogado = localStorage.getItem("adminLogado");
  const adminDados = localStorage.getItem("adminDados");

  if (!tokenAdmin || adminLogado !== "true" || !adminDados) {
    window.location.replace("./login-admin.html");
    return;
  }

  let admin = null;

  try {
    admin = JSON.parse(adminDados);
  } catch (error) {
    limparSessaoAdmin();
    window.location.replace("./login-admin.html");
    return;
  }

  const dashboardTitle = document.getElementById("dashboardTitle");
  const btnSairAdmin = document.getElementById("btnSairAdmin");

  if (dashboardTitle && admin?.nome) {
    const primeiroNome = admin.nome.trim().split(" ")[0];
    dashboardTitle.textContent = `Olá, ${primeiroNome}`;
  }

  if (btnSairAdmin) {
    btnSairAdmin.addEventListener("click", () => {
      const confirmar = confirm("Deseja realmente sair?");

      if (!confirmar) return;

      limparSessaoAdmin();
      window.location.replace("./login-admin.html");
    });
  }

  await carregarIndicadores(tokenAdmin);
});

function limparSessaoAdmin() {
  localStorage.removeItem("tokenAdmin");
  localStorage.removeItem("adminLogado");
  localStorage.removeItem("adminDados");
}

async function carregarIndicadores(tokenAdmin) {
  const totalAdminsEl = document.getElementById("totalAdmins");
  const totalTutoresEl = document.getElementById("totalTutores");
  const totalPetsEl = document.getElementById("totalPets");
  const totalAgendamentosEl = document.getElementById("totalAgendamentos");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenAdmin}`,
  };

  async function buscarTotal(url, encerrarSessaoSeNaoAutorizado = false) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (response.status === 401 || response.status === 403) {
        console.warn(
          `Sem permissão para buscar dados em ${url}. Status: ${response.status}`
        );

        if (encerrarSessaoSeNaoAutorizado) {
          limparSessaoAdmin();

          alert(
            "Sua sessão expirou ou você não tem permissão para acessar esta página."
          );

          window.location.replace("./login-admin.html");
        }

        return 0;
      }

      if (response.status === 404) {
        console.warn(`Rota não encontrada: ${url}`);
        return 0;
      }

      if (!response.ok) {
        console.error(
          `Erro ao buscar dados em ${url}. Status: ${response.status}`
        );
        return 0;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data.length;
      }

      if (typeof data.total === "number") {
        return data.total;
      }

      if (typeof data.total === "string") {
        return Number(data.total) || 0;
      }

      if (Array.isArray(data.data)) {
        return data.data.length;
      }

      if (Array.isArray(data.agendamentos)) {
        return data.agendamentos.length;
      }

      return 0;
    } catch (error) {
      console.error(`Erro ao buscar total em ${url}:`, error);
      return 0;
    }
  }

  async function buscarTotalAgendamentosAtivos() {
    return buscarTotal(
      "http://localhost:3000/agendamentos/admin/total-ativos"
    );
  }

  const [totalAdmins, totalTutores, totalPets, totalAgendamentos] =
    await Promise.all([
      buscarTotal("http://localhost:3000/usuarios_admin", true),
      buscarTotal("http://localhost:3000/tutores"),
      buscarTotal("http://localhost:3000/pets/total"),
      buscarTotalAgendamentosAtivos(),
    ]);

  if (totalAdminsEl) totalAdminsEl.textContent = String(totalAdmins);
  if (totalTutoresEl) totalTutoresEl.textContent = String(totalTutores);
  if (totalPetsEl) totalPetsEl.textContent = String(totalPets);

  if (totalAgendamentosEl) {
    totalAgendamentosEl.textContent = String(totalAgendamentos);
  }
}