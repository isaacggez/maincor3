// frontend/js/organizacao.js
(async function () {
  // ELEMENTOS DO DOM
  const listaOrganizacoesEl = document.getElementById("lista-organizacoes");
  const formNovaOrganizacao = document.getElementById("form-nova-organizacao");
  const selectOrganizacao = document.getElementById("select-organizacao");
  const listaLocaisEl = document.getElementById("lista-locais");
  const formNovoLocal = document.getElementById("form-novo-local");
  const selectLocal = document.getElementById("select-local");
  const listaEquipamentosEl = document.getElementById("lista-equipamentos");
  const formNovoEquipamento = document.getElementById("form-novo-equipamento");

  let organizacoes = [];
  let locais = [];
  let equipamentos = [];

  // ------------------- ORGANIZAÇÕES -------------------
  async function carregarOrganizacoes() {
    try {
      organizacoes = await api.getOrganizacoes();
      renderOrganizacoes();
      renderSelectOrganizacao();
    } catch (err) {
      alert("Erro ao carregar organizações: " + err.message);
    }
  }

  function renderOrganizacoes() {
    if (!listaOrganizacoesEl) return;
    listaOrganizacoesEl.innerHTML = "";
    organizacoes.forEach(org => {
      const li = document.createElement("li");
      li.className = "d-flex justify-content-between align-items-center mb-1";
      li.innerHTML = `
        <span>${org.nome}</span>
        <div>
          <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${org.id_organizacao}">✏️</button>
          <button class="btn btn-sm btn-outline-danger btn-deletar" data-id="${org.id_organizacao}">🗑️</button>
        </div>
      `;
      listaOrganizacoesEl.appendChild(li);
    });
    attachOrganizacaoListeners();
  }

  function renderSelectOrganizacao() {
    if (!selectOrganizacao) return;
    selectOrganizacao.innerHTML = `<option value="">Selecione uma organização</option>`;
    organizacoes.forEach(org => {
      const opt = document.createElement("option");
      opt.value = org.id_organizacao;
      opt.textContent = org.nome;
      selectOrganizacao.appendChild(opt);
    });
  }

  function attachOrganizacaoListeners() {
    document.querySelectorAll(".btn-deletar").forEach(btn => {
      btn.addEventListener("click", async ev => {
        const id = ev.currentTarget.dataset.id;
        if (!confirm("Deseja deletar esta organização?")) return;
        try {
          await api.deletarOrganizacao(id);
          await carregarOrganizacoes();
          listaLocaisEl && (listaLocaisEl.innerHTML = "");
          listaEquipamentosEl && (listaEquipamentosEl.innerHTML = "");
        } catch (err) { alert(err.message); }
      });
    });

    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", async ev => {
        const id = ev.currentTarget.dataset.id;
        const org = organizacoes.find(o => o.id_organizacao == id);
        if (!org) return;
        const novoNome = prompt("Editar nome da organização:", org.nome);
        if (!novoNome) return;
        try {
          await api.atualizarOrganizacao(id, { nome: novoNome, descricao: org.descricao });
          await carregarOrganizacoes();
        } catch (err) { alert(err.message); }
      });
    });
  }

  if (formNovaOrganizacao) {
    formNovaOrganizacao.addEventListener("submit", async ev => {
      ev.preventDefault();
      const nome = formNovaOrganizacao.querySelector("input[name='nome']").value;
      const descricao = formNovaOrganizacao.querySelector("textarea[name='descricao']")?.value || "";
      try {
        await api.criarOrganizacao({ nome, descricao });
        formNovaOrganizacao.reset();
        await carregarOrganizacoes();
      } catch (err) { alert(err.message); }
    });
  }

  // ------------------- LOCAIS -------------------
  async function carregarLocais(id_organizacao) {
    if (!id_organizacao) {
      listaLocaisEl && (listaLocaisEl.innerHTML = "");
      selectLocal && (selectLocal.innerHTML = "");
      return;
    }
    try {
      locais = await api.getLocais(id_organizacao);
      renderLocais();
      renderSelectLocal();
    } catch (err) { alert("Erro ao carregar locais: " + err.message); }
  }

  function renderLocais() {
    if (!listaLocaisEl) return;
    listaLocaisEl.innerHTML = "";
    locais.forEach(local => {
      const li = document.createElement("li");
      li.className = "d-flex justify-content-between align-items-center mb-1";
      li.innerHTML = `
        <span>${local.nome}</span>
        <div>
          <button class="btn btn-sm btn-outline-primary btn-editar-local" data-id="${local.id_local}">✏️</button>
          <button class="btn btn-sm btn-outline-danger btn-deletar-local" data-id="${local.id_local}">🗑️</button>
        </div>
      `;
      listaLocaisEl.appendChild(li);
    });
    attachLocalListeners();
  }

  function renderSelectLocal() {
    if (!selectLocal) return;
    selectLocal.innerHTML = `<option value="">Selecione um local</option>`;
    locais.forEach(local => {
      const opt = document.createElement("option");
      opt.value = local.id_local;
      opt.textContent = local.nome;
      selectLocal.appendChild(opt);
    });
  }

  function attachLocalListeners() {
    document.querySelectorAll(".btn-deletar-local").forEach(btn => {
      btn.addEventListener("click", async ev => {
        const id = ev.currentTarget.dataset.id;
        if (!confirm("Deseja deletar este local?")) return;
        try {
          await api.deletarLocal(id);
          await carregarLocais(selectOrganizacao.value);
          listaEquipamentosEl && (listaEquipamentosEl.innerHTML = "");
        } catch (err) { alert(err.message); }
      });
    });

    document.querySelectorAll(".btn-editar-local").forEach(btn => {
      btn.addEventListener("click", async ev => {
        const id = ev.currentTarget.dataset.id;
        const local = locais.find(l => l.id_local == id);
        if (!local) return;
        const novoNome = prompt("Editar nome do local:", local.nome);
        if (!novoNome) return;
        try {
          await api.atualizarLocal(id, { nome: novoNome });
          await carregarLocais(selectOrganizacao.value);
        } catch (err) { alert(err.message); }
      });
    });
  }

  if (formNovoLocal) {
    formNovoLocal.addEventListener("submit", async ev => {
      ev.preventDefault();
      const nome = formNovoLocal.querySelector("input[name='nome']").value;
      try {
        await api.criarLocal(selectOrganizacao.value, { nome });
        formNovoLocal.reset();
        await carregarLocais(selectOrganizacao.value);
      } catch (err) { alert(err.message); }
    });
  }

  // ------------------- EQUIPAMENTOS -------------------
  async function carregarEquipamentos(id_local) {
    if (!id_local) {
      listaEquipamentosEl && (listaEquipamentosEl.innerHTML = "");
      return;
    }
    try {
      equipamentos = await api.getEquipamentos(id_local);
      renderEquipamentos();
    } catch (err) { alert("Erro ao carregar equipamentos: " + err.message); }
  }

  function renderEquipamentos() {
    if (!listaEquipamentosEl) return;
    listaEquipamentosEl.innerHTML = "";
    equipamentos.forEach(eq => {
      const li = document.createElement("li");
      li.className = "d-flex justify-content-between align-items-center mb-1";
      li.innerHTML = `
        <span>${eq.nome} (${eq.tipo})</span>
        <div>
          <button class="btn btn-sm btn-outline-primary btn-editar-eq" data-id="${eq.id_equipamento}">✏️</button>
          <button class="btn btn-sm btn-outline-danger btn-deletar-eq" data-id="${eq.id_equipamento}">🗑️</button>
        </div>
      `;
      listaEquipamentosEl.appendChild(li);
    });
    attachEquipamentoListeners();
  }

  function attachEquipamentoListeners() {
    document.querySelectorAll(".btn-deletar-eq").forEach(btn => {
      btn.addEventListener("click", async ev => {
        const id = ev.currentTarget.dataset.id;
        if (!confirm("Deseja deletar este equipamento?")) return;
        try {
          await api.deletarEquipamento(id);
          await carregarEquipamentos(selectLocal.value);
        } catch (err) { alert(err.message); }
      });
    });

    document.querySelectorAll(".btn-editar-eq").forEach(btn => {
      btn.addEventListener("click", async ev => {
        const id = ev.currentTarget.dataset.id;
        const eq = equipamentos.find(e => e.id_equipamento == id);
        if (!eq) return;
        const novoNome = prompt("Editar nome do equipamento:", eq.nome);
        if (!novoNome) return;
        const novoTipo = prompt("Editar tipo do equipamento:", eq.tipo);
        if (!novoTipo) return;
        try {
          await api.atualizarEquipamento(id, { nome: novoNome, tipo: novoTipo, descricao: eq.descricao, status: eq.status });
          await carregarEquipamentos(selectLocal.value);
        } catch (err) { alert(err.message); }
      });
    });
  }

  // ------------------- MEMBROS / ROLES -------------------
  const listaMembrosEl = document.getElementById("lista-membros");
  const membrosPanelBtn = document.getElementById("btn-reload-membros");
  const modalCargo = new bootstrap.Modal(document.getElementById("modalCargo"));
  const modalMsg = new bootstrap.Modal(document.getElementById("modalMensagem"));

  async function carregarMembros(id_organizacao) {
    if (!id_organizacao) {
      listaMembrosEl.innerHTML = "<div class='text-muted'>Selecione uma organização</div>";
      return;
    }
    try {
      const membros = await api.getParticipacoes(id_organizacao);
      const minha = await api.getMinhaParticipacao(id_organizacao).catch(()=>null);
      const souAdmin = minha && minha.cargo === "administrador";

      listaMembrosEl.innerHTML = membros.map(m => `
        <div class="d-flex justify-content-between align-items-center mb-2" style="padding:6px;border-radius:6px;background:rgba(255,255,255,0.02);">
          <div>
            <div style="font-weight:600">${m.id_usuario} — ${m.id_usuario /* se tiver nome no select, ajuste backend para retornar nome */}</div>
            <div class="text-muted" style="font-size:.85rem">${m.cargo}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center">
            <button class="btn btn-sm btn-outline-light btn-msg" data-id="${m.id_usuario}">✉️</button>
            ${souAdmin ? `<button class="btn btn-sm btn-outline-primary btn-cargo" data-id="${m.id_participacao}" data-cargo="${m.cargo}">⚙️</button>` : ""}
          </div>
        </div>
      `).join("");

      // listeners
      listaMembrosEl.querySelectorAll(".btn-cargo").forEach(btn => {
        btn.addEventListener("click", ev => {
          const id = ev.currentTarget.dataset.id;
          const cargo = ev.currentTarget.dataset.cargo;
          document.getElementById("cargo-participacao-id").value = id;
          document.getElementById("select-cargo").value = cargo;
          modalCargo.show();
        });
      });

      listaMembrosEl.querySelectorAll(".btn-msg").forEach(btn => {
        btn.addEventListener("click", ev => {
          const idDest = ev.currentTarget.dataset.id;
          document.getElementById("msg-destinatario").value = idDest;
          document.getElementById("msg-conteudo").value = "";
          modalMsg.show();
        });
      });
    } catch (err) {
      console.error("Erro ao carregar membros:", err);
      listaMembrosEl.innerHTML = `<div class="text-danger">Erro ao carregar membros</div>`;
    }
  }

  membrosPanelBtn?.addEventListener("click", () => carregarMembros(selectOrganizacao.value));

  // salvar cargo
  document.getElementById("btn-salvar-cargo").addEventListener("click", async () => {
    const id_part = document.getElementById("cargo-participacao-id").value;
    const cargo = document.getElementById("select-cargo").value;
    try {
      await api.atualizarParticipacao(id_part, { cargo });
      modalCargo.hide();
      carregarMembros(selectOrganizacao.value);
      carregarOrganizacoes(); // refresh
    } catch (err) {
      alert("Erro ao atualizar cargo: " + err.message);
    }
  });

  // enviar mensagem privada
  document.getElementById("btn-enviar-msg").addEventListener("click", async () => {
    const dest = document.getElementById("msg-destinatario").value;
    const conteudo = document.getElementById("msg-conteudo").value.trim();
    if (!conteudo) return alert("Escreva uma mensagem");
    try {
      await api.enviarMensagemPrivada({ id_destinatario: dest, conteudo });
      modalMsg.hide();
      alert("Mensagem enviada");
    } catch (err) {
      alert("Erro ao enviar mensagem: " + err.message);
    }
  });

  // Atualiza membros quando seleciona organização
  selectOrganizacao?.addEventListener("change", ev => carregarMembros(ev.target.value));

  // ao iniciar, se já carregou organizaçoes, carrega membros do primeiro
  if (organizacoes && organizacoes.length) {
    const first = organizacoes[0];
    if (first) carregarMembros(first.id_organizacao || first.id);
  }

  // ------------------- INICIALIZAÇÃO -------------------
  await carregarOrganizacoes();
  selectOrganizacao && carregarLocais(selectOrganizacao.value);
  selectLocal && carregarEquipamentos(selectLocal.value);

})();
