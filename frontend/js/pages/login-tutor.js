const authBox = document.getElementById("authBox");

const sideToggleButton = document.getElementById("sideToggleButton");
const sideTitle = document.getElementById("sideTitle");
const sideText = document.getElementById("sideText");

const showRegister = document.getElementById("showRegister");
const showRegisterInline = document.getElementById("showRegisterInline");
const showLoginInline = document.getElementById("showLoginInline");

const loginForm = document.getElementById("loginTutorForm");
const registerForm = document.getElementById("registerTutorForm");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const registerCpf = document.getElementById("registerCpf");
const registerTelefone = document.getElementById("registerTelefone");

const loginApiUrl = "http://localhost:3000/auth/tutor/login";
const registerApiUrl = "http://localhost:3000/tutores";
const tutorApiBaseUrl = "http://localhost:3000/tutores";

/* =========================
   Painel lateral
========================= */
function atualizarPainelLateral() {
  if (!authBox || !sideTitle || !sideText || !sideToggleButton) return;

  if (authBox.classList.contains("login-mode")) {
    sideTitle.textContent = "Bem-vindo!";
    sideText.textContent =
      "Acesse sua conta para acompanhar o cuidado do seu pet com mais praticidade.";
    sideToggleButton.textContent = "Cadastre-se";
  } else {
    sideTitle.textContent = "Novo por aqui?";
    sideText.textContent =
      "Crie sua conta para acessar o sistema e acompanhar o cuidado do seu pet com mais praticidade.";
    sideToggleButton.textContent = "Entrar";
  }
}

function abrirCadastro(event) {
  if (event) event.preventDefault();
  if (!authBox) return;

  authBox.classList.remove("login-mode");
  authBox.classList.add("register-mode");
  atualizarPainelLateral();
}

function abrirLogin(event) {
  if (event) event.preventDefault();
  if (!authBox) return;

  authBox.classList.remove("register-mode");
  authBox.classList.add("login-mode");
  atualizarPainelLateral();
}

function alternarModo(event) {
  if (event) event.preventDefault();
  if (!authBox) return;

  if (authBox.classList.contains("login-mode")) {
    abrirCadastro();
  } else {
    abrirLogin();
  }
}

/* =========================
   Sessão tutor
========================= */
function salvarSessaoTutor(data) {
  const tutor = data?.tutor || {};

  const tutorId = tutor.TUT_ID || tutor.id || null;
  const tutorNome = tutor.TUT_NOME || tutor.nome || "";
  const tutorEmail = tutor.TUT_EMAIL || tutor.email || "";
  const tutorStatus = tutor.TUT_STATUS || tutor.status || "ATIVO";
  const token = data?.token || "";

  if (!tutorId) {
    throw new Error(
      "Não foi possível identificar o tutor para salvar a sessão.",
    );
  }

  localStorage.setItem("tokenTutor", token);
  localStorage.setItem("tutorLogado", "true");
  localStorage.setItem(
    "tutorDados",
    JSON.stringify({
      id: tutorId,
      nome: tutorNome,
      email: tutorEmail,
      status: tutorStatus,
    }),
  );
}

function limparSessaoTutor() {
  localStorage.removeItem("tokenTutor");
  localStorage.removeItem("tutorLogado");
  localStorage.removeItem("tutorDados");
  localStorage.removeItem("tutorReativado");
}

/* =========================
   Mensagens de feedback
========================= */
function exibirMensagemLogin(texto, cor = "red") {
  if (!loginMessage) return;
  loginMessage.style.color = cor;
  loginMessage.textContent = texto;
}

function limparMensagemLogin() {
  if (!loginMessage) return;
  loginMessage.textContent = "";
  loginMessage.style.color = "";
}

function exibirMensagemCadastro(texto, cor = "red") {
  if (!registerMessage) return;
  registerMessage.style.color = cor;
  registerMessage.textContent = texto;
}

function limparMensagemCadastro() {
  if (!registerMessage) return;
  registerMessage.textContent = "";
  registerMessage.style.color = "";
}

/* =========================
   Máscara CPF
========================= */
function aplicarMascaraCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/* =========================
   Máscara Telefone
========================= */
function aplicarMascaraTelefone(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 7) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }

  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

/* =========================
   Reativação da conta
========================= */
async function reativarContaTutor(tutorId, token = "") {
  if (!tutorId) {
    throw new Error("ID do tutor não informado para reativação.");
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${tutorApiBaseUrl}/${tutorId}/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      TUT_STATUS: "ATIVO",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Não foi possível reativar a conta.");
  }

  return data;
}

/* =========================
   Eventos de máscara
========================= */
registerCpf?.addEventListener("input", (event) => {
  event.target.value = aplicarMascaraCPF(event.target.value);
});

