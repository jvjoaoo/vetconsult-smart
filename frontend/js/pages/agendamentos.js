const apiUrlAgendamentos = "http://localhost:3000/agendamentos";
const apiUrlPets = "http://localhost:3000/pets";

const tokenTutor = localStorage.getItem("tokenTutor");
const tutorLogado = localStorage.getItem("tutorLogado");

const btnNovoAgendamento = document.getElementById("btnNovoAgendamento");
const btnNovoAgendamentoEmpty = document.getElementById("btnNovoAgendamentoEmpty");
const btnFecharModalAgendamento = document.getElementById("btnFecharModalAgendamento");
const btnCancelarModal = document.getElementById("btnCancelarModal");

const modalAgendamento = document.getElementById("modalAgendamento");
const formAgendamento = document.getElementById("formAgendamento");

const agendamentosEmptyState = document.getElementById("agendamentosEmptyState");
const agendamentosLista = document.getElementById("agendamentosLista");
const petsChecklist = document.getElementById("petsChecklist");

const mensagemAgendamento = document.getElementById("mensagemAgendamento");
const inputPetId = document.getElementById("PET_ID");

const campoVacina = document.getElementById("campoVacina");
const campoRetorno = document.getElementById("campoRetorno");

const selectAgendamentoReferencia = document.getElementById(
  "AGD_AGENDAMENTO_REFERENCIA_ID"
);

let pets = [];
let petsSelecionados = [];
let agendamentos = [];

document.addEventListener("DOMContentLoaded", () => {
  verificarSessaoTutorAgendamentos();
  configurarEventosAgendamentos();
  carregarDadosIniciais();
});

// ==== VALIDAÇÃO DE SESSÃO ====
function verificarSessaoTutorAgendamentos() {
  if (!tokenTutor || tutorLogado !== "true") {
    window.location.href = "./login-tutor.html";
  }
}

// ==== EVENTOS DA TELA ====
function configurarEventosAgendamentos() {
  btnNovoAgendamento?.addEventListener("click", abrirModalAgendamento);
  btnNovoAgendamentoEmpty?.addEventListener("click", abrirModalAgendamento);
  btnFecharModalAgendamento?.addEventListener("click", fecharModalAgendamento);
  btnCancelarModal?.addEventListener("click", fecharModalAgendamento);

  modalAgendamento?.addEventListener("click", (event) => {
    if (event.target === modalAgendamento) {
      fecharModalAgendamento();
    }
  });

  document.querySelectorAll("input[name='AGD_TIPO']").forEach((radio) => {
    radio.addEventListener("change", atualizarCamposCondicionais);
  });

  formAgendamento?.addEventListener("submit", controlarFluxoAgendamento);
}

// ==== CARREGAMENTO INICIAL ====
async function carregarDadosIniciais() {
  await carregarPets();
  await carregarAgendamentos();
}

// ==== CARREGAR PETS ====
async function carregarPets() {
  try {
    const resposta = await fetch(apiUrlPets, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenTutor}`,
      },
    });

    if (!resposta.ok) {
      throw new Error("Erro ao buscar pets.");
    }

    const dados = await resposta.json();

    if (Array.isArray(dados)) {
      pets = dados;
    } else if (Array.isArray(dados.pets)) {
      pets = dados.pets;
    } else if (Array.isArray(dados.data)) {
      pets = dados.data;
    } else {
      pets = [];
    }

    renderizarPetsChecklist();
  } catch (error) {
    console.error("Erro ao carregar pets:", error);

    pets = [];

    if (petsChecklist) {
      petsChecklist.innerHTML = `
        <p class="empty-modal-message">
          Não foi possível carregar seus pets.
        </p>
      `;
    }
  }
}

// ==== CARREGAR AGENDAMENTOS ====
async function carregarAgendamentos() {
  try {
    const resposta = await fetch(apiUrlAgendamentos, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenTutor}`,
      },
    });

    if (!resposta.ok) {
      throw new Error("Erro ao buscar agendamentos.");
    }

    const dados = await resposta.json();

    if (Array.isArray(dados)) {
      agendamentos = dados;
    } else if (Array.isArray(dados.agendamentos)) {
      agendamentos = dados.agendamentos;
    } else if (Array.isArray(dados.data)) {
      agendamentos = dados.data;
    } else {
      agendamentos = [];
    }

    renderizarAgendamentos();
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);

    agendamentos = [];

    agendamentosEmptyState?.classList.add("hidden");

    if (agendamentosLista) {
      agendamentosLista.classList.remove("hidden");
      agendamentosLista.innerHTML = `
        <p class="empty-modal-message">
          Não foi possível carregar os agendamentos.
        </p>
      `;
    }
  }
}

