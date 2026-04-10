import "./index.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./context/StoreContext";
import { createAppStore } from "./stores/AppStore";
import { AppStore } from "./types/store";
import { AppContextType } from "./types/context";
import { AppContextProvider } from "./context/AppContext";

/**
 * Extend Window interface to include our injected properties
 */
declare global {
  interface Window {
    __INITIAL_STORE__?: AppStore;
    __INITIAL_CONTEXT__?: AppContextType;
  }
}

// Restore store state from server
const initialStore = window.__INITIAL_STORE__;
const store = createAppStore(initialStore);

// Restore context from server
const context = window.__INITIAL_CONTEXT__;

if (!context) {
  throw new Error("Initial context not found");
}

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <StoreProvider store={store}>
      <AppContextProvider value={context}>
        <App />
      </AppContextProvider>
    </StoreProvider>
  </StrictMode>,
);

console.log("✅ App hydrated successfully!");
console.log("📦 Store state:", store);
console.log("🌍 Context:", context);