registerTelefone?.addEventListener("input", (event) => {
  event.target.value = aplicarMascaraTelefone(event.target.value);
});

/* =========================
   Eventos de troca de modo
========================= */
sideToggleButton?.addEventListener("click", alternarModo);
showRegister?.addEventListener("click", abrirCadastro);
showRegisterInline?.addEventListener("click", abrirCadastro);
showLoginInline?.addEventListener("click", abrirLogin);

atualizarPainelLateral();

/* =========================
   Login tutor
========================= */
loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  limparMensagemLogin();

  const campoEmail = document.getElementById("loginEmail");
  const campoSenha = document.getElementById("loginSenha");

  const payload = {
    TUT_EMAIL: campoEmail?.value.trim() || "",
    TUT_SENHA: campoSenha?.value || "",
  };

  if (!payload.TUT_EMAIL || !payload.TUT_SENHA) {
    exibirMensagemLogin("Preencha e-mail e senha.", "red");
    return;
  }

  try {
    const response = await fetch(loginApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      limparSessaoTutor();
      exibirMensagemLogin(data.message || "Erro ao realizar login.", "red");
      return;
    }

    if (data.contaInativa) {
      const tutor = data?.tutor || {};
      const tutorId = tutor.TUT_ID || tutor.id || null;
      const tutorNome = tutor.TUT_NOME || tutor.nome || "Tutor";
      const tokenTemporario = data?.token || "";

      const desejaReativar = confirm(
        `${tutorNome}, sua conta está desativada. Deseja reativá-la para voltar a acessar o sistema?`,
      );

      if (!desejaReativar) {
        limparSessaoTutor();
        exibirMensagemLogin("Sua conta permanece desativada.", "orange");
        return;
      }

      await reativarContaTutor(tutorId, tokenTemporario);

      salvarSessaoTutor({
        token: tokenTemporario,
        tutor: {
          TUT_ID: tutorId,
          TUT_NOME: tutor.TUT_NOME || tutor.nome || "",
          TUT_EMAIL: tutor.TUT_EMAIL || tutor.email || "",
          TUT_STATUS: "ATIVO",
        },
      });

      localStorage.setItem("tutorReativado", "true");

      exibirMensagemLogin(
        "Conta reativada com sucesso. Entrando no sistema...",
        "green",
      );

      window.location.replace("./dashboard-tutor.html");
      return;
    }

    salvarSessaoTutor(data);
    localStorage.removeItem("tutorReativado");

    exibirMensagemLogin("Login realizado com sucesso.", "green");

    window.location.replace("./dashboard-tutor.html");
  } catch (error) {
    console.error("Erro no login:", error);
    limparSessaoTutor();
    exibirMensagemLogin(
      error.message || "Não foi possível conectar ao servidor.",
      "red",
    );
  }
});

/* =========================
   Cadastro tutor
========================= */
registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  limparMensagemCadastro();

  const campoNome = document.getElementById("registerNome");
  const campoCpf = document.getElementById("registerCpf");
  const campoEmail = document.getElementById("registerEmail");
  const campoTelefone = document.getElementById("registerTelefone");
  const campoDataNascimento = document.getElementById("registerDataNascimento");
  const campoSenha = document.getElementById("registerSenha");

  const cpfLimpo = (campoCpf?.value || "").replace(/\D/g, "");
  const telefoneLimpo = (campoTelefone?.value || "").replace(/\D/g, "");

  const payload = {
    TUT_NOME: campoNome?.value.trim() || "",
    TUT_CPF: cpfLimpo,
    TUT_EMAIL: campoEmail?.value.trim() || "",
    TUT_TELEFONE: telefoneLimpo,
    TUT_DTNASC: campoDataNascimento?.value || null,
    TUT_SENHA: campoSenha?.value || "",
  };

  if (
    !payload.TUT_NOME ||
    !payload.TUT_CPF ||
    !payload.TUT_EMAIL ||
    !payload.TUT_TELEFONE ||
    !payload.TUT_SENHA
  ) {
    exibirMensagemCadastro("Preencha todos os campos obrigatórios.", "red");
    return;
  }

  try {
    const response = await fetch(registerApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      exibirMensagemCadastro(
        data.message || "Erro ao realizar cadastro.",
        "red",
      );
      return;
    }

    exibirMensagemCadastro(
      "Cadastro realizado com sucesso. Faça seu login.",
      "green",
    );

    registerForm.reset();
    abrirLogin();
  } catch (error) {
    console.error("Erro no cadastro:", error);
    exibirMensagemCadastro("Não foi possível conectar ao servidor.", "red");
  }
});