// ==== RENDERIZAR PETS NO MODAL ====
function renderizarPetsChecklist() {
  if (!petsChecklist) return;

  petsChecklist.innerHTML = "";

  if (!pets.length) {
    petsChecklist.innerHTML = `
      <div class="empty-modal-box">
        <p>Você ainda não possui pets cadastrados.</p>
        <a href="./meus-pets.html" class="secondary-button">
          Cadastrar pet
        </a>
      </div>
    `;
    return;
  }

  pets.forEach((pet) => {
    const card = document.createElement("label");
    card.className = "pet-check-card";

    card.innerHTML = `
      <input 
        type="checkbox" 
        name="petsSelecionados" 
        value="${pet.PET_ID}" 
        class="pet-checkbox"
      />

      <span class="pet-check-name">
        ${pet.PET_NOME || "Pet sem nome"}
      </span>
    `;

    const input = card.querySelector(".pet-checkbox");

    input.addEventListener("change", () => {
      atualizarPetsSelecionados();
      atualizarConsultasReferencia();
    });

    petsChecklist.appendChild(card);
  });
}

// ==== ATUALIZAR PETS SELECIONADOS ====
function atualizarPetsSelecionados() {
  const checkboxesSelecionados = document.querySelectorAll(
    ".pet-checkbox:checked"
  );

  petsSelecionados = Array.from(checkboxesSelecionados)
    .map((checkbox) =>
      pets.find((pet) => Number(pet.PET_ID) === Number(checkbox.value))
    )
    .filter(Boolean);

  if (inputPetId) {
    inputPetId.value = petsSelecionados.map((pet) => pet.PET_ID).join(",");
  }

  document.querySelectorAll(".pet-check-card").forEach((card) => {
    const input = card.querySelector(".pet-checkbox");

    if (input?.checked) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });
}

// ==== CAMPOS CONDICIONAIS ====
function atualizarCamposCondicionais() {
  const tipoSelecionado = document.querySelector(
    "input[name='AGD_TIPO']:checked"
  )?.value;

  campoVacina?.classList.add("hidden");
  campoRetorno?.classList.add("hidden");

  limparCamposCondicionaisNaoSelecionados(tipoSelecionado);

  if (tipoSelecionado === "Vacina") {
    campoVacina?.classList.remove("hidden");
  }

  if (tipoSelecionado === "Retorno") {
    campoRetorno?.classList.remove("hidden");
    atualizarConsultasReferencia();
  }
}

// ==== LIMPAR CAMPOS CONDICIONAIS ====
function limparCamposCondicionaisNaoSelecionados(tipoSelecionado) {
  const vacina = document.getElementById("AGD_VACINA");
  const referencia = document.getElementById("AGD_AGENDAMENTO_REFERENCIA_ID");

  if (tipoSelecionado !== "Vacina" && vacina) vacina.value = "";
  if (tipoSelecionado !== "Retorno" && referencia) referencia.value = "";
}

// ==== CONSULTAS PARA RETORNO ====
function atualizarConsultasReferencia() {
  if (!selectAgendamentoReferencia) return;

  selectAgendamentoReferencia.innerHTML = `
    <option value="">Selecione uma consulta</option>
  `;

  if (!petsSelecionados.length) return;

  const idsPetsSelecionados = petsSelecionados.map((pet) => Number(pet.PET_ID));

  const consultasDosPets = agendamentos.filter(
    (agendamento) =>
      idsPetsSelecionados.includes(Number(agendamento.PET_ID)) &&
      agendamento.AGD_TIPO === "Consulta" &&
      agendamento.AGD_STATUS !== "CANCELADO"
  );

  if (!consultasDosPets.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Nenhuma consulta ativa encontrada";
    selectAgendamentoReferencia.appendChild(option);
    return;
  }

  consultasDosPets.forEach((consulta) => {
    const option = document.createElement("option");

    option.value = consulta.AGD_ID;
    option.textContent = `${consulta.PET_NOME || "Pet"} - ${formatarData(
      consulta.AGD_DATA
    )} - ${formatarHora(consulta.AGD_HORA)}`;

    selectAgendamentoReferencia.appendChild(option);
  });
}

// ==== CONTROLE DO FLUXO ====
function controlarFluxoAgendamento(event) {
  event.preventDefault();

  const tipoSelecionado = document.querySelector(
    "input[name='AGD_TIPO']:checked"
  )?.value;

  if (!tipoSelecionado) {
    exibirMensagemAgendamento("Selecione o tipo de agendamento.", "erro");
    return;
  }

  if (!petsSelecionados.length) {
    exibirMensagemAgendamento(
      "Selecione pelo menos um pet para continuar.",
      "erro"
    );
    return;
  }

  if (tipoSelecionado === "Consulta") {
    iniciarFluxoConsulta();
    return;
  }

  criarAgendamento(event);
}

