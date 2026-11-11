import { useEffect, useState } from "react";
import { criarArtigo, deletarArtigo, listarArtigos } from "./api";

// Campos do formulario = campos do DTO do back (ArtigoRequest)
const FORMULARIO_VAZIO = { emailAvaliado: "", titulo: "", descricao: "", prioridade: "" };

export default function Artigos({ token, isAdmin }) {
  const [artigos, setArtigos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState(FORMULARIO_VAZIO);
  const [enviando, setEnviando] = useState(false);

  // Busca a lista assim que o token estiver disponivel
  useEffect(() => {
    carregar();
  }, [token]);

  async function carregar() {
    try {
      setCarregando(true);
      setErro("");
      setArtigos(await listarArtigos(token));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  function alterarCampo(e) {
    const { name, value } = e.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(e) {
    e.preventDefault();
    try {
      setEnviando(true);
      setErro("");
      const novo = await criarArtigo(token, {
        emailAvaliado: form.emailAvaliado,
        titulo: form.titulo,
        descricao: form.descricao,
        prioridade: Number(form.prioridade),
      });
      setArtigos((anteriores) => [novo, ...anteriores]);
      setForm(FORMULARIO_VAZIO);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  async function remover(id) {
    if (!confirm(`Excluir o artigo ${id}?`)) return;
    try {
      setErro("");
      await deletarArtigo(token, id);
      setArtigos((anteriores) => anteriores.filter((a) => a.id !== id));
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <>
      {erro && <div className="alerta">{erro}</div>}

      {/* POST /artigo: qualquer usuario logado */}
      <section className="card">
        <h2>Novo artigo</h2>
        <form onSubmit={enviar} className="formulario">
          <label>
            Email do avaliado
            <input
              type="email"
              name="emailAvaliado"
              value={form.emailAvaliado}
              onChange={alterarCampo}
              placeholder="user@social.com"
              required
            />
          </label>

          <label>
            Prioridade (0 a 10)
            <input
              type="number"
              name="prioridade"
              min="0"
              max="10"
              value={form.prioridade}
              onChange={alterarCampo}
              required
            />
          </label>

          <label className="largo">
            Título
            <input
              type="text"
              name="titulo"
              maxLength="1000"
              value={form.titulo}
              onChange={alterarCampo}
              required
            />
          </label>

          <label className="largo">
            Descrição
            <textarea
              name="descricao"
              rows="3"
              maxLength="1000"
              value={form.descricao}
              onChange={alterarCampo}
              required
            />
          </label>

          <button type="submit" className="botao" disabled={enviando}>
            {enviando ? "Salvando..." : "Cadastrar artigo"}
          </button>
        </form>
      </section>

      <section className="card">
        <div className="titulo-secao">
          <h2>Artigos cadastrados</h2>
          <button className="botao botao-secundario" onClick={carregar}>
            Atualizar
          </button>
        </div>

        {carregando ? (
          <p className="discreto">Carregando...</p>
        ) : artigos.length === 0 ? (
          <p className="discreto">Nenhum artigo ainda.</p>
        ) : (
          <div className="tabela-rolagem">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Autor</th>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Prioridade</th>
                  {isAdmin && <th></th>}
                </tr>
              </thead>
              <tbody>
                {artigos.map((a) => (
                  <tr key={a.id}>
                    <td>{a.dataAbertura ? new Date(a.dataAbertura).toLocaleString("pt-BR") : "-"}</td>
                    <td>{a.emailAvaliador}</td>
                    <td>{a.titulo}</td>
                    <td>{a.descricao}</td>
                    <td className="nota">{a.prioridade}</td>
                    {/* DELETE /artigo/{id}: so ADMIN (o back responde 403 para USER) */}
                    {isAdmin && (
                      <td>
                        <button className="botao botao-secundario" onClick={() => remover(a.id)}>
                          Excluir
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
