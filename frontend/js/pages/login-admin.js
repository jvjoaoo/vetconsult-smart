const loginUrl = "http://localhost:3000/auth/admin/login";

const form = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    mensagem.textContent = "";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        mensagem.textContent = data.erro || "Erro ao realizar login.";
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));
      localStorage.setItem("tipoUsuario", "admin");

      window.location.href = "./admin-usuarios.html";
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      mensagem.textContent = "Não foi possível conectar ao servidor.";
    }
  });
}