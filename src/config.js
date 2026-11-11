// ===================================================================

// ===================================================================

// "Domain" da Application (sem https://)
export const AUTH0_DOMAIN = "dev-wnqdvpnqvqkduz4t.us.auth0.com";

// "Client ID" da Application
export const AUTH0_CLIENT_ID = "bKpXErpPq7GpTkq7xgPNxS8yIhrq5O1z";

// Applications -> APIs -> Auth0 Management API -> "Identifier"
// TEM que ser igual ao audience do application.properties do back
export const AUTH0_AUDIENCE = "https://dev-wnqdvpnqvqkduz4t.us.auth0.com/api/v2/";

// Namespace usado na Action post-login (igual ao TokenUtils.NAMESPACE do back)
export const NAMESPACE = "https://social-insper.com/";

// Todas as chamadas ao back comecam com /api.
// Local: o vite.config.js redireciona para localhost:8080.
// Vercel: o vercel.json redireciona para o IP da VM.
export const API_URL = "/api";
