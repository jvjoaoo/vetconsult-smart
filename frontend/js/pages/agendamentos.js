const apiUrlAgendamentos = "http://localhost:3000/agendamentos";
const apiUrlPets = "http://localhost:3000/pets";

const tokenTutor = localStorage.getItem("tokenTutor");
const tutorLogado = localStorage.getItem("tutorLogado");

const btnNovoAgendamento = document.getElementById("btnNovoAgendamento");
const btnNovoAgendamentoEmpty = document.getElementById(
  "btnNovoAgendamentoEmpty"
);
const btnFecharModalAgendamento = document.getElementById(
  "btnFecharModalAgendamento"
);
const btnCancelarModal = document.getElementById("btnCancelarModal");

const modalAgendamento = document.getElementById("modalAgendamento");
const formAgendamento = document.getElementById("formAgendamento");

const agendamentosEmptyState = document.getElementById(
  "agendamentosEmptyState"
);
const agendamentosLista = document.getElementById("agendamentosLista");
const petsChecklist = document.getElementById("petsChecklist");

const mensagemAgendamento = document.getElementById("mensagemAgendamento");

const inputPetId = document.getElementById("PET_ID");

const dadosPetSelecionado = document.getElementById("dadosPetSelecionado");
const petNome = document.getElementById("petNome");
const petEspecie = document.getElementById("petEspecie");
const petRaca = document.getElementById("petRaca");
const petSexo = document.getElementById("petSexo");
const petPorte = document.getElementById("petPorte");
const petPeso = document.getElementById("petPeso");
const petCor = document.getElementById("petCor");
const petDtNasc = document.getElementById("petDtNasc");

const campoConsulta = document.getElementById("campoConsulta");
const campoVacina = document.getElementById("campoVacina");
const campoExame = document.getElementById("campoExame");
const campoRetorno = document.getElementById("campoRetorno");

const selectAgendamentoReferencia = document.getElementById(
  "AGD_AGENDAMENTO_REFERENCIA_ID"
);

let pets = [];
let agendamentos = [];

document.addEventListener("DOMContentLoaded", () => {
  verificarSessaoTutorAgendamentos();
  configurarEventosAgendamentos();
  carregarDadosIniciais();
});

// ==== VALIDAÇÃO DE SESSÃO ====
// Garante que apenas tutores autenticados acessem a tela
function verificarSessaoTutorAgendamentos() {
  if (!tokenTutor || tutorLogado !== "true") {
    window.location.href = "./login-tutor.html";
  }
}

// ==== EVENTOS DA TELA ====
// Centraliza os eventos principais da tela de agendamentos
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

  formAgendamento?.addEventListener("submit", criarAgendamento);
}

// ==== CARREGAMENTO INICIAL ====
// Busca os pets e os agendamentos do tutor logado
async function carregarDadosIniciais() {
  await carregarPets();
  await carregarAgendamentos();
}

// ==== CARREGAR PETS ====
// Busca os pets cadastrados pelo tutor autenticado
async function carregarPets() {
  try {
    const resposta = await fetch(apiUrlPets, {
      headers: {
        Authorization: `Bearer ${tokenTutor}`,
      },
    });

    if (!resposta.ok) {
      throw new Error("Erro ao buscar pets.");
    }

    pets = await resposta.json();
    renderizarPetsChecklist();
  } catch (error) {
    console.error("Erro ao carregar pets:", error);

    petsChecklist.innerHTML = `
      <p class="empty-modal-message">
        Não foi possível carregar seus pets.
      </p>
    `;
  }
}

// ==== CARREGAR AGENDAMENTOS ====
// Busca os agendamentos existentes do tutor autenticado
async function carregarAgendamentos() {
  try {
    const resposta = await fetch(apiUrlAgendamentos, {
      headers: {
        Authorization: `Bearer ${tokenTutor}`,
      },
    });

    if (!resposta.ok) {
      throw new Error("Erro ao buscar agendamentos.");
    }

    agendamentos = await resposta.json();
    renderizarAgendamentos();
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);

    agendamentosEmptyState.classList.add("hidden");
    agendamentosLista.classList.remove("hidden");

    agendamentosLista.innerHTML = `
      <p class="empty-modal-message">
        Não foi possível carregar os agendamentos.
      </p>
    `;
  }
}

// ==== RENDERIZAR PETS NO MODAL ====
// Exibe os pets cadastrados em formato de cards selecionáveis
function renderizarPetsChecklist() {
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
      <input type="radio" name="petSelecionado" value="${pet.PET_ID}" />

      <h4>${pet.PET_NOME}</h4>

      <p><strong>Espécie:</strong> ${pet.PET_ESPECIE || "-"}</p>
      <p><strong>Raça:</strong> ${pet.PET_RACA || "-"}</p>
      <p><strong>Porte:</strong> ${pet.PET_PORTE || "-"}</p>
    `;

    const input = card.querySelector("input");

    input.addEventListener("change", () => {
      selecionarPet(pet.PET_ID);
    });

    petsChecklist.appendChild(card);
  });
}

// ==== SELECIONAR PET ====
// Preenche automaticamente os dados do pet selecionado
function selecionarPet(petId) {
  const pet = pets.find((item) => Number(item.PET_ID) === Number(petId));

  if (!pet) return;

  inputPetId.value = pet.PET_ID;

  document.querySelectorAll(".pet-check-card").forEach((card) => {
    card.classList.remove("selected");
  });

  const inputSelecionado = document.querySelector(
    `input[name='petSelecionado'][value='${petId}']`
  );

  inputSelecionado?.closest(".pet-check-card")?.classList.add("selected");

  petNome.textContent = pet.PET_NOME || "-";
  petEspecie.textContent = pet.PET_ESPECIE || "-";
  petRaca.textContent = pet.PET_RACA || "-";
  petSexo.textContent = pet.PET_SEXO || "-";
  petPorte.textContent = pet.PET_PORTE || "-";
  petPeso.textContent = pet.PET_PESO ? `${pet.PET_PESO} kg` : "-";
  petCor.textContent = pet.PET_COR || "-";
  petDtNasc.textContent = formatarData(pet.PET_DTNASC);

  dadosPetSelecionado.classList.remove("hidden");

  carregarConsultasReferenciaDoPet(pet.PET_ID);
}

// ==== CONSULTAS PARA RETORNO ====
// Carrega no select apenas consultas do pet selecionado
function carregarConsultasReferenciaDoPet(petId) {
  selectAgendamentoReferencia.innerHTML = `
    <option value="">Selecione uma consulta</option>
  `;

  const consultasDoPet = agendamentos.filter(
    (agendamento) =>
      Number(agendamento.PET_ID) === Number(petId) &&
      agendamento.AGD_TIPO === "Consulta" &&
      agendamento.AGD_STATUS !== "CANCELADO"
  );

  consultasDoPet.forEach((consulta) => {
    const option = document.createElement("option");

    option.value = consulta.AGD_ID;
    option.textContent = `${formatarData(consulta.AGD_DATA)} - ${
      consulta.AGD_HORA
    }`;

    selectAgendamentoReferencia.appendChild(option);
  });
}

// ==== RENDERIZAR AGENDAMENTOS ====
// Exibe os agendamentos ativos ou o estado vazio
function renderizarAgendamentos() {
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
    card.className = "agendamento-card";

    card.innerHTML = `
      <div class="agendamento-card-header">
        <div>
          <h3>${agendamento.PET_NOME}</h3>
          <p>${agendamento.AGD_TIPO}</p>
        </div>

        <span class="agendamento-status">
          ${agendamento.AGD_STATUS}
        </span>
      </div>

      <div class="agendamento-card-info">
        <p><strong>Data:</strong> ${formatarData(agendamento.AGD_DATA)}</p>
        <p><strong>Horário:</strong> ${formatarHora(agendamento.AGD_HORA)}</p>
        <p><strong>Espécie:</strong> ${agendamento.PET_ESPECIE || "-"}</p>
        <p><strong>Raça:</strong> ${agendamento.PET_RACA || "-"}</p>
        ${gerarDetalheTipoAgendamento(agendamento)}
      </div>

      <div class="agendamento-card-actions">
        <button 
          class="secondary-button"
          type="button"
          onclick="cancelarAgendamento(${agendamento.AGD_ID})"
        >
          Cancelar
        </button>
      </div>
    `;

    agendamentosLista.appendChild(card);
  });
}

// ==== DETALHE CONDICIONAL DO CARD ====
// Mostra no card a informação específica conforme o tipo do agendamento
function gerarDetalheTipoAgendamento(agendamento) {
  if (agendamento.AGD_TIPO === "Consulta" && agendamento.AGD_SINTOMAS) {
    return `<p><strong>Sintomas:</strong> ${agendamento.AGD_SINTOMAS}</p>`;
  }

  if (agendamento.AGD_TIPO === "Vacina" && agendamento.AGD_VACINA) {
    return `<p><strong>Vacina:</strong> ${agendamento.AGD_VACINA}</p>`;
  }

  if (agendamento.AGD_TIPO === "Exame" && agendamento.AGD_EXAME) {
    return `<p><strong>Exame:</strong> ${agendamento.AGD_EXAME}</p>`;
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
// Abre o modal centralizado e bloqueia a rolagem da página
function abrirModalAgendamento() {
  modalAgendamento.classList.remove("hidden");
  document.body.classList.add("modal-open");

  mensagemAgendamento.textContent = "";
  atualizarCamposCondicionais();
}

// ==== FECHAR MODAL ====
// Fecha o modal e limpa o formulário
function fecharModalAgendamento() {
  modalAgendamento.classList.add("hidden");
  document.body.classList.remove("modal-open");

  formAgendamento.reset();
  inputPetId.value = "";
  mensagemAgendamento.textContent = "";

  dadosPetSelecionado.classList.add("hidden");

  document.querySelectorAll(".pet-check-card").forEach((card) => {
    card.classList.remove("selected");
  });

  selectAgendamentoReferencia.innerHTML = `
    <option value="">Selecione uma consulta</option>
  `;

  atualizarCamposCondicionais();
}

// ==== CAMPOS CONDICIONAIS ====
// Exibe o grupo de campos conforme o tipo de agendamento selecionado
function atualizarCamposCondicionais() {
  const tipoSelecionado = document.querySelector(
    "input[name='AGD_TIPO']:checked"
  )?.value;

  campoConsulta.classList.add("hidden");
  campoVacina.classList.add("hidden");
  campoExame.classList.add("hidden");
  campoRetorno.classList.add("hidden");

  limparCamposCondicionaisNaoSelecionados(tipoSelecionado);

  if (tipoSelecionado === "Consulta") {
    campoConsulta.classList.remove("hidden");
  }

  if (tipoSelecionado === "Vacina") {
    campoVacina.classList.remove("hidden");
  }

  if (tipoSelecionado === "Exame") {
    campoExame.classList.remove("hidden");
  }

  if (tipoSelecionado === "Retorno") {
    campoRetorno.classList.remove("hidden");
  }
}

// ==== LIMPAR CAMPOS CONDICIONAIS ====
// Evita enviar valores de um tipo antigo ao trocar de opção
function limparCamposCondicionaisNaoSelecionados(tipoSelecionado) {
  if (tipoSelecionado !== "Consulta") {
    document.getElementById("AGD_SINTOMAS").value = "";
  }

  if (tipoSelecionado !== "Vacina") {
    document.getElementById("AGD_VACINA").value = "";
  }

  if (tipoSelecionado !== "Exame") {
    document.getElementById("AGD_EXAME").value = "";
  }

  if (tipoSelecionado !== "Retorno") {
    document.getElementById("AGD_AGENDAMENTO_REFERENCIA_ID").value = "";
  }
}

// ==== CRIAR AGENDAMENTO ====
// Envia os dados do novo agendamento para o backend
async function criarAgendamento(event) {
  event.preventDefault();

  const tipoSelecionado = document.querySelector(
    "input[name='AGD_TIPO']:checked"
  )?.value;

  if (!inputPetId.value) {
    exibirMensagemAgendamento(
      "Selecione um pet para continuar.",
      "erro"
    );
    return;
  }

  const dataAgendamento = document.getElementById("AGD_DATA").value;
  const horaAgendamento = document.getElementById("AGD_HORA").value;

  if (!dataAgendamento || !horaAgendamento) {
    exibirMensagemAgendamento(
      "Informe a data e o horário do agendamento.",
      "erro"
    );
    return;
  }

  const dadosAgendamento = {
    PET_ID: Number(inputPetId.value),
    AGD_DATA: dataAgendamento,
    AGD_HORA: horaAgendamento,
    AGD_TIPO: tipoSelecionado,
    AGD_SINTOMAS:
      tipoSelecionado === "Consulta"
        ? document.getElementById("AGD_SINTOMAS").value || null
        : null,
    AGD_VACINA:
      tipoSelecionado === "Vacina"
        ? document.getElementById("AGD_VACINA").value || null
        : null,
    AGD_EXAME:
      tipoSelecionado === "Exame"
        ? document.getElementById("AGD_EXAME").value || null
        : null,
    AGD_AGENDAMENTO_REFERENCIA_ID:
      tipoSelecionado === "Retorno"
        ? document.getElementById("AGD_AGENDAMENTO_REFERENCIA_ID").value ||
          null
        : null,
    AGD_OBSERVACOES:
      document.getElementById("AGD_OBSERVACOES").value || null,
  };

  try {
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

// ==== CANCELAR AGENDAMENTO ====
// Remove/cancela o agendamento selecionado
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

// ==== MENSAGEM DO MODAL ====
// Exibe mensagem de sucesso ou erro no formulário
function exibirMensagemAgendamento(mensagem, tipo) {
  mensagemAgendamento.textContent = mensagem;

  if (tipo === "sucesso") {
    mensagemAgendamento.style.color = "#0b8f6a";
    return;
  }

  mensagemAgendamento.style.color = "#d93025";
}

// ==== FORMATAR DATA ====
// Formata datas vindas do banco para o padrão brasileiro
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
// Remove os segundos quando o banco retornar HH:MM:SS
function formatarHora(hora) {
  if (!hora) return "-";

  return String(hora).slice(0, 5);
}