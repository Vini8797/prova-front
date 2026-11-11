import { useEffect, useState } from "react";
import { criarAvaliacao, listarAvaliacoes } from "./api";

// TODO [PROVA] campos do formulario = campos do DTO do back (AvaliacaoRequest)
const FORMULARIO_VAZIO = { emailAvaliado: "", comentarios: "", nota: "" };

export default function Avaliacoes({ token, isAdmin }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
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
      setAvaliacoes(await listarAvaliacoes(token));
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
      const nova = await criarAvaliacao(token, {
        emailAvaliado: form.emailAvaliado,
        comentarios: form.comentarios,
        nota: Number(form.nota),
      });
      setAvaliacoes((anteriores) => [nova, ...anteriores]);
      setForm(FORMULARIO_VAZIO);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      {erro && <div className="alerta">{erro}</div>}

      {/* Cadastro: so aparece para ADMIN (o back tambem bloqueia com 403) */}
      {isAdmin ? (
        <section className="card">
          <h2>Nova avaliação</h2>
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
              Nota (0 a 10)
              <input
                type="number"
                name="nota"
                min="0"
                max="10"
                value={form.nota}
                onChange={alterarCampo}
                required
              />
            </label>

            <label className="largo">
              Comentários
              <textarea
                name="comentarios"
                rows="3"
                value={form.comentarios}
                onChange={alterarCampo}
                required
              />
            </label>

            <button type="submit" className="botao" disabled={enviando}>
              {enviando ? "Salvando..." : "Cadastrar avaliação"}
            </button>
          </form>
        </section>
      ) : (
        <p className="aviso">Você está como USER: pode ver as avaliações, mas só ADMIN cadastra.</p>
      )}

      <section className="card">
        <div className="titulo-secao">
          <h2>Avaliações cadastradas</h2>
          <button className="botao botao-secundario" onClick={carregar}>
            Atualizar
          </button>
        </div>

        {carregando ? (
          <p className="discreto">Carregando...</p>
        ) : avaliacoes.length === 0 ? (
          <p className="discreto">Nenhuma avaliação ainda.</p>
        ) : (
          <div className="tabela-rolagem">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Avaliador</th>
                  <th>Avaliado</th>
                  <th>Nota</th>
                  <th>Comentários</th>
                </tr>
              </thead>
              <tbody>
                {avaliacoes.map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.dataAvaliacao).toLocaleString("pt-BR")}</td>
                    <td>{a.emailAvaliador}</td>
                    <td>{a.emailAvaliado}</td>
                    <td className="nota">{a.nota}</td>
                    <td>{a.comentarios}</td>
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
