document.querySelector('[data-page="pets"]')?.classList.add("active");

document.addEventListener("DOMContentLoaded", () => {
  const apiPetsUrl = "http://localhost:3000/pets";

  const tokenTutor = localStorage.getItem("tokenTutor");
  const tutorLogado = localStorage.getItem("tutorLogado");
  const tutorDados = localStorage.getItem("tutorDados");

  const editarPetForm = document.getElementById("editarPetForm");
  const mensagemPet = document.getElementById("mensagemPet");
  const salvarPetBtn = document.getElementById("salvarPetBtn");
  const editarPetDescricao = document.getElementById("editarPetDescricao");

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

  function exibirMensagem(texto, tipo = "erro") {
    if (!mensagemPet) return;

    mensagemPet.textContent = texto;
    mensagemPet.classList.remove("success", "error");

    if (tipo === "sucesso") {
      mensagemPet.classList.add("success");
      return;
    }

    mensagemPet.classList.add("error");
  }

  function limparMensagem() {
    if (!mensagemPet) return;

    mensagemPet.textContent = "";
    mensagemPet.classList.remove("success", "error");
  }

  function formatarDataParaInput(data) {
    if (!data) return "";

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
      return "";
    }

    return dataObj.toISOString().split("T")[0];
  }

  function preencherFormulario(pet) {
    document.getElementById("PET_NOME").value = pet.PET_NOME || "";
    document.getElementById("PET_ESPECIE").value = pet.PET_ESPECIE || "";
    document.getElementById("PET_RACA").value = pet.PET_RACA || "";
    document.getElementById("PET_SEXO").value = pet.PET_SEXO || "";
    document.getElementById("PET_PORTE").value = pet.PET_PORTE || "";
    document.getElementById("PET_PESO").value = pet.PET_PESO || "";
    document.getElementById("PET_COR").value = pet.PET_COR || "";
    document.getElementById("PET_DTNASC").value = formatarDataParaInput(
      pet.PET_DTNASC,
    );

    if (editarPetDescricao) {
      editarPetDescricao.textContent = `Editando informações de ${pet.PET_NOME || "pet"}.`;
    }
  }

  function montarPayloadPet() {
    const PET_NOME = document.getElementById("PET_NOME")?.value.trim();
    const PET_ESPECIE = document.getElementById("PET_ESPECIE")?.value;
    const PET_RACA = document.getElementById("PET_RACA")?.value.trim();
    const PET_SEXO = document.getElementById("PET_SEXO")?.value;
    const PET_PORTE = document.getElementById("PET_PORTE")?.value;
    const PET_PESO = document.getElementById("PET_PESO")?.value;
    const PET_COR = document.getElementById("PET_COR")?.value.trim();
    const PET_DTNASC = document.getElementById("PET_DTNASC")?.value;

    return {
      PET_NOME,
      PET_ESPECIE,
      PET_RACA: PET_RACA || null,
      PET_SEXO,
      PET_PORTE: PET_PORTE || null,
      PET_PESO: PET_PESO || null,
      PET_COR: PET_COR || null,
      PET_DTNASC: PET_DTNASC || null,
    };
  }

  function validarPayloadPet(payload) {
    if (!payload.PET_NOME) {
      return "Informe o nome do pet.";
    }

    if (!payload.PET_ESPECIE) {
      return "Selecione a espécie do pet.";
    }

    if (!payload.PET_SEXO) {
      return "Selecione o sexo do pet.";
    }

    return "";
  }

  function bloquearFormulario() {
    if (salvarPetBtn) {
      salvarPetBtn.disabled = true;
    }

    const campos = editarPetForm?.querySelectorAll("input, select, button");

    campos?.forEach((campo) => {
      campo.disabled = true;
    });
  }

  async function carregarPet() {
    if (!petId) {
      bloquearFormulario();
      exibirMensagem("Pet não identificado na URL.");
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
        bloquearFormulario();
        exibirMensagem(
          data.message || "Não foi possível carregar os dados do pet.",
        );
        return;
      }

      preencherFormulario(data.pet || data);
    } catch (error) {
      console.error("Erro ao carregar pet:", error);
      bloquearFormulario();
      exibirMensagem("Não foi possível conectar ao servidor.");
    }
  }

  async function atualizarPet(event) {
    event.preventDefault();
    limparMensagem();

    const payload = montarPayloadPet();
    const erroValidacao = validarPayloadPet(payload);

    if (erroValidacao) {
      exibirMensagem(erroValidacao);
      return;
    }

    try {
      salvarPetBtn.disabled = true;
      salvarPetBtn.textContent = "Salvando...";

      const response = await fetch(`${apiPetsUrl}/${petId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenTutor}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        redirecionarParaLogin();
        return;
      }

      if (!response.ok) {
        exibirMensagem(data.message || "Não foi possível atualizar o pet.");
        return;
      }

      exibirMensagem("Pet atualizado com sucesso!", "sucesso");

      setTimeout(() => {
        window.location.href = `./visualizar-pet.html?id=${petId}`;
      }, 800);
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      exibirMensagem("Não foi possível conectar ao servidor.");
    } finally {
      salvarPetBtn.disabled = false;
      salvarPetBtn.textContent = "Salvar alterações";
    }
  }

  if (!validarSessaoTutor()) return;

  carregarPet();
  editarPetForm?.addEventListener("submit", atualizarPet);
});