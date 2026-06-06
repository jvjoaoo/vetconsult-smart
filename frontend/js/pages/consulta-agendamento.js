const apiUrlAgendamentos = "http://localhost:3000/agendamentos";

const tokenTutor = localStorage.getItem("tokenTutor");
const tutorLogado = localStorage.getItem("tutorLogado");

const consultaEtapa = document.getElementById("consultaEtapa");
const consultaPetIcon = document.getElementById("consultaPetIcon");
const consultaPetNome = document.getElementById("consultaPetNome");
const consultaPetResumo = document.getElementById("consultaPetResumo");

const formConsultaAgendamento = document.getElementById("formConsultaAgendamento");
const btnCancelarConsulta = document.getElementById("btnCancelarConsulta");
const btnSalvarConsulta = document.getElementById("btnSalvarConsulta");
const mensagemConsulta = document.getElementById("mensagemConsulta");

let fluxoAgendamento = null;
let petAtual = null;

document.addEventListener("DOMContentLoaded", () => {
  verificarSessaoTutorConsulta();
  carregarFluxoConsulta();
  configurarEventosConsulta();
});

// ==== VALIDAÇÃO DE SESSÃO ====
function verificarSessaoTutorConsulta() {
  if (!tokenTutor || tutorLogado !== "true") {
    window.location.href = "./login-tutor.html";
  }
}

// ==== CARREGAR FLUXO ====
function carregarFluxoConsulta() {
  const fluxoSalvo = sessionStorage.getItem("fluxoAgendamento");

  if (!fluxoSalvo) {
    window.location.href = "./agendamentos.html";
    return;
  }

  try {
    fluxoAgendamento = JSON.parse(fluxoSalvo);
  } catch (error) {
    console.error("Erro ao ler fluxo de agendamento:", error);
    sessionStorage.removeItem("fluxoAgendamento");
    window.location.href = "./agendamentos.html";
    return;
  }

  if (
    !fluxoAgendamento ||
    fluxoAgendamento.tipo !== "Consulta" ||
    !Array.isArray(fluxoAgendamento.pets) ||
    !fluxoAgendamento.pets.length
  ) {
    sessionStorage.removeItem("fluxoAgendamento");
    window.location.href = "./agendamentos.html";
    return;
  }

  if (typeof fluxoAgendamento.petAtualIndex !== "number") {
    fluxoAgendamento.petAtualIndex = 0;
  }

  petAtual = fluxoAgendamento.pets[fluxoAgendamento.petAtualIndex];

  if (!petAtual) {
    finalizarFluxoConsulta();
    return;
  }

  renderizarPetAtual();
}

// ==== EVENTOS ====
function configurarEventosConsulta() {
  formConsultaAgendamento?.addEventListener("submit", salvarConsultaAtual);

  btnCancelarConsulta?.addEventListener("click", () => {
    const confirmar = confirm(
      "Deseja cancelar o preenchimento da consulta? Os dados ainda não finalizados serão perdidos."
    );

    if (!confirmar) return;

    sessionStorage.removeItem("fluxoAgendamento");
    window.location.href = "./agendamentos.html";
  });
}

// ==== RENDERIZAR PET ATUAL ====
function renderizarPetAtual() {
  const totalPets = fluxoAgendamento.pets.length;
  const etapaAtual = fluxoAgendamento.petAtualIndex + 1;

  if (consultaEtapa) {
    consultaEtapa.textContent = `Consulta ${etapaAtual} de ${totalPets}`;
  }

  if (consultaPetIcon) {
    consultaPetIcon.innerHTML = obterIconePetConsulta(petAtual.PET_ESPECIE);
  }

  if (consultaPetNome) {
    consultaPetNome.textContent = petAtual.PET_NOME || "Pet selecionado";
  }

  if (consultaPetResumo) {
    consultaPetResumo.textContent = montarResumoPet(petAtual);
  }

  if (btnSalvarConsulta) {
    btnSalvarConsulta.textContent =
      etapaAtual === totalPets ? "Finalizar agendamentos" : "Próximo pet";
  }

  limparFormularioConsulta();
}

