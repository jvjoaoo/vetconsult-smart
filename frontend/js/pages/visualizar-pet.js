document.querySelector('[data-page="pets"]')?.classList.add("active");

document.addEventListener("DOMContentLoaded", () => {
  const apiPetsUrl = "http://localhost:3000/pets";

  const tokenTutor = localStorage.getItem("tokenTutor");
  const tutorLogado = localStorage.getItem("tutorLogado");
  const tutorDados = localStorage.getItem("tutorDados");

  const tituloPet = document.getElementById("tituloPet");
  const subtituloPet = document.getElementById("subtituloPet");
  const petDetalhesContainer = document.getElementById("petDetalhesContainer");
  const editarPetBtn = document.getElementById("editarPetBtn");
  const voltarPaginaBtn = document.getElementById("voltarPaginaBtn");

  const params = new URLSearchParams(window.location.search);
  const petId = params.get("id");

  function limparSessaoTutor() {
    localStorage.removeItem("tokenTutor");
    localStorage.removeItem("tutorLogado");
    localStorage.removeItem("tutorDados");
    localStorage.removeItem("tutorReativado");
  }

  function redirecionarParaLogin() {
    limparSessaoTutor();
    window.location.replace("./login-tutor.html");
  }

  function voltarPagina() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "./meus-pets.html";
  }

  function validarSessaoTutor() {
    if (!tokenTutor || tutorLogado !== "true" || !tutorDados) {
      redirecionarParaLogin();
      return false;
    }

    try {
      JSON.parse(tutorDados);
      return true;
    } catch (error) {
      redirecionarParaLogin();
      return false;
    }
  }

  function formatarData(data) {
    if (!data) return "Não informada";

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
      return "Não informada";
    }

    return dataFormatada.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  }

  function formatarPeso(peso) {
    if (!peso) return "SRD";

    return `${Number(peso).toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} kg`;
  }

  function valorOuPadrao(valor) {
    return valor || "SRD";
  }

  function renderizarErro(titulo, mensagem) {
    if (!petDetalhesContainer) return;

    if (tituloPet) tituloPet.textContent = titulo;
    if (subtituloPet) subtituloPet.textContent = mensagem;

    petDetalhesContainer.innerHTML = `
      <div class="empty-pets">
        <div class="empty-pets-icon">⚠️</div>
        <h3>${titulo}</h3>
        <p>${mensagem}</p>
      </div>
    `;
  }

  function renderizarPet(pet) {
    const petNome = pet.PET_NOME || pet.nome || "Pet sem nome";
    const petEspecie = pet.PET_ESPECIE || pet.especie;
    const petRaca = pet.PET_RACA || pet.raca;
    const petSexo = pet.PET_SEXO || pet.sexo;
    const petPorte = pet.PET_PORTE || pet.porte;
    const petPeso = pet.PET_PESO || pet.peso;
    const petCor = pet.PET_COR || pet.cor;
    const petDtNasc = pet.PET_DTNASC || pet.dataNascimento;

    if (tituloPet) tituloPet.textContent = petNome;
    if (subtituloPet) {
      subtituloPet.textContent = "Informações cadastradas do pet.";
    }

    if (editarPetBtn) {
      editarPetBtn.href = `./editar-pet.html?id=${petId}`;
    }

    if (!petDetalhesContainer) return;

    petDetalhesContainer.innerHTML = `
      <div class="pet-profile-header">
        <div class="pet-profile-photo">
          <span>🐾</span>
        </div>

        <div>
          <h2>${petNome}</h2>
          <p>${valorOuPadrao(petEspecie)}</p>
        </div>
      </div>

      <div class="pet-details-grid">
        <div class="pet-detail-item">
          <span class="label">Nome</span>
          <span class="value">${petNome}</span>
        </div>

        <div class="pet-detail-item">
          <span class="label">Espécie</span>
          <span class="value">${valorOuPadrao(petEspecie)}</span>
        </div>

        <div class="pet-detail-item">
          <span class="label">Raça</span>
          <span class="value">${valorOuPadrao(petRaca)}</span>
        </div>

        <div class="pet-detail-item">
          <span class="label">Sexo</span>
          <span class="value">${valorOuPadrao(petSexo)}</span>
        </div>

        <div class="pet-detail-item">
          <span class="label">Porte</span>
          <span class="value">${valorOuPadrao(petPorte)}</span>
        </div>

        <div class="pet-detail-item">
          <span class="label">Peso</span>
          <span class="value">${formatarPeso(petPeso)}</span>
        </div>

        <div class="pet-detail-item">
          <span class="label">Cor</span>
          <span class="value">${valorOuPadrao(petCor)}</span>
        </div>

        <div class="pet-detail-item">
          <span class="label">Data de nascimento</span>
          <span class="value">${formatarData(petDtNasc)}</span>
        </div>
      </div>
    `;
  }

  async function carregarPet() {
    if (!petId) {
      renderizarErro(
        "Pet não identificado",
        "Não foi possível identificar qual pet deve ser visualizado.",
      );
      return;
    }

    try {
      const response = await fetch(`${apiPetsUrl}/${petId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenTutor}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        redirecionarParaLogin();
        return;
      }

      if (!response.ok) {
        renderizarErro(
          "Pet não encontrado",
          data.message || "Não foi possível carregar as informações do pet.",
        );
        return;
      }

      renderizarPet(data.pet || data);
    } catch (error) {
      console.error("Erro ao carregar pet:", error);
      renderizarErro(
        "Erro ao carregar pet",
        "Verifique se o backend está rodando corretamente.",
      );
    }
  }

  if (!validarSessaoTutor()) return;

  voltarPaginaBtn?.addEventListener("click", voltarPagina);

  carregarPet();
});