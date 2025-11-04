// frontend/js/chamados.js

(async function() {
  const API_URL = "http://localhost:3001"; // URL do backend
  const tableBody = document.querySelector("table tbody");

  // --------------------- FUNÇÕES ---------------------

  async function fetchChamados() {
    try {
      const res = await fetch(`${API_URL}/chamados`);
      if (!res.ok) throw new Error("Erro ao buscar chamados");
      const chamados = await res.json();
      renderTable(chamados);
    } catch (err) {
      alert(err.message);
    }
  }

  function renderTable(chamados) {
    tableBody.innerHTML = "";

    if (!chamados.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">Nenhum chamado encontrado.</td>
        </tr>`;
      return;
    }

    chamados.forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>#${c.id_chamado || c.id}</td>
        <td>${c.equipamento_nome || c.id_equipamento}</td>
        <td>${c.categoria_nome || c.categoria || "Não informado"}</td>
        <td>
          <span class="badge ${c.status === "aberto" ? "bg-warning" : c.status === "resolvido" ? "bg-success" : "bg-secondary"}">
            ${c.status}
          </span>
        </td>
        <td>${c.data_abertura ? new Date(c.data_abertura).toLocaleDateString() : "-"}</td>
      `;
      // Botões opcionais
      const btns = document.createElement("td");
      btns.innerHTML = `
        <button class="btn btn-sm btn-success btn-fechar">Fechar</button>
        <button class="btn btn-sm btn-danger btn-delete">Deletar</button>
      `;
      tr.appendChild(btns);

      // Eventos
      tr.querySelector(".btn-delete").addEventListener("click", () => deletarChamado(c.id_chamado));
      tr.querySelector(".btn-fechar").addEventListener("click", () => fecharChamado(c.id_chamado));

      tableBody.appendChild(tr);
    });
  }

  async function deletarChamado(id) {
    if (!confirm("Deseja realmente deletar este chamado?")) return;
    try {
      const res = await fetch(`${API_URL}/chamados/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar chamado");
      await fetchChamados();
    } catch (err) {
      alert(err.message);
    }
  }

  async function fecharChamado(id) {
    try {
      const res = await fetch(`${API_URL}/chamados/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolvido" })
      });
      if (!res.ok) throw new Error("Erro ao fechar chamado");
      await fetchChamados();
    } catch (err) {
      alert(err.message);
    }
  }

  // --------------------- INICIALIZA ---------------------
  await fetchChamados();

})();
