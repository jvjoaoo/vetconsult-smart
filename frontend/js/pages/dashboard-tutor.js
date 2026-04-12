document.addEventListener("DOMContentLoaded", () => {
  const tokenTutor = localStorage.getItem("tokenTutor");
  const tutorLogado = localStorage.getItem("tutorLogado");
  const tutorDados = localStorage.getItem("tutorDados");
  const tutorReativado = localStorage.getItem("tutorReativado") === "true";

  if (tutorLogado !== "true" || !tutorDados) {
    window.location.replace("./login-tutor.html");
    return;
  }

  try {
    const tutor = JSON.parse(tutorDados);

    const openProfileMenu = document.getElementById("openProfileMenu");
    const closeProfileMenu = document.getElementById("closeProfileMenu");
    const profileSidebar = document.getElementById("profileSidebar");
    const profileSidebarOverlay = document.getElementById(
      "profileSidebarOverlay",
    );

    const dashboardTutorNome = document.getElementById("dashboardTutorNome");
    const profileTutorNome = document.getElementById("profileTutorNome");
    const profileTutorEmail = document.getElementById("profileTutorEmail");
    const profileTutorNomeInfo = document.getElementById(
      "profileTutorNomeInfo",
    );
    const profileTutorEmailInfo = document.getElementById(
      "profileTutorEmailInfo",
    );
    const profileAvatar = document.getElementById("profileAvatar");

    const editTutorBtn = document.getElementById("editTutorBtn");
    const inactivateTutorBtn = document.getElementById("inactivateTutorBtn");
    const deleteTutorBtn = document.getElementById("deleteTutorBtn");
    const logoutTutorBtn = document.getElementById("logoutTutorBtn");

    const tutorId = tutor.id || tutor.TUT_ID || null;
    const nomeTutor = (tutor.nome || tutor.TUT_NOME || "Tutor").trim();
    const emailTutor = tutor.email || tutor.TUT_EMAIL || "E-mail não informado";
    const statusTutor = tutor.status || tutor.TUT_STATUS || "ATIVO";

    const primeiroNomeTutor = nomeTutor.split(" ")[0] || "Tutor";
    const inicialTutor = nomeTutor.charAt(0).toUpperCase() || "T";

    function limparSessaoTutor() {
      localStorage.removeItem("tokenTutor");
      localStorage.removeItem("tutorLogado");
      localStorage.removeItem("tutorDados");
      localStorage.removeItem("tutorReativado");
    }

    function preencherDadosTutor() {
      if (dashboardTutorNome) {
        if (tutorReativado) {
          dashboardTutorNome.textContent = `Seja bem-vindo de volta, ${primeiroNomeTutor}! 👋`;
          localStorage.removeItem("tutorReativado");
        } else {
          dashboardTutorNome.textContent = `Olá, ${primeiroNomeTutor}! 👋`;
        }
      }

      if (profileTutorNome) {
        profileTutorNome.textContent = nomeTutor;
      }

      if (profileTutorEmail) {
        profileTutorEmail.textContent = emailTutor;
      }

      if (profileTutorNomeInfo) {
        profileTutorNomeInfo.textContent = nomeTutor;
      }

      if (profileTutorEmailInfo) {
        profileTutorEmailInfo.textContent = emailTutor;
      }

      if (profileAvatar) {
        profileAvatar.textContent = inicialTutor;
      }
    }

    function abrirMenuPerfil() {
      profileSidebar?.classList.add("open");
      profileSidebar?.setAttribute("aria-hidden", "false");

      profileSidebarOverlay?.classList.add("open");
      profileSidebarOverlay?.setAttribute("aria-hidden", "false");

      openProfileMenu?.classList.add("active");

      document.body.style.overflow = "hidden";
    }

    function fecharMenuPerfil() {
      profileSidebar?.classList.remove("open");
      profileSidebar?.setAttribute("aria-hidden", "true");

      profileSidebarOverlay?.classList.remove("open");
      profileSidebarOverlay?.setAttribute("aria-hidden", "true");

      openProfileMenu?.classList.remove("active");

      document.body.style.overflow = "";
    }

    function logoutTutor() {
      const confirmar = confirm("Deseja realmente sair do sistema?");

      if (!confirmar) return;

      limparSessaoTutor();
      window.location.replace("./login-tutor.html");
    }

    function editarConta() {
      if (!tutorId) {
        alert("Não foi possível identificar o tutor logado.");
        return;
      }

      window.location.href = `./perfil-tutor.html?id=${tutorId}`;
    }

    async function inativarConta() {
      if (!tutorId) {
        alert("Não foi possível identificar o tutor logado.");
        return;
      }

      const confirmar = confirm(
        "Deseja realmente inativar sua conta? Você perderá o acesso ao sistema até reativá-la novamente no login.",
      );

      if (!confirmar) return;

      try {
        const response = await fetch(
          `http://localhost:3000/tutores/${tutorId}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenTutor}`,
            },
            body: JSON.stringify({
              TUT_STATUS: "INATIVO",
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Não foi possível inativar a conta.");
          return;
        }

        alert("Conta inativada com sucesso.");
        limparSessaoTutor();
        window.location.replace("./login-tutor.html");
      } catch (error) {
        console.error("Erro ao inativar conta:", error);
        alert("Não foi possível conectar ao servidor.");
      }
    }

    async function deletarConta() {
      if (!tutorId) {
        alert("Não foi possível identificar o tutor logado.");
        return;
      }

      const confirmar = confirm(
        "Deseja realmente deletar sua conta de forma permanente? Esta ação não poderá ser desfeita.",
      );

      if (!confirmar) return;

      try {
        const response = await fetch(
          `http://localhost:3000/tutores/${tutorId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenTutor}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Não foi possível deletar a conta.");
          return;
        }

        alert("Conta deletada com sucesso.");
        limparSessaoTutor();
        window.location.replace("./login-tutor.html");
      } catch (error) {
        console.error("Erro ao deletar conta:", error);
        alert("Não foi possível conectar ao servidor.");
      }
    }

    if (statusTutor === "INATIVO") {
      limparSessaoTutor();
      window.location.replace("./login-tutor.html");
      return;
    }

    openProfileMenu?.addEventListener("click", abrirMenuPerfil);
    closeProfileMenu?.addEventListener("click", fecharMenuPerfil);
    profileSidebarOverlay?.addEventListener("click", fecharMenuPerfil);

    editTutorBtn?.addEventListener("click", editarConta);
    inactivateTutorBtn?.addEventListener("click", inativarConta);
    deleteTutorBtn?.addEventListener("click", deletarConta);
    logoutTutorBtn?.addEventListener("click", logoutTutor);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        fecharMenuPerfil();
      }
    });

    preencherDadosTutor();
  } catch (error) {
    console.error("Erro ao carregar dashboard do tutor:", error);
    localStorage.removeItem("tokenTutor");
    localStorage.removeItem("tutorLogado");
    localStorage.removeItem("tutorDados");
    localStorage.removeItem("tutorReativado");
    window.location.replace("./login-tutor.html");
  }
});
