// ===== VARIÁVEIS =====
let organizacoes = [];
let locais = [];
let equipamentos = [];
let chamados = [];
let categorias = []; // NOVO: categorias de problemas
let orgSelecionada = null;
let localSelecionado = null;
let equipamentoSelecionado = null;
let tipoModal = null;

const modal = new bootstrap.Modal(document.getElementById('modal-criar'));
const modalChamado = new bootstrap.Modal(document.getElementById('modal-chamado'));

// ===== EVENTOS AO CARREGAR =====
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) return window.location.href = "login.html";

  carregarCategorias(); // Carrega categorias para o select
  carregarOrganizacoes();

  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
});

// ===== FUNÇÃO PARA EXIBIR SEÇÕES =====
function mostrarSecao(secao) {
  ["organizacoes", "locais", "equipamentos", "chamados"].forEach(id => {
    const el = document.getElementById(`${id}-section`);
    if (el) el.style.display = "none";
  });
  const secaoEl = document.getElementById(`${secao}-section`);
  if (secaoEl) secaoEl.style.display = "block";
}

// ===== ORGANIZAÇÕES =====
async function carregarOrganizacoes() {
  try {
    organizacoes = await api.getOrganizacoes();
    const ul = document.getElementById("lista-organizacoes");
    ul.innerHTML = "";
    organizacoes.forEach(org => {
      const id = org.id_organizacao ?? org.id;
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        ${org.nome}
        <div>
          <button class="btn btn-sm btn-success me-1" onclick="abrirLocais(${id}, '${org.nome}')">Abrir</button>
          <button class="btn btn-sm btn-danger" onclick="deletarOrganizacaoClick(${id})"><i class="bi bi-trash"></i></button>
        </div>
      `;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar organizações.");
  }
}

function abrirModal(tipo) {
  tipoModal = tipo;
  document.getElementById('modal-input').value = "";
  document.getElementById('modal-descricao').value = "";
  
  // Configura título e campos extras
  const titulos = { 
    org: "Nova Organização", 
    local: "Nova Sala", 
    equipamento: "Novo Equipamento" 
  };
  document.getElementById('modal-titulo').innerText = titulos[tipo] || "";
  
  // Mostra/esconde campos extras para equipamento
  const camposEquip = document.getElementById('campos-equipamento');
  if (tipo === 'equipamento') {
    camposEquip.style.display = 'block';
    document.getElementById('modal-tipo').value = 'computador';
    document.getElementById('modal-status').value = 'ativo';
  } else {
    camposEquip.style.display = 'none';
  }

  modal.show();
}

// Atualizar evento de salvar
document.getElementById('modal-salvar').addEventListener('click', async () => {
  const nome = document.getElementById('modal-input').value.trim();
  if (!nome) return alert("Digite um nome!");

  try {
    if (tipoModal === 'org') {
      await criarOrganizacao(nome);
    } else if (tipoModal === 'local') {
      await criarLocal(orgSelecionada.id, { nome });
    } else if (tipoModal === 'equipamento') {
      const descricao = document.getElementById('modal-descricao').value.trim();
      if (!descricao) return alert("Descrição é obrigatória!");
      
      await criarEquipamento(localSelecionado.id, {
        nome,
        tipo: document.getElementById('modal-tipo').value,
        descricao,
        status: document.getElementById('modal-status').value
      });
    }
    
    modal.hide();
    
    // Recarrega lista apropriada
    if (tipoModal === 'org') await carregarOrganizacoes();
    else if (tipoModal === 'local') await carregarLocais();
    else if (tipoModal === 'equipamento') await carregarEquipamentos();
    
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar: " + err.message);
  }
});

async function criarOrganizacao(nome) {
  await api.criarOrganizacao({ nome, descricao: "" });
  carregarOrganizacoes();
}

async function deletarOrganizacaoClick(id) {
  if (confirm("Deletar organização?")) {
    await api.deletarOrganizacao(id);
    if (orgSelecionada?.id === id) orgSelecionada = null;
    carregarOrganizacoes();
  }
}

// ===== LOCAIS =====
async function abrirLocais(id, nome) {
  orgSelecionada = { id, nome };
  document.getElementById("org-nome").innerText = nome;
  mostrarSecao("locais");
  carregarLocais();
}

function voltarOrganizacoes() {
  mostrarSecao("organizacoes");
}

async function carregarLocais() {
  try {
    locais = await api.getLocais(orgSelecionada.id);
    const ul = document.getElementById("lista-locais");
    ul.innerHTML = "";
    locais.forEach(local => {
      const id = local.id_local ?? local.id;
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        ${local.nome}
        <div>
          <button class="btn btn-sm btn-success me-1" onclick="abrirEquipamentos(${id}, '${local.nome}')">Abrir</button>
          <button class="btn btn-sm btn-danger" onclick="deletarLocalClick(${id})"><i class="bi bi-trash"></i></button>
        </div>
      `;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar locais.");
  }
}

async function criarLocal(id_organizacao, dados) {
  await api.criarLocal(id_organizacao, dados);
  carregarLocais();
}

async function deletarLocalClick(id) {
  if (confirm("Deletar local?")) {
    await api.deletarLocal(id);
    if (localSelecionado?.id === id) localSelecionado = null;
    carregarLocais();
  }
}

// ===== EQUIPAMENTOS =====
async function abrirEquipamentos(id, nome) {
  localSelecionado = { id, nome };
  document.getElementById("local-nome").innerText = nome;
  mostrarSecao("equipamentos");
  carregarEquipamentos();
}

function voltarLocais() {
  mostrarSecao("locais");
}

async function carregarEquipamentos() {
  try {
    // mantém a variável usada no dashboard
    equipamentos = await api.getEquipamentos(localSelecionado.id);
    const container = document.getElementById("lista-equipamentos");
    // transforma o <ul id="lista-equipamentos"> em um container que recebe cards
    // (se for <ul>, vamos limpar e usar como wrapper)
    container.innerHTML = "";

    if (!equipamentos || equipamentos.length === 0) {
      container.innerHTML = `<li class="list-group-item text-center text-muted">Nenhum equipamento encontrado.</li>`;
      return;
    }

    // utilitário local para escapar HTML
    function esc(txt) {
      if (!txt && txt !== 0) return "";
      return String(txt)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    const iconMap = {
      computador: "💻",
      notebook: "🖥️",
      celular: "📱",
      tablet: "📲",
      outro: "🔧"
    };

    equipamentos.forEach(eq => {
      const id = eq.id ?? eq.id_equipamento;

      // cria um <li> que conterá o card
      const li = document.createElement("li");
      li.className = "list-group-item p-0 border-0 mb-2"; // reset visual do li

      const card = document.createElement("div");
      card.className = "card equip-card shadow-sm";
      card.innerHTML = `
        <div class="equip-header">
          <div class="equip-icon">${iconMap[eq.tipo] || "🔧"}</div>
          <div class="equip-info">
            <h5 title="${esc(eq.nome)}">${esc(eq.nome)}</h5>
            <small class="text-muted">${esc(eq.tipo)}</small>
          </div>
        </div>
        <div class="equip-divider"></div>
        <div class="equip-desc">${esc(eq.descricao || "Sem descrição")}</div>
      `;

      // clique abre a seção de chamados (mantendo comportamento original)
      card.addEventListener("click", () => {
        // mantém compatibilidade com abrirChamados/editar etc.
        equipamentoSelecionado = { id, nome: eq.nome };
        // abre modal/visão de detalhes se você já tiver a função (tenta usar abrirDetalhesEquipamento se existir)
        if (typeof abrirDetalhesEquipamento === "function") {
          abrirDetalhesEquipamento(eq);
        } else {
          // fallback: abrir seção de chamados (comportamento antigo)
          abrirChamados(id, eq.nome);
        }
      });

      // adiciona botões à direita (opcional) — aqui mantemos botões similares ao antigo layout
      const actions = document.createElement("div");
      actions.className = "d-flex gap-2 mt-2";
      actions.innerHTML = `
        <button class="btn btn-sm btn-info" type="button" onclick="abrirChamados(${id}, '${esc(eq.nome)}'); event.stopPropagation();">Chamados</button>
        <button class="btn btn-sm btn-danger" type="button" onclick="deletarEquipamentoClick(${id}); event.stopPropagation();">Deletar</button>
      `;
      card.appendChild(actions);

      li.appendChild(card);
      container.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    const container = document.getElementById("lista-equipamentos");
    if (container) container.innerHTML = `<li class="list-group-item text-danger">Erro ao carregar equipamentos: ${err.message}</li>`;
    else alert("Erro ao carregar equipamentos: " + err.message);
  }
}

async function criarEquipamento(id_local, dados) {
  await api.criarEquipamento(id_local, dados);
  carregarEquipamentos();
}

async function deletarEquipamentoClick(id) {
  if (confirm("Deletar equipamento?")) {
    await api.deletarEquipamento(id);
    if (equipamentoSelecionado?.id === id) equipamentoSelecionado = null;
    carregarEquipamentos();
  }
}

function voltarEquipamentos() {
  mostrarSecao("equipamentos");
}

// ===== CHAMADOS =====
async function carregarCategorias() {
  try {
    categorias = await api.getCategorias(); // Você precisa implementar esse endpoint no backend
    const select = document.getElementById("chamado-categoria");
    select.innerHTML = "";
    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id_categoria ?? cat.id;
      option.textContent = cat.nome;
      select.appendChild(option);
    });
  } catch (err) {
    console.error(err);
  }
}

async function abrirChamados(id, nome) {
  equipamentoSelecionado = { id, nome };
  document.getElementById("equipamento-nome").innerText = nome;
  mostrarSecao("chamados");
  carregarChamados();
}

async function carregarChamados() {
  try {
    chamados = await api.getChamados(equipamentoSelecionado.id);
    const ul = document.getElementById("lista-chamados");
    ul.innerHTML = "";

    if (!chamados.length) {
      ul.innerHTML = `<li class="list-group-item text-center text-muted">Nenhum chamado encontrado.</li>`;
      return;
    }

    chamados.forEach(ch => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div>
          <strong>${ch.categoria_nome || "Categoria não informada"}</strong><br>
          <small>${ch.descricao}</small>
        </div>
        <div>
          <span class="badge bg-${ch.status === 'aberto' ? 'warning' : ch.status === 'resolvido' ? 'success' : 'secondary'}">
            ${ch.status}
          </span>
          <button class="btn btn-sm btn-success ms-2 btn-fechar">Fechar</button>
          <button class="btn btn-sm btn-danger ms-1 btn-delete">Deletar</button>
        </div>
      `;

      // Eventos dos botões
      li.querySelector(".btn-fechar").addEventListener("click", async () => {
        try {
          await api.atualizarStatusChamado(ch.id_chamado, "resolvido");
          carregarChamados();
        } catch (err) {
          alert("Erro ao fechar chamado: " + err.message);
        }
      });

      li.querySelector(".btn-delete").addEventListener("click", async () => {
        if (!confirm("Deseja realmente deletar este chamado?")) return;
        try {
          await api.deletarChamado(ch.id_chamado);
          carregarChamados();
        } catch (err) {
          alert("Erro ao deletar chamado: " + err.message);
        }
      });

      ul.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar chamados.");
  }
}

function abrirModalChamado() {
  if (categorias.length > 0) document.getElementById("chamado-categoria").value = categorias[0].id_categoria;
  document.getElementById("chamado-descricao").value = "";
  modalChamado.show();
}

document.getElementById("salvar-chamado").addEventListener("click", async () => {
  const id_categoria = parseInt(document.getElementById("chamado-categoria").value);
  const descricao = document.getElementById("chamado-descricao").value.trim();

  if (!descricao) return alert("Digite uma descrição!");
  if (!equipamentoSelecionado?.id) return alert("Selecione um equipamento!");

  try {
    console.log("id_equipamento:", equipamentoSelecionado.id);
    console.log("dados do chamado:", { id_categoria, descricao });

    await api.criarChamado(equipamentoSelecionado.id, { id_categoria, descricao });
    modalChamado.hide();
    carregarChamados();
  } catch (err) {
    alert("Erro ao criar chamado: " + err.message);
  }
});

document.getElementById('criarChamadoBtn').addEventListener('click', async (e) => {
    e.preventDefault();

    // Onde monta e chama criarChamado:
    const id_equipamento = Number(selectedEquipamentoId);
    const titulo = document.getElementById('chamadoTitulo')?.value || '';
    const descricao = document.getElementById('chamadoDescricao')?.value || '';

    if (!descricao.trim()) {
      alert('Por favor, preencha a descrição do chamado.');
      return;
    }

    const dadosChamado = { id_equipamento, titulo, descricao };

    // chama função que faz fetch (public/js/api.js)
    await criarChamado(dadosChamado);
});
