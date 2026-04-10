import { enableStaticRendering } from "mobx-react-lite";
enableStaticRendering(true);

import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";
import { ServerStyleSheet } from "styled-components";
import path from "path";
import fs from "fs";
import { StoreProvider } from "../context/StoreContext";
import { AppContextProvider, defaultContextValue } from "../context/AppContext";
import { createAppStore } from "../stores/AppStore";
import { AppStore } from "../types/store";
import { AppContextType } from "../types/context";
import App from "../App";

const isProd = process.env.NODE_ENV === "production";

interface RenderOptions {
  store?: AppStore;
  context?: AppContextType;
}

export function render(_url: string, options: RenderOptions = {}) {
  // Create store and context for this request
  const store = options.store || createAppStore();
  const context = options.context || defaultContextValue;

  /*
  // Setup @loadable/component chunk extraction
  //const statsFile = path.resolve(__dirname, "./public/loadable-stats.json");
  const statsFile = path.resolve("dist/public/loadable-stats.json");
  const chunkExtractor = new ChunkExtractor({
    statsFile,
    entrypoints: ["main"],
  });
  */

  let statsFile;
  let extractor;

  if (isProd) {
    // PRODUCTION: Use the generated stats file from the build
    statsFile = path.resolve(__dirname, "./dist/client/loadable-stats.json");

    // Check if file exists to avoid hanging
    if (!fs.existsSync(statsFile)) {
      throw new Error(
        "loadable-stats.json not found. Run npm run build first.",
      );
    }

    extractor = new ChunkExtractor({
      statsFile,
      entrypoints: ["main"], // Matches your entry point name
    });
  }

  // Setup styled-components SSR
  const sheet = new ServerStyleSheet();

  try {
    let jsx;
    if (isProd && extractor) {
      // Wrap App with ChunkExtractor to track loaded components
      jsx = extractor.collectChunks(
        sheet.collectStyles(
          <StoreProvider store={store}>
            <AppContextProvider value={context}>
              <App />
            </AppContextProvider>
          </StoreProvider>,
        ),
      );
    } else {
      jsx = (
        <StoreProvider store={store}>
          <AppContextProvider value={context}>
            <App />
          </AppContextProvider>
        </StoreProvider>
      );
    }

    // Render React to HTML string
    const html = renderToString(jsx);

    // Serialize state for hydration
    const serializedStore = JSON.stringify(store);
    const serializedContext = JSON.stringify(context);

    // Build the complete HTML page
    return `
          ${html} 
          
          <script>
            // Inject initial state for hydration
            // The client will use this to create the store with the same state
            window.__INITIAL_STORE__ = ${serializedStore};
            window.__INITIAL_CONTEXT__ = ${serializedContext};
          </script>
    `;
  } catch (error) {
    console.error("SSR Error:", error);
    throw error;
  } finally {
  }
}
