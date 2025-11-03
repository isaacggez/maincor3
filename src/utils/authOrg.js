const Local = require("../models/Local");
const Equipamento = require("../models/Equipamento");
const Participacao = require("../models/Participacao");

/**
 * checkOrgRole(idUsuario, params, allowedRoles)
 * params pode ter: id_organizacao, id_local, id_equipamento
 * allowedRoles: [] -> qualquer participante; ['tecnico'] -> tecnico ou administrador
 */
async function checkOrgRole(idUsuario, params = {}, allowedRoles = []) {
  if (!idUsuario) return { ok: false, status: 401, message: "Usuário não autenticado" };

  let id_organizacao = params.id_organizacao;

  if (!id_organizacao && params.id_local) {
    const local = await Local.buscarPorId(params.id_local);
    if (!local) return { ok: false, status: 404, message: "Local não encontrado" };
    id_organizacao = local.id_organizacao;
  }

  if (!id_organizacao && params.id_equipamento) {
    const eq = await Equipamento.buscarPorId(params.id_equipamento);
    if (!eq) return { ok: false, status: 404, message: "Equipamento não encontrado" };
    const local = await Local.buscarPorId(eq.id_local);
    if (!local) return { ok: false, status: 404, message: "Local do equipamento não encontrado" };
    id_organizacao = local.id_organizacao;
  }

  if (!id_organizacao) return { ok: false, status: 400, message: "Não foi possível resolver organização" };

  const participacao = await Participacao.buscarPorUsuarioEOrganizacao(idUsuario, id_organizacao);
  if (!participacao) return { ok: false, status: 403, message: "Usuário não participa desta organização" };

  // se não houver roles exigidas, qualquer participante ok
  if (!allowedRoles || allowedRoles.length === 0) return { ok: true, participacao, id_organizacao };

  // administrador sempre tem permissão
  if (participacao.cargo === "administrador") return { ok: true, participacao, id_organizacao };

  if (allowedRoles.includes(participacao.cargo)) return { ok: true, participacao, id_organizacao };

  return { ok: false, status: 403, message: "Permissão negada" };
}

module.exports = { checkOrgRole };