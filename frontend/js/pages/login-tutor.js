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

const loginApiUrl = "http://localhost:3000/auth/tutor/login";
const registerApiUrl = "http://localhost:3000/tutores";

function atualizarPainelLateral() {
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

function abrirCadastro() {
  authBox.classList.remove("login-mode");
  authBox.classList.add("register-mode");
  atualizarPainelLateral();
}

function abrirLogin() {
  authBox.classList.remove("register-mode");
  authBox.classList.add("login-mode");
  atualizarPainelLateral();
}

function alternarModo(event) {
  event.preventDefault();

  if (authBox.classList.contains("login-mode")) {
    abrirCadastro();
  } else {
    abrirLogin();
  }
}

sideToggleButton?.addEventListener("click", alternarModo);
showRegister?.addEventListener("click", abrirCadastro);
showRegisterInline?.addEventListener("click", abrirCadastro);
showLoginInline?.addEventListener("click", abrirLogin);

atualizarPainelLateral();

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "";
  loginMessage.style.color = "";

  const payload = {
    TUT_EMAIL: document.getElementById("loginEmail").value.trim(),
    TUT_SENHA: document.getElementById("loginSenha").value,
  };

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
      loginMessage.textContent = data.message || "Erro ao realizar login.";
      return;
    }

    localStorage.setItem("tokenTutor", data.token);
    localStorage.setItem("tutorLogado", JSON.stringify(data.tutor));

    loginMessage.style.color = "green";
    loginMessage.textContent = "Login realizado com sucesso.";

    window.location.href = "./dashboard-tutor.html";
  } catch (error) {
    console.error("Erro no login:", error);
    loginMessage.textContent = "Não foi possível conectar ao servidor.";
  }
});

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  registerMessage.textContent = "";
  registerMessage.style.color = "";

  const payload = {
    TUT_NOME: document.getElementById("registerNome").value.trim(),
    TUT_CPF: document.getElementById("registerCpf").value.trim(),
    TUT_EMAIL: document.getElementById("registerEmail").value.trim(),
    TUT_TELEFONE: document.getElementById("registerTelefone").value.trim(),
    TUT_DTNASC: document.getElementById("registerDataNascimento").value || null,
    TUT_SENHA: document.getElementById("registerSenha").value,
  };

  console.log("Payload cadastro:", payload);

  try {
    const response = await fetch(registerApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Resposta cadastro:", response.status, data);

    if (!response.ok) {
      registerMessage.textContent =
        data.message || "Erro ao realizar cadastro.";
      return;
    }

    registerMessage.style.color = "green";
    registerMessage.textContent =
      "Cadastro realizado com sucesso. Faça seu login.";

    registerForm.reset();
    abrirLogin();
  } catch (error) {
    console.error("Erro no cadastro:", error);
    registerMessage.textContent = "Não foi possível conectar ao servidor.";
  }
});