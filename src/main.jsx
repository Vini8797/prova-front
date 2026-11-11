import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App.jsx'
import './index.css'
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE } from './config.js'

// O Auth0Provider envolve o app inteiro: qualquer componente pode usar useAuth0()
createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId={AUTH0_CLIENT_ID}
    authorizationParams={{
      audience: AUTH0_AUDIENCE,
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>,
)
