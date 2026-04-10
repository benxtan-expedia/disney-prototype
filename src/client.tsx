// THIS IS NOT USED

/**
 * Client Entry Point
 *
 * This file runs in the browser and handles client-side hydration.
 *
 * Key concepts:
 * 1. Hydration: Attaches event listeners to server-rendered HTML
 * 2. State restoration: Uses state from window.__INITIAL_STORE__
 * 3. Code splitting: @loadable/component handles chunk loading
 *
 * Flow:
 * 1. Read serialized state from server (injected in HTML)
 * 2. Create store with same initial state
 * 3. Hydrate React (don't re-render, just attach events)
 * 4. App becomes fully interactive
 *
 * Why hydration instead of render?
 * - Server already generated the HTML
 * - We just need to make it interactive
 * - Faster than re-rendering everything
 * - Avoids flash of unstyled content
 */

import React from "react";
import { hydrateRoot } from "react-dom/client";
import { loadableReady } from "@loadable/component";
import App from "./App";
import { StoreProvider } from "./context/StoreContext";
import { AppContextProvider } from "./context/AppContext";
import { createAppStore } from "./stores/AppStore";
import { AppStore } from "./types/store";
import { AppContextType } from "./types/context";

/**
 * Extend Window interface to include our injected properties
 */
declare global {
  interface Window {
    __INITIAL_STORE__?: AppStore;
    __INITIAL_CONTEXT__?: AppContextType;
  }
}

/**
 * Main client initialization
 * Waits for @loadable chunks to be ready, then hydrates
 */
const main = async () => {
  // Wait for all loadable components to be ready
  // This ensures code-split chunks are loaded before hydration
  await loadableReady(() => {
    // Get the root element
    const rootElement = document.getElementById("root");

    if (!rootElement) {
      throw new Error("Root element not found");
    }

    // Restore store state from server
    const initialStore = window.__INITIAL_STORE__;
    const store = createAppStore(initialStore);

    // Restore context from server
    const context = window.__INITIAL_CONTEXT__;

    if (!context) {
      throw new Error("Initial context not found");
    }

    // Hydrate the app
    // hydrateRoot is used instead of createRoot because we have SSR HTML
    hydrateRoot(
      rootElement,
      <StoreProvider store={store}>
        <AppContextProvider value={context}>
          <App />
        </AppContextProvider>
      </StoreProvider>,
    );

    console.log("✅ App hydrated successfully!");
    console.log("📦 Store state:", store);
    console.log("🌍 Context:", context);
  });
};

// Start the app
main().catch((error) => {
  console.error("❌ Client initialization error:", error);
});