// ==== FLUXO CONSULTA ====
function iniciarFluxoConsulta() {
  const dadosFluxoAgendamento = {
    tipo: "Consulta",
    pets: petsSelecionados,
    petAtualIndex: 0,
  };

  sessionStorage.setItem(
    "fluxoAgendamento",
    JSON.stringify(dadosFluxoAgendamento)
  );

  window.location.href = "./consulta-agendamento.html";
}

// ==== CRIAR AGENDAMENTO ====
async function criarAgendamento(event) {
  event.preventDefault();

  const tipoSelecionado = document.querySelector(
    "input[name='AGD_TIPO']:checked"
  )?.value;

  const dataAgendamento = document.getElementById("AGD_DATA")?.value;
  const horaAgendamento = document.getElementById("AGD_HORA")?.value;
  const sintomas = document.getElementById("AGD_SINTOMAS")?.value;
  const vacina = document.getElementById("AGD_VACINA")?.value;
  const referencia = document.getElementById(
    "AGD_AGENDAMENTO_REFERENCIA_ID"
  )?.value;
  const observacoes = document.getElementById("AGD_OBSERVACOES")?.value;

  if (!dataAgendamento || !horaAgendamento) {
    exibirMensagemAgendamento(
      "Informe a data e o horário do agendamento.",
      "erro"
    );
    return;
  }

  if (tipoSelecionado === "Consulta" && !sintomas) {
    exibirMensagemAgendamento("Informe os sintomas do pet.", "erro");
    return;
  }

  if (tipoSelecionado === "Vacina" && !vacina) {
    exibirMensagemAgendamento("Informe o tipo da vacina.", "erro");
    return;
  }

  if (tipoSelecionado === "Retorno" && !referencia) {
    exibirMensagemAgendamento(
      "Selecione a consulta de referência para o retorno.",
      "erro"
    );
    return;
  }

  try {
    for (const pet of petsSelecionados) {
      const dadosAgendamento = {
        PET_ID: Number(pet.PET_ID),
        AGD_TIPO: tipoSelecionado.toUpperCase(),
        AGD_DATA: dataAgendamento,
        AGD_HORA: horaAgendamento,
        AGD_SINTOMAS:
          tipoSelecionado === "Consulta" ? sintomas || null : null,
        AGD_VACINA: tipoSelecionado === "Vacina" ? vacina || null : null,
        AGD_AGENDAMENTO_REFERENCIA_ID:
          tipoSelecionado === "Retorno" ? Number(referencia) : null,
        AGD_OBSERVACOES: observacoes || null,
      };

      const resposta = await fetch(apiUrlAgendamentos, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenTutor}`,
        },
        body: JSON.stringify(dadosAgendamento),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao criar agendamento.");
      }
    }

    exibirMensagemAgendamento("Agendamento criado com sucesso.", "sucesso");

    await carregarAgendamentos();

    setTimeout(() => {
      fecharModalAgendamento();
    }, 800);
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    exibirMensagemAgendamento(error.message, "erro");
  }
}

// ==== RENDERIZAR AGENDAMENTOS ====
function renderizarAgendamentos() {
  if (!agendamentosLista || !agendamentosEmptyState) return;

  agendamentosLista.innerHTML = "";

  if (!agendamentos.length) {
    agendamentosEmptyState.classList.remove("hidden");
    agendamentosLista.classList.add("hidden");
    return;
  }

  agendamentosEmptyState.classList.add("hidden");
  agendamentosLista.classList.remove("hidden");

  agendamentos.forEach((agendamento) => {
    const card = document.createElement("article");
    card.className = "agendamento-dashboard-card";

    card.innerHTML = `
      <button
        class="agendamento-delete"
        type="button"
        onclick="cancelarAgendamento(${agendamento.AGD_ID})"
        title="Cancelar agendamento"
      >
        <img 
          src="../assets/excluir.svg" 
          alt="Cancelar agendamento" 
          class="agendamento-delete-icon"
        />
      </button>

      <div class="agendamento-pet-icon">
        ${obterIconePetAgendamento(agendamento.PET_ESPECIE)}
      </div>

      <h3>${agendamento.PET_NOME || "-"}</h3>

      <p>${agendamento.AGD_TIPO || "-"}</p>
      <p>${agendamento.AGD_STATUS || "AGENDADO"}</p>

      <p><strong>Data:</strong> ${formatarData(agendamento.AGD_DATA)}</p>
      <p><strong>Horário:</strong> ${formatarHora(agendamento.AGD_HORA)}</p>

      ${gerarDetalheTipoAgendamento(agendamento)}
    `;

    agendamentosLista.appendChild(card);
  });
}

// ==== ÍCONE DO PET NO CARD ====
// Ajuste os nomes dos arquivos abaixo conforme os SVGs que você salvou em /assets
function obterIconePetAgendamento(especie) {
  const especieFormatada = String(especie || "").toLowerCase();

  if (especieFormatada.includes("gato")) {
    return `
      <img
        src="../assets/pet-cat.svg"
        alt="Gato"
        class="agendamento-pet-svg"
      />
    `;
  }

  if (especieFormatada.includes("cachorro")) {
    return `
      <img
        src="../assets/pet-dog.svg"
        alt="Cachorro"
        class="agendamento-pet-svg"
      />
    `;
  }

  if (
    especieFormatada.includes("ave") ||
    especieFormatada.includes("pássaro") ||
    especieFormatada.includes("passaro")
  ) {
    return `
      <img
        src="../assets/pet-bird.svg"
        alt="Ave"
        class="agendamento-pet-svg"
      />
    `;
  }

  return `
    <img
      src="../assets/paw-icon.svg"
      alt="Pet"
      class="agendamento-pet-svg"
    />
  `;
}

// ==== DETALHE DO TIPO DE AGENDAMENTO ====
function gerarDetalheTipoAgendamento(agendamento) {
  if (agendamento.AGD_TIPO === "Consulta" && agendamento.AGD_SINTOMAS) {
    return `<p><strong>Sintomas:</strong> ${agendamento.AGD_SINTOMAS}</p>`;
  }

  if (agendamento.AGD_TIPO === "Vacina" && agendamento.AGD_VACINA) {
    return `<p><strong>Vacina:</strong> ${agendamento.AGD_VACINA}</p>`;
  }

  if (
    agendamento.AGD_TIPO === "Retorno" &&
    agendamento.AGD_AGENDAMENTO_REFERENCIA_ID
  ) {
    return `
      <p>
        <strong>Consulta referência:</strong>
        #${agendamento.AGD_AGENDAMENTO_REFERENCIA_ID}
      </p>
    `;
  }

  return "";
}

// ==== ABRIR MODAL ====
async function abrirModalAgendamento() {
  if (!modalAgendamento) return;

  modalAgendamento.classList.remove("hidden");
  document.body.classList.add("modal-open");

  if (mensagemAgendamento) {
    mensagemAgendamento.textContent = "";
  }

  await carregarPets();
  atualizarCamposCondicionais();
}

// ==== FECHAR MODAL ====
function fecharModalAgendamento() {
  if (!modalAgendamento || !formAgendamento) return;

  modalAgendamento.classList.add("hidden");
  document.body.classList.remove("modal-open");

  formAgendamento.reset();

  petsSelecionados = [];

  if (inputPetId) {
    inputPetId.value = "";
  }

  if (mensagemAgendamento) {
    mensagemAgendamento.textContent = "";
  }

  document.querySelectorAll(".pet-check-card").forEach((card) => {
    card.classList.remove("selected");
  });

  document.querySelectorAll(".pet-checkbox").forEach((checkbox) => {
    checkbox.checked = false;
  });

  if (selectAgendamentoReferencia) {
    selectAgendamentoReferencia.innerHTML = `
      <option value="">Selecione uma consulta</option>
    `;
  }

  atualizarCamposCondicionais();
}

// ==== CANCELAR AGENDAMENTO ====
async function cancelarAgendamento(agendamentoId) {
  const confirmar = confirm("Deseja realmente cancelar este agendamento?");

  if (!confirmar) return;

  try {
    const resposta = await fetch(`${apiUrlAgendamentos}/${agendamentoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenTutor}`,
      },
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Erro ao cancelar agendamento.");
    }

    await carregarAgendamentos();
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    alert(error.message);
  }
}

// ==== MENSAGEM ====
function exibirMensagemAgendamento(mensagem, tipo) {
  if (!mensagemAgendamento) return;

  mensagemAgendamento.textContent = mensagem;
  mensagemAgendamento.style.color = tipo === "sucesso" ? "#0b8f6a" : "#d93025";
}

// ==== FORMATAR DATA ====
function formatarData(data) {
  if (!data) return "-";

  const dataObj = new Date(data);

  if (Number.isNaN(dataObj.getTime())) {
    return data;
  }

  return dataObj.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

// ==== FORMATAR HORA ====
function formatarHora(hora) {
  if (!hora) return "-";

  return String(hora).slice(0, 5);
}