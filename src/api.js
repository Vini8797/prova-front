import { API_URL } from "./config";

// Toda chamada ao back manda o token no header Authorization.
async function requisicao(caminho, token, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`;
    try {
      const corpo = await resposta.json();
      if (corpo.message) mensagem += `: ${corpo.message}`;
    } catch {
      // resposta sem JSON (ex.: 401 do Spring Security, 502 quando o back esta fora)
    }
    if (resposta.status === 401 && mensagem === "Erro 401") {
      mensagem += ": token ausente ou invalido (confira domain/audience no back e no front)";
    }
    throw new Error(mensagem);
  }

  if (resposta.status === 204) return null;
  return resposta.json();
}

// ===== Rotas do back ===== (TODO [PROVA] trocar /avaliacoes pela rota do enunciado)

export function listarAvaliacoes(token) {
  return requisicao("/avaliacoes", token);
}

export function criarAvaliacao(token, dados) {
  return requisicao("/avaliacoes", token, {
    method: "POST",
    body: JSON.stringify(dados),
  });
}
