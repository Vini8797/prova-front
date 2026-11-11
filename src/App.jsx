import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Avaliacoes from "./Avaliacoes";
import PainelToken from "./PainelToken";
import { useAuthToken } from "./useAuthToken";

export default function App() {
  const { isLoading, isAuthenticated, user, error } = useAuth0();
  const { token, payload, email, isAdmin, erro } = useAuthToken();

  if (isLoading) {
    return <div className="centro">Carregando...</div>;
  }

  // Nao logado: so a tela de login
  if (!isAuthenticated) {
    return (
      <div className="centro">
        <div className="card login">
          <h1>Avaliações</h1>
          <p className="discreto">Entre com sua conta para continuar.</p>
          {error && <div className="alerta">{error.message}</div>}
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="pagina">
      <header className="topo">
        <div>
          <h1>Avaliações</h1>
          <span className="discreto">{email || user?.email}</span>
          <span className={isAdmin ? "selo selo-admin" : "selo"}>
            {isAdmin ? "ADMIN" : "USER"}
          </span>
        </div>
        <LogoutButton />
      </header>

      {erro && <div className="alerta">{erro}</div>}

      {token ? (
        <Avaliacoes token={token} isAdmin={isAdmin} />
      ) : (
        <p className="discreto">Buscando token...</p>
      )}

      <PainelToken token={token} payload={payload} />
    </div>
  );
}
