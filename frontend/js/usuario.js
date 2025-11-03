// usuario.js
// Funções para login e gerenciamento de usuários

(async function () {
  const formLogin = document.getElementById("form-login");

  if (!formLogin) return;

  formLogin.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const email = formLogin.querySelector("input[name='email']").value;
    const senha = formLogin.querySelector("input[name='senha']").value;

    try {
      const res = await api.login(email, senha);
      localStorage.setItem("token", res.token);
      alert("Login realizado com sucesso!");
      window.location.href = "index.html"; // redireciona
    } catch (err) {
      alert("Erro no login: " + err.message);
    }
  });
})();
