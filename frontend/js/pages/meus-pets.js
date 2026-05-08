document.querySelector('[data-page="pets"]')?.classList.add("active");
document.addEventListener("DOMContentLoaded", () => {
  const apiPetsUrl = "http://localhost:3000/pets";

  const tokenTutor = localStorage.getItem("tokenTutor");
  const tutorLogado = localStorage.getItem("tutorLogado");
  const tutorDados = localStorage.getItem("tutorDados");

  const petsResumoTexto = document.getElementById("petsResumoTexto");
  const petsContainer = document.getElementById("petsContainer");
  const cadastrarPetBtn = document.getElementById("cadastrarPetBtn");

  function limparSessaoTutor() {
    localStorage.removeItem("tokenTutor");
    localStorage.removeItem("tutorLogado");
    localStorage.removeItem("tutorDados");
    localStorage.removeItem("tutorReativado");
  }

  if (!tokenTutor || tutorLogado !== "true" || !tutorDados) {
    limparSessaoTutor();
    window.location.replace("./login-tutor.html");
    return;
  }

  try {
    JSON.parse(tutorDados);
  } catch (error) {
    limparSessaoTutor();
    window.location.replace("./login-tutor.html");
    return;
  }

  function irParaCadastroPet() {
    window.location.href = "./cadastro-pet.html";
  }

  function atualizarResumoPets(pets) {
    if (!petsResumoTexto) return;

    if (!pets || pets.length === 0) {
      petsResumoTexto.textContent = "Você ainda não cadastrou nenhum pet.";
      return;
    }

    if (pets.length === 1) {
      petsResumoTexto.textContent = "Você possui 1 pet cadastrado.";
      return;
    }

    petsResumoTexto.textContent = `Você possui ${pets.length} pets cadastrados.`;
  }

  function renderizarEstadoVazio() {
    if (!petsContainer) return;

    petsContainer.innerHTML = `
      <div class="empty-pets">
        <div class="empty-pets-icon">🐶</div>
        <h3>Nenhum pet cadastrado</h3>
        <p>
          Cadastre seu primeiro pet para acompanhar informações, consultas e agendamentos.
        </p>
        <button type="button" class="btn-primary" id="cadastrarPrimeiroPetBtn">
          Cadastrar primeiro pet
        </button>
      </div>
    `;

    const cadastrarPrimeiroPetBtn = document.getElementById(
      "cadastrarPrimeiroPetBtn",
    );

    cadastrarPrimeiroPetBtn?.addEventListener("click", irParaCadastroPet);
  }

  function renderizarErro(mensagem) {
    if (!petsContainer) return;

    petsContainer.innerHTML = `
      <div class="empty-pets">
        <div class="empty-pets-icon">⚠️</div>
        <h3>Não foi possível carregar os pets</h3>
        <p>${mensagem}</p>
      </div>
    `;
  }

  function renderizarPets(pets) {
    if (!petsContainer) return;

    if (!pets || pets.length === 0) {
      renderizarEstadoVazio();
      return;
    }

    petsContainer.innerHTML = pets
      .map((pet) => {
        const petId = pet.PET_ID || pet.id;
        const petNome = pet.PET_NOME || pet.nome || "Pet sem nome";
        const petEspecie =
          pet.PET_ESPECIE || pet.especie || "Espécie não informada";
        const petRaca = pet.PET_RACA || pet.raca || "Raça não informada";
        const petSexo = pet.PET_SEXO || pet.sexo || "Sexo não informado";
        const petPorte = pet.PET_PORTE || pet.porte || "Porte não informado";

        return `
          <article class="pet-card pet-card-list">
            <div class="pet-card-icon">🐾</div>

            <div class="pet-card-content">
              <h3>${petNome}</h3>
              <p><strong>Espécie:</strong> ${petEspecie}</p>
              <p><strong>Raça:</strong> ${petRaca}</p>
              <p><strong>Sexo:</strong> ${petSexo}</p>
              <p><strong>Porte:</strong> ${petPorte}</p>
            </div>

            <div class="pet-card-actions">
              <a href="./visualizar-pet.html?id=${petId}" class="btn-secondary">
                Visualizar
              </a>

              <a href="./editar-pet.html?id=${petId}" class="btn-secondary">
                Editar
              </a>

              <button type="button" class="btn-danger" data-pet-id="${petId}">
                Excluir
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    const botoesExcluir = document.querySelectorAll(".btn-danger[data-pet-id]");

    botoesExcluir.forEach((botao) => {
      botao.addEventListener("click", () => {
        const petId = botao.getAttribute("data-pet-id");
        deletarPet(petId);
      });
    });
  }

  async function carregarPets() {
    try {
      const response = await fetch(apiPetsUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenTutor}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        limparSessaoTutor();
        window.location.replace("./login-tutor.html");
        return;
      }

      if (!response.ok) {
        console.error("Erro retornado pela API /pets:", data);
        atualizarResumoPets([]);
        renderizarErro(data.message || "Erro ao buscar pets.");
        return;
      }

      const pets = Array.isArray(data) ? data : data.pets || [];

      atualizarResumoPets(pets);
      renderizarPets(pets);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
      atualizarResumoPets([]);
      renderizarErro("Verifique se o backend está rodando corretamente.");
    }
  }

  async function deletarPet(petId) {
    if (!petId) {
      alert("Não foi possível identificar o pet selecionado.");
      return;
    }

    const confirmar = confirm(
      "Deseja realmente excluir este pet? Esta ação não poderá ser desfeita.",
    );

    if (!confirmar) return;

    try {
      const response = await fetch(`${apiPetsUrl}/${petId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenTutor}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        limparSessaoTutor();
        window.location.replace("./login-tutor.html");
        return;
      }

      if (!response.ok) {
        alert(data.message || "Não foi possível excluir o pet.");
        return;
      }

      alert("Pet excluído com sucesso.");
      carregarPets();
    } catch (error) {
      console.error("Erro ao excluir pet:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  }

  cadastrarPetBtn?.addEventListener("click", irParaCadastroPet);

  carregarPets();
});