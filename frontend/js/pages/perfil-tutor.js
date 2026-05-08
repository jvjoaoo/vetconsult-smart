document.querySelector('[data-page="perfil"]')?.classList.add("active");

document.addEventListener("DOMContentLoaded", () => {
  const tokenTutor = localStorage.getItem("tokenTutor");
  const tutorLogado = localStorage.getItem("tutorLogado");
  const tutorDados = localStorage.getItem("tutorDados");

  if (!tokenTutor || tutorLogado !== "true" || !tutorDados) {
    window.location.replace("./login-tutor.html");
    return;
  }

  let tutor;

  try {
    tutor = JSON.parse(tutorDados);
  } catch (error) {
    localStorage.removeItem("tokenTutor");
    localStorage.removeItem("tutorLogado");
    localStorage.removeItem("tutorDados");
    window.location.replace("./login-tutor.html");
    return;
  }

  const tutorId = tutor.id || tutor.TUT_ID;

  const form = document.getElementById("perfilTutorForm");
  const message = document.getElementById("perfilTutorMessage");

  const campoNome = document.getElementById("perfilNome");
  const campoCpf = document.getElementById("perfilCpf");
  const campoEmail = document.getElementById("perfilEmail");
  const campoTelefone = document.getElementById("perfilTelefone");
  const campoDataNascimento = document.getElementById("perfilDataNascimento");
  const campoNovaSenha = document.getElementById("perfilNovaSenha");
  const campoConfirmarSenha = document.getElementById("perfilConfirmarSenha");

  const apiUrl = `http://localhost:3000/tutores/${tutorId}`;

  function limparSessaoTutor() {
    localStorage.removeItem("tokenTutor");
    localStorage.removeItem("tutorLogado");
    localStorage.removeItem("tutorDados");
  }

  function mostrarMensagem(texto, cor = "red") {
    message.textContent = texto;
    message.style.color = cor;
  }

  function aplicarMascaraCpf(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    return numeros
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }

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

  function preencherFormulario(dados) {
    campoNome.value = dados.TUT_NOME || dados.nome || "";
    campoCpf.value = aplicarMascaraCpf(dados.TUT_CPF || dados.cpf || "");
    campoEmail.value = dados.TUT_EMAIL || dados.email || "";
    campoTelefone.value = aplicarMascaraTelefone(
      dados.TUT_TELEFONE || dados.telefone || ""
    );
    campoDataNascimento.value = dados.TUT_DTNASC || dados.dataNascimento || "";
  }

  async function carregarDadosTutor() {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenTutor}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          limparSessaoTutor();
          window.location.replace("./login-tutor.html");
          return;
        }

        mostrarMensagem(data.message || "Não foi possível carregar seus dados.");
        return;
      }

      preencherFormulario(data);

      localStorage.setItem(
        "tutorDados",
        JSON.stringify({
          id: data.TUT_ID || data.id || tutorId,
          nome: data.TUT_NOME || data.nome || "",
          email: data.TUT_EMAIL || data.email || "",
          cpf: data.TUT_CPF || data.cpf || "",
          telefone: data.TUT_TELEFONE || data.telefone || "",
          dataNascimento: data.TUT_DTNASC || data.dataNascimento || "",
          status: data.TUT_STATUS || data.status || "",
        })
      );
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      mostrarMensagem("Não foi possível conectar ao servidor.");
    }
  }

  campoCpf?.addEventListener("input", (event) => {
    event.target.value = aplicarMascaraCpf(event.target.value);
  });

  campoTelefone?.addEventListener("input", (event) => {
    event.target.value = aplicarMascaraTelefone(event.target.value);
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    mostrarMensagem("", "");

    const novaSenha = campoNovaSenha.value.trim();
    const confirmarSenha = campoConfirmarSenha.value.trim();

    if (novaSenha || confirmarSenha) {
      if (novaSenha !== confirmarSenha) {
        mostrarMensagem("A confirmação da nova senha não confere.");
        return;
      }
    }

    const payload = {
      TUT_NOME: campoNome.value.trim(),
      TUT_CPF: campoCpf.value.replace(/\D/g, ""),
      TUT_EMAIL: campoEmail.value.trim(),
      TUT_TELEFONE: campoTelefone.value.replace(/\D/g, ""),
      TUT_DTNASC: campoDataNascimento.value || null,
    };

    if (novaSenha) {
      payload.TUT_SENHA = novaSenha;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenTutor}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          limparSessaoTutor();
          window.location.replace("./login-tutor.html");
          return;
        }

        mostrarMensagem(data.message || "Não foi possível atualizar seus dados.");
        return;
      }

      localStorage.setItem(
        "tutorDados",
        JSON.stringify({
          id: data.TUT_ID || data.id || tutorId,
          nome: data.TUT_NOME || payload.TUT_NOME,
          email: data.TUT_EMAIL || payload.TUT_EMAIL,
          cpf: data.TUT_CPF || payload.TUT_CPF,
          telefone: data.TUT_TELEFONE || payload.TUT_TELEFONE,
          dataNascimento: data.TUT_DTNASC || payload.TUT_DTNASC,
          status: data.TUT_STATUS || data.status || tutor.TUT_STATUS || tutor.status || "",
        })
      );

      campoNovaSenha.value = "";
      campoConfirmarSenha.value = "";

      mostrarMensagem("Dados atualizados com sucesso.", "green");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      mostrarMensagem("Não foi possível conectar ao servidor.");
    }
  });

  carregarDadosTutor();
});

