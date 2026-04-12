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
    localStorage.removeItem("tokenAdmin");
    localStorage.removeItem("adminLogado");
    localStorage.removeItem("adminDados");
    window.location.replace("./login-admin.html");
    return;
  }

  const dashboardTitle = document.getElementById("dashboardTitle");
  const logoutButton = document.getElementById("logoutButton");

  if (dashboardTitle && admin?.nome) {
    const primeiroNome = admin.nome.trim().split(" ")[0];
    dashboardTitle.textContent = `Olá, ${primeiroNome}`;
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      const confirmar = confirm("Deseja realmente sair?");
      if (!confirmar) return;

      localStorage.removeItem("tokenAdmin");
      localStorage.removeItem("adminLogado");
      localStorage.removeItem("adminDados");

      window.location.replace("./login-admin.html");
    });
  }

  await carregarIndicadores(tokenAdmin);
});

async function carregarIndicadores(token) {
  const totalAdminsEl = document.getElementById("totalAdmins");
  const totalTutoresEl = document.getElementById("totalTutores");
  const totalPetsEl = document.getElementById("totalPets");
  const totalAgendamentosEl = document.getElementById("totalAgendamentos");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  async function buscarTotal(url, campoAlternativo = null) {
    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data.length;
      }

      if (campoAlternativo && typeof data[campoAlternativo] === "number") {
        return data[campoAlternativo];
      }

      if (typeof data.total === "number") {
        return data.total;
      }

      if (Array.isArray(data.items)) {
        return data.items.length;
      }

      return 0;
    } catch (error) {
      console.error(`Erro ao buscar total em ${url}:`, error);
      return 0;
    }
  }

  const [totalAdmins, totalTutores, totalPets, totalAgendamentos] =
    await Promise.all([
      buscarTotal("http://localhost:3000/usuarios_admin"),
      buscarTotal("http://localhost:3000/tutores"),
      buscarTotal("http://localhost:3000/pets"),
      buscarTotal("http://localhost:3000/agendamentos"),
    ]);

  if (totalAdminsEl) totalAdminsEl.textContent = String(totalAdmins);
  if (totalTutoresEl) totalTutoresEl.textContent = String(totalTutores);
  if (totalPetsEl) totalPetsEl.textContent = String(totalPets);
  if (totalAgendamentosEl) {
    totalAgendamentosEl.textContent = String(totalAgendamentos);
  }
}