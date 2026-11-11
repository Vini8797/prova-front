// Mostra o token (para copiar e testar a API no PowerShell) e o que tem dentro dele.
// Se as roles ou o email nao aparecerem aqui, o problema esta na Action do Auth0.
export default function PainelToken({ token, payload }) {
  if (!token) return null;

  return (
    <details className="card painel-token">
      <summary>Ver token (para testes)</summary>

      <p className="discreto">Access token:</p>
      <code className="token">{token}</code>
      <button
        className="botao botao-secundario"
        onClick={() => navigator.clipboard.writeText(token)}
      >
        Copiar token
      </button>

      <p className="discreto">Conteúdo (payload):</p>
      <pre>{JSON.stringify(payload, null, 2)}</pre>
    </details>
  );
}