// ==== SALVAR CONSULTA ATUAL ====
async function salvarConsultaAtual(event) {
  event.preventDefault();

  const dataConsulta = document.getElementById("AGD_DATA")?.value;
  const horaConsulta = document.getElementById("AGD_HORA")?.value;
  const sintomas = document.getElementById("AGD_SINTOMAS")?.value;
  const tempoSintomas = document.getElementById("AGD_TEMPO_SINTOMAS")?.value;
  const medicamentos = document.getElementById("AGD_MEDICAMENTOS")?.value;
  const observacoes = document.getElementById("AGD_OBSERVACOES")?.value;

  if (!dataConsulta || !horaConsulta || !sintomas) {
    exibirMensagemConsulta(
      "Informe a data, horário e os sintomas observados.",
      "erro"
    );
    return;
  }

  const observacoesCompletas = montarObservacoesConsulta(
    tempoSintomas,
    medicamentos,
    observacoes
  );

  const dadosConsulta = {
    PET_ID: Number(petAtual.PET_ID),
    AGD_TIPO: "Consulta",
    AGD_DATA: dataConsulta,
    AGD_HORA: horaConsulta,
    AGD_SINTOMAS: sintomas,
    AGD_VACINA: null,
    AGD_EXAME: null,
    AGD_AGENDAMENTO_REFERENCIA_ID: null,
    AGD_OBSERVACOES: observacoesCompletas,
  };

  try {
    const resposta = await fetch(apiUrlAgendamentos, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenTutor}`,
      },
      body: JSON.stringify(dadosConsulta),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Erro ao salvar consulta.");
    }

    avancarParaProximoPet();
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    exibirMensagemConsulta(error.message, "erro");
  }
}

// ==== AVANÇAR PARA PRÓXIMO PET ====
function avancarParaProximoPet() {
  fluxoAgendamento.petAtualIndex += 1;

  if (fluxoAgendamento.petAtualIndex >= fluxoAgendamento.pets.length) {
    finalizarFluxoConsulta();
    return;
  }

  sessionStorage.setItem(
    "fluxoAgendamento",
    JSON.stringify(fluxoAgendamento)
  );

  petAtual = fluxoAgendamento.pets[fluxoAgendamento.petAtualIndex];
  renderizarPetAtual();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// ==== FINALIZAR FLUXO ====
function finalizarFluxoConsulta() {
  sessionStorage.removeItem("fluxoAgendamento");
  window.location.href = "./agendamentos.html";
}

// ==== OBSERVAÇÕES COMPLETAS ====
function montarObservacoesConsulta(tempoSintomas, medicamentos, observacoes) {
  const partes = [];

  if (tempoSintomas) {
    partes.push(`Tempo dos sintomas: ${tempoSintomas}`);
  }

  if (medicamentos) {
    partes.push(`Medicamentos em uso: ${medicamentos}`);
  }

  if (observacoes) {
    partes.push(`Observações adicionais: ${observacoes}`);
  }

  return partes.length ? partes.join("\n") : null;
}

// ==== RESUMO DO PET ====
function montarResumoPet(pet) {
  const especie = pet.PET_ESPECIE || "-";
  const raca = pet.PET_RACA || "-";
  const porte = pet.PET_PORTE || "-";

  return `Espécie: ${especie} | Raça: ${raca} | Porte: ${porte}`;
}

// ==== ÍCONE DO PET ====
function obterIconePetConsulta(especie) {
  const especieFormatada = String(especie || "").toLowerCase();

  if (especieFormatada.includes("gato")) {
    return `
      <img
        src="../assets/pet-cat.svg"
        alt="Gato"
      />
    `;
  }

  if (especieFormatada.includes("cachorro")) {
    return `
      <img
        src="../assets/pet-dog.svg"
        alt="Cachorro"
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
      />
    `;
  }

  return `
    <img
      src="../assets/paw-icon.svg"
      alt="Pet"
    />
  `;
}

// ==== LIMPAR FORMULÁRIO ====
function limparFormularioConsulta() {
  formConsultaAgendamento?.reset();

  if (mensagemConsulta) {
    mensagemConsulta.textContent = "";
  }
}

// ==== MENSAGEM ====
function exibirMensagemConsulta(mensagem, tipo) {
  if (!mensagemConsulta) return;

  mensagemConsulta.textContent = mensagem;
  mensagemConsulta.style.color = tipo === "sucesso" ? "#0b8f6a" : "#d93025";
}