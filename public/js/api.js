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
    try {
        const data = text ? JSON.parse(text) : {};
        if (!res.ok) {
            console.error('API error body:', text);
            throw new Error(data.message || res.statusText || `Erro ${res.status}`);
        }
        return data;
    } catch (err) {
        // resposta não-JSON: log completo e lança erro com texto
        console.error('Resposta inválida (não JSON):', { status: res.status, text });
        throw new Error(text || err.message);
    }
}

async function carregarOrganizacoes() {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');

        const response = await fetch(`${API_URL}/organizacoes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Erro ao carregar organizações:', error);
        throw error;
    }
}

async function carregarCategorias() {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');

        const response = await fetch(`${API_URL}/categorias`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        throw error;
    }
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
    console.log('Tentando registrar usuário:', { nome, email });
    
    const res = await fetch(`${API_URL}/auth/registrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, email, senha })
    });

    const data = await res.json();
    console.log('Resposta do servidor:', data);
    
    return data;
  } catch (error) {
    console.error('Erro ao registrar:', error);
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

async function carregarEquipamentos(localId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');

        const response = await fetch(`${API_URL}/equipamentos/local/${localId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        throw error;
    }
}

async function criarEquipamento(localId, dados) {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');

        const response = await fetch(`${API_URL}/equipamentos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...dados,
                id_local: localId
            })
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Erro ao criar equipamento:', error);
        throw error;
    }
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

async function carregarChamados(equipamentoId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');

        const response = await fetch(`${API_URL}/chamados/equipamento/${equipamentoId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Erro ao carregar chamados:', error);
        throw error;
    }
}

async function criarChamado(dados) {
    console.log('[OUT] criarChamado payload:', dados, 'tokenExists:', !!localStorage.getItem('token'));
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/chamados`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
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
