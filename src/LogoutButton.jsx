import { useAuth0 } from "@auth0/auth0-react";

export default function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <button
      className="botao botao-secundario"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    >
      Sair
    </button>
  );
}
