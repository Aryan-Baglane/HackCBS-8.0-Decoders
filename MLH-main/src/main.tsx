import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserRouter } from "react-router-dom";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

const onRedirectCallback = (appState?: any) => {
  const target = appState?.returnTo || window.location.pathname;

  // ✅ Instead of replaceState — force SPA navigation
  window.location.href = target;
};

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>
);
