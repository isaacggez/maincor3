const API_URL = "http://localhost:3001"; // ajuste se necessário
let equipamentos = [];

const iconMap = {
  computador: "💻",
  notebook: "🖥️",
  celular: "📱",
  tablet: "📲",
  outro: "🔧"
};

console.log('equipamento.js carregado'); // <-- adicione isto no topo do arquivo

async function carregarEquipamentos() {
  const localId = new URLSearchParams(window.location.search).get("id_local") || 1;

  try {
    const response = await fetch(`${API_URL}/equipamentos/local/${localId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!response.ok) throw new Error("Falha ao carregar equipamentos");

    equipamentos = await response.json();
    const grid = document.getElementById("equip-grid");
    grid.innerHTML = "";

    if (!equipamentos.length) {
      grid.innerHTML = '<div class="text-muted">Nenhum equipamento encontrado.</div>';
      return;
    }

    equipamentos.forEach(equip => {
      grid.appendChild(criarCardEquipamento(equip));
    });
  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("equip-grid").innerHTML =
      '<div class="alert alert-danger">Erro ao carregar equipamentos</div>';
  }
}

// Substituir/Adicionar esta função (criarCardEquipamento)
function criarCardEquipamento(e) {
  console.log('criarCardEquipamento chamado para', e && (e.id_equipamento || e.id), e && e.nome);

  const card = document.createElement("div");
  card.className = "card equip-card shadow-sm";
  card.innerHTML = `
    <div class="equip-header">
      <div class="equip-icon">${iconMap[e.tipo] || "🔧"}</div>
      <div class="equip-info">
        <h5 title="${escapeHtml(e.nome)}">${e.nome}</h5>
        <small class="text-muted">${e.tipo}</small>
      </div>
    </div>
    <div class="equip-divider"></div>
    <div class="equip-desc">${escapeHtml(e.descricao || "Sem descrição")}</div>
  `;

  // clique abre modal com todos os detalhes
  card.addEventListener("click", () => abrirDetalhesEquipamento(e));
  return card;
}

// Abre modal preenchendo com todas as informações e configurando botões
function abrirDetalhesEquipamento(e) {
  const modalBody = document.getElementById("equipModalBody");

  modalBody.innerHTML = `
    <div class="text-center mb-4">
      <div class="equip-icon fs-1 mx-auto mb-2" style="width:64px;height:64px;">
        ${iconMap[e.tipo] || "🔧"}
      </div>
      <h3 class="fw-bold mb-1">${escapeHtml(e.nome)}</h3>
      <small class="text-muted text-capitalize">${escapeHtml(e.tipo)}</small>
    </div>

    <hr class="my-3" />

    <p class="mb-2"><strong>Descrição:</strong><br>${escapeHtml(e.descricao || "Sem descrição")}</p>
    <p class="mb-2"><strong>Status:</strong> 
      <span class="status-badge ${
        e.status === "ativo"
          ? "status-ativo"
          : e.status === "em_manutencao"
          ? "status-em_manutencao"
          : "status-inativo"
      }">
        ${escapeHtml((e.status || "").replace("_", " "))}
      </span>
    </p>
    <p class="mb-2"><strong>Categoria:</strong> ${escapeHtml(e.tipo)}</p>
    <p class="mb-2"><strong>ID:</strong> ${e.id_equipamento || e.id}</p>
    <p class="mb-0"><strong>Última atualização:</strong> ${
      e.ultima_atualizacao
        ? new Date(e.ultima_atualizacao).toLocaleString("pt-BR")
        : "—"
    }</p>
  `;

  // botões do modal
  document.getElementById("btnEditar").onclick = () => abrirEditarEquipamento(e.id_equipamento || e.id);
  document.getElementById("btnDeletar").onclick = () => deletarEquipamento(e.id_equipamento || e.id);
  document.getElementById("btnChamados").onclick = () => verChamados(e.id_equipamento || e.id);
  document.getElementById("btnHistorico").onclick = () => verHistorico(e.id_equipamento || e.id);

  const modal = new bootstrap.Modal(document.getElementById("equipModal"));
  modal.show();
}

// placeholders / UX mocks

function abrirEditarEquipamento(id) {
  // abre modal de edição simples (mock)
  const html = `
    <div class="modal fade" id="tmpEditModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title">Editar Equipamento</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="tmpEditForm">
              <div class="mb-2">
                <label class="form-label">Descrição da alteração (histórico)</label>
                <input class="form-control" id="histDesc" required />
              </div>
              <div class="mb-2">
                <label class="form-label">Nome</label>
                <input class="form-control" id="editNome" />
              </div>
              <div class="mb-2">
                <label class="form-label">Descrição</label>
                <textarea class="form-control" id="editDesc"></textarea>
              </div>
              <button class="btn btn-primary" type="submit">Salvar (mock)</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  const tmpModalEl = document.getElementById('tmpEditModal');
  const tmpModal = new bootstrap.Modal(tmpModalEl);
  tmpModal.show();

  document.getElementById('tmpEditForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const hist = document.getElementById('histDesc').value.trim();
    if (!hist) { alert('Descreva o que foi alterado (histórico)'); return; }
    // mock feedback
    alert('Edição simulada (implementação real salva no backend). Histórico: ' + hist);
    tmpModal.hide();
    tmpModalEl.remove();
    // opcional: recarregar lista
    carregarEquipamentos();
  });

  tmpModalEl.addEventListener('hidden.bs.modal', () => tmpModalEl.remove());
}

async function deletarEquipamento(id) {
  if (!confirm('Deseja realmente deletar este equipamento?')) return;
  try {
    // tentativa real: chamar API; se não quiser agora, essa chamada pode ser comentada
    const res = await fetch(`${API_URL}/equipamentos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao deletar');
    alert('Equipamento deletado');
    carregarEquipamentos();
  } catch (err) {
    console.error(err);
    alert('Não foi possível deletar (ver console).');
  }
}

function verChamados(id) {
  // abrir modal simples indicando chamados (mock)
  alert('Abrir chamados (mock) para equipamento ID ' + id);
}

function verHistorico(id) {
  // abrir modal simples indicando histórico (mock)
  alert('Exibir histórico (mock) para equipamento ID ' + id);
}

// utilitária simples para escapar texto seguro em HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Inicialização
document.addEventListener("DOMContentLoaded", carregarEquipamentos);
