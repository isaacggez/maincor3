// ==================== api.js ====================
const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:3001"
  : "https://maincor3.vercel.app";

function getToken() {
  return localStorage.getItem("token") || "";
}

function getHeaders(json = true) {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

async function handleResponse(res) {
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
  if (!res.ok) {
    const msg = data && data.message ? data.message : `Erro ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ------------------- Usuário -------------------
async function login(email, senha) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Importante para cookies
      body: JSON.stringify({ email, senha })
    });
    
    const data = await handleResponse(res);
    
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    
    return data;
  } catch (error) {
    console.error("Erro no login:", error.message);
    throw error;
  }
}

async function registrar(nome, email, senha) {
  try {
    const res = await fetch(`${API_URL}/auth/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Importante para cookies
      body: JSON.stringify({ nome, email, senha })
    });
    
    return await handleResponse(res);
  } catch (error) {
    console.error("Erro no registro:", error.message);
    throw error;
  }
}

// ------------------- Organizações -------------------
async function getOrganizacoes() {
  const res = await fetch(`${API_URL}/organizacoes`, { headers: getHeaders() });
  return handleResponse(res);
}

async function criarOrganizacao(dados) {
  const res = await fetch(`${API_URL}/organizacoes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dados)
  });
  return handleResponse(res);
}

async function atualizarOrganizacao(id, dados) {
  const res = await fetch(`${API_URL}/organizacoes/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(dados)
  });
  return handleResponse(res);
}

async function deletarOrganizacao(id) {
  const res = await fetch(`${API_URL}/organizacoes/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  return handleResponse(res);
}

// ------------------- Locais -------------------
async function getLocais(id_organizacao) {
  const res = await fetch(`${API_URL}/locais/organizacao/${id_organizacao}`, { headers: getHeaders() });
  return handleResponse(res);
}

async function criarLocal(id_organizacao, dados) {
  const res = await fetch(`${API_URL}/locais/${id_organizacao}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dados)
  });
  return handleResponse(res);
}

async function atualizarLocal(id, dados) {
  const res = await fetch(`${API_URL}/locais/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(dados)
  });
  return handleResponse(res);
}

async function deletarLocal(id) {
  const res = await fetch(`${API_URL}/locais/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  return handleResponse(res);
}

// ------------------- Equipamentos -------------------
async function getEquipamentos(id_local) {
  const res = await fetch(`${API_URL}/equipamentos/local/${id_local}`, { headers: getHeaders() });
  return handleResponse(res);
}

async function criarEquipamento(id_local, dados) {
  const res = await fetch(`${API_URL}/equipamentos/local/${id_local}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dados)
  });
  return handleResponse(res);
}

async function atualizarEquipamento(id_equipamento, dados) {
  const res = await fetch(`${API_URL}/equipamentos/${id_equipamento}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(dados)
  });
  return handleResponse(res);
}

async function deletarEquipamento(id_equipamento) {
  const res = await fetch(`${API_URL}/equipamentos/${id_equipamento}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  return handleResponse(res);
}

// ------------------- Chamados -------------------
async function getChamados(id_equipamento) {
  const res = await fetch(`${API_URL}/chamados/equipamento/${id_equipamento}`, { headers: getHeaders() });
  return handleResponse(res);
}

async function criarChamado(id_equipamento, dados) {
  const res = await fetch(`${API_URL}/chamados/equipamento/${id_equipamento}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dados)
  });
  return handleResponse(res);
}

async function atualizarStatusChamado(id_chamado, status) {
  const res = await fetch(`${API_URL}/chamados/${id_chamado}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}
async function deletarChamado(id_chamado) {
  const res = await fetch(`${API_URL}/chamados/${id_chamado}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  return handleResponse(res);
}

// ------------------- Categorias -------------------
async function getCategorias() {
  const res = await fetch(`${API_URL}/categorias`, { headers: getHeaders() });
  return handleResponse(res);
}

// ------------------- Participações (membros) -------------------
async function getParticipacoes(id_organizacao) {
  const res = await fetch(`${API_URL}/participacoes/${id_organizacao}`, { headers: getHeaders() });
  return handleResponse(res);
}

async function getMinhaParticipacao(id_organizacao) {
  const res = await fetch(`${API_URL}/participacoes/me/${id_organizacao}`, { headers: getHeaders() });
  return handleResponse(res);
}

async function adicionarParticipacao(dados) {
  const res = await fetch(`${API_URL}/participacoes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dados)
  });
  return handleResponse(res);
}

async function atualizarParticipacao(id_participacao, dados) {
  const res = await fetch(`${API_URL}/participacoes/${id_participacao}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(dados)
  });
  return handleResponse(res);
}

async function removerParticipacao(id_participacao) {
  const res = await fetch(`${API_URL}/participacoes/${id_participacao}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  return handleResponse(res);
}

// ------------------- Mensagens Privadas -------------------
async function enviarMensagemPrivada(dados) {
  const res = await fetch(`${API_URL}/mensagens`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(dados)
  });
  return handleResponse(res);
}

async function getConversas() {
  const res = await fetch(`${API_URL}/mensagens`, { headers: getHeaders() });
  return handleResponse(res);
}

async function getConversaCom(id_outro) {
  const res = await fetch(`${API_URL}/mensagens/conversa/${id_outro}`, { headers: getHeaders() });
  return handleResponse(res);
}

// ------------------- Perfil -------------------
async function getMeuPerfil() {
  const res = await fetch(`${API_URL}/usuarios/me`, { headers: getHeaders() });
  return handleResponse(res);
}

async function atualizarMeuPerfil(dados) {
  const res = await fetch(`${API_URL}/usuarios/me`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(dados)
  });
  return handleResponse(res);
}

async function uploadMeuAvatar(file) {
  const fd = new FormData();
  fd.append("avatar", file);
  const token = getToken();
  const res = await fetch(`${API_URL}/usuarios/me/avatar`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd
  });
  return handleResponse(res);
}

// ------------------- Exportar -------------------
window.api = {
  login,
  registrar,

  getOrganizacoes,
  criarOrganizacao,
  atualizarOrganizacao,
  deletarOrganizacao,

  getLocais,
  criarLocal,
  atualizarLocal,
  deletarLocal,

  getEquipamentos,
  criarEquipamento,
  atualizarEquipamento,
  deletarEquipamento,

  getChamados,
  criarChamado,
  atualizarStatusChamado,
  deletarChamado,

  getCategorias,

  getParticipacoes,
  getMinhaParticipacao,
  adicionarParticipacao,
  atualizarParticipacao,
  removerParticipacao,

  enviarMensagemPrivada,
  getConversas,
  getConversaCom,

  getMeuPerfil,
  atualizarMeuPerfil,
  uploadMeuAvatar
};
