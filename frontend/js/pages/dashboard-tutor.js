document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('[data-page="dashboard"]')?.classList.add("active");

  const apiPetsUrl = "http://localhost:3000/pets";

  const tokenTutor = localStorage.getItem("tokenTutor");
  const tutorLogado = localStorage.getItem("tutorLogado");
  const tutorDados = localStorage.getItem("tutorDados");
  const tutorReativadoAgora = localStorage.getItem("tutorReativadoAgora") === "true";

  const dashboardTutorNome = document.getElementById("dashboardTutorNome");
  const cadastrarPetBtn = document.getElementById("cadastrarPetBtn");
  const cadastrarPrimeiroPetBtn = document.getElementById(
    "cadastrarPrimeiroPetBtn",
  );
  const verTodosPetsBtn = document.getElementById("verTodosPetsBtn");
  const petsResumoTexto = document.getElementById("petsResumoTexto");
  const petsContainer = document.getElementById("petsContainer");

  function limparSessaoTutor() {
    localStorage.removeItem("tokenTutor");
    localStorage.removeItem("tutorLogado");
    localStorage.removeItem("tutorDados");
    localStorage.removeItem("tutorReativadoAgora");
  }

  if (!tokenTutor || tutorLogado !== "true" || !tutorDados) {
    limparSessaoTutor();
    window.location.replace("./login-tutor.html");
    return;
  }

  let tutor;

  try {
    tutor = JSON.parse(tutorDados);
  } catch (error) {
    console.error("Erro ao ler dados do tutor:", error);
    limparSessaoTutor();
    window.location.replace("./login-tutor.html");
    return;
  }

  const tutorId = tutor.id || tutor.TUT_ID || null;
  const nomeTutor = (tutor.nome || tutor.TUT_NOME || "Tutor").trim();
  const statusTutor = tutor.status || tutor.TUT_STATUS || "ATIVO";
  const primeiroNomeTutor = nomeTutor.split(" ")[0] || "Tutor";

  if (!tutorId || statusTutor === "INATIVO") {
    limparSessaoTutor();
    window.location.replace("./login-tutor.html");
    return;
  }

  function preencherBoasVindasTutor() {
    if (!dashboardTutorNome) return;

    if (tutorReativadoAgora) {
      dashboardTutorNome.textContent = `Seja bem-vindo de volta, ${primeiroNomeTutor}! 👋`;
      localStorage.removeItem("tutorReativadoAgora");
      return;
    }

    dashboardTutorNome.textContent = `Olá, ${primeiroNomeTutor}! 👋`;
  }

  function irParaCadastroPet() {
    window.location.href = "./cadastro-pet.html";
  }

  function irParaMeusPets() {
    window.location.href = "./meus-pets.html";
  }

  async function carregarPets() {
    if (!petsContainer) return;

    try {
      const response = await fetch(apiPetsUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenTutor}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        console.warn("Sessão inválida ou expirada ao buscar pets.");
        limparSessaoTutor();
        window.location.replace("./login-tutor.html");
        return;
      }

      if (!response.ok) {
        console.error("Erro retornado pela API /pets:", data);
        atualizarResumoPets([]);

        petsContainer.innerHTML = `
          <div class="empty-pets">
            <div class="empty-pets-icon">🐶</div>
            <h3>Não foi possível carregar seus pets</h3>
            <p>
              O servidor encontrou um problema ao buscar os pets.
              Verifique o terminal do backend para identificar o erro real.
            </p>
            <button type="button" class="btn-primary" id="cadastrarPrimeiroPetDinamicoBtn">
              Cadastrar pet
            </button>
          </div>
        `;

        document
          .getElementById("cadastrarPrimeiroPetDinamicoBtn")
          ?.addEventListener("click", irParaCadastroPet);

        return;
      }

      const pets = Array.isArray(data) ? data : data.pets || [];

      atualizarResumoPets(pets);
      renderizarPets(pets);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
      atualizarResumoPets([]);

      petsContainer.innerHTML = `
        <div class="empty-pets">
          <div class="empty-pets-icon">🐶</div>
          <h3>Não foi possível conectar ao servidor</h3>
          <p>Verifique se o backend está rodando em http://localhost:3000.</p>
        </div>
      `;
    }
  }

  function atualizarResumoPets(pets) {
    if (!petsResumoTexto) return;

    if (!pets || pets.length === 0) {
      petsResumoTexto.textContent = "Você ainda não cadastrou nenhum pet";
      return;
    }

    if (pets.length === 1) {
      petsResumoTexto.textContent = "Você possui 1 pet cadastrado";
      return;
    }

    petsResumoTexto.textContent = `Você possui ${pets.length} pets cadastrados`;
  }

  function renderizarPets(pets) {
    if (!petsContainer) return;

    if (!pets || pets.length === 0) {
      petsContainer.innerHTML = `
        <div class="empty-pets">
          <div class="empty-pets-icon">🐶</div>
          <h3>Nenhum pet cadastrado</h3>
          <p>
            Assim que você cadastrar seu primeiro pet, as informações aparecerão aqui no painel.
          </p>
          <button type="button" class="btn-primary" id="cadastrarPrimeiroPetDinamicoBtn">
            Cadastrar primeiro pet
          </button>
        </div>
      `;

      document
        .getElementById("cadastrarPrimeiroPetDinamicoBtn")
        ?.addEventListener("click", irParaCadastroPet);

      return;
    }

    petsContainer.innerHTML = pets
      .map((pet) => {
        const petId = pet.PET_ID || pet.id;
        const petNome = pet.PET_NOME || pet.nome || "Pet sem nome";
        const petEspecie =
          pet.PET_ESPECIE || pet.especie || "Espécie não informada";
        const petRaca = pet.PET_RACA || pet.raca || "SRD";

        return `
          <article class="pet-card">
            <div class="pet-card-icon">🐾</div>

            <div class="pet-card-content">
              <h3>${petNome}</h3>
              <p>${petEspecie}</p>
              <p>${petRaca}</p>
            </div>

            <div class="pet-card-actions">
              <a href="./visualizar-pet.html?id=${petId}" class="btn-secondary">
                Visualizar
              </a>
              <a href="./editar-pet.html?id=${petId}" class="btn-secondary">
                Editar
              </a>
            </div>
          </article>
        `;
      })
      .join("");
  }

  cadastrarPetBtn?.addEventListener("click", irParaCadastroPet);
  cadastrarPrimeiroPetBtn?.addEventListener("click", irParaCadastroPet);
  verTodosPetsBtn?.addEventListener("click", irParaMeusPets);

  preencherBoasVindasTutor();
  carregarPets();
});