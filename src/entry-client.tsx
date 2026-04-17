import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./context/StoreContext";
import { createAppStore } from "./stores/AppStore";
import { AppStore } from "./types/store";
import { AppContextType } from "./types/context";
import { AppContextProvider, defaultContextValue } from "./context/AppContext";

/**
 * Extend Window interface to include our injected properties
 */
declare global {
  interface Window {
    __INITIAL_STORE__?: AppStore;
    __INITIAL_CONTEXT__?: AppContextType;
  }
}

// Restore store state from server, or create a fresh one (static/SPA mode)
const initialStore = window.__INITIAL_STORE__;
const store = createAppStore(initialStore);

// Restore context from server, or fall back to defaults (static/SPA mode)
const context = window.__INITIAL_CONTEXT__ ?? defaultContextValue;

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <StoreProvider store={store}>
      <AppContextProvider value={context}>
        <App />
      </AppContextProvider>
    </StoreProvider>
  </StrictMode>,
);
