import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { NAMESPACE } from "./config";

// O token JWT tem 3 partes separadas por ponto. A do meio (payload) e um JSON em base64.
export function decodificarToken(token) {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

// Pega o access token do Auth0 e le o email e as roles que a Action colocou nele.
export function useAuthToken() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState("");
  const [payload, setPayload] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    getAccessTokenSilently()
      .then((accessToken) => {
        setToken(accessToken);
        setPayload(decodificarToken(accessToken));
      })
      .catch((e) => setErro("Erro ao buscar token: " + e.message));
  }, [isAuthenticated, getAccessTokenSilently]);

  const roles = payload?.[NAMESPACE + "roles"] || [];
  const email = payload?.[NAMESPACE + "email"] || "";

  return { token, payload, roles, email, isAdmin: roles.includes("ADMIN"), erro };
}
