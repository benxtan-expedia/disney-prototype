// NOTE: THIS IS NOT USED

/**
 * Server-Side Rendering Logic
 *
 * This module handles rendering React on the server.
 *
 * Key concepts:
 * 1. ChunkExtractor: Collects which code chunks are needed
 * 2. renderToString: Renders React to HTML string
 * 3. ServerStyleSheet: Collects styled-components styles
 * 4. State serialization: Passes initial state to client
 *
 * Flow:
 * 1. Create fresh store and context for this request
 * 2. Extract chunks using @loadable/server
 * 3. Collect styles using styled-components
 * 4. Render React tree to string
 * 5. Inject scripts, styles, and serialized state into HTML
 * 6. Send HTML to client
 * 7. Client hydrates with same state
 */

import React from "react";
import { renderToString } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";
import { ServerStyleSheet } from "styled-components";
import path from "path";
import App from "../App";
import { StoreProvider } from "../context/StoreContext";
import { AppContextProvider, defaultContextValue } from "../context/AppContext";
import { createAppStore } from "../stores/AppStore";
import { AppStore } from "../types/store";
import { AppContextType } from "../types/context";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";

interface RenderOptions {
  store?: AppStore;
  context?: AppContextType;
}

/**
 * Renders the React app to HTML string with SSR support
 * @param options - Optional initial store and context
 * @returns HTML string ready to send to client
 */
export const renderApp = (options: RenderOptions = {}): string => {
  const require = createRequire(import.meta.url);
  global.require = require;

  // Create store and context for this request
  const store = options.store || createAppStore();
  const context = options.context || defaultContextValue;

  // Setup @loadable/component chunk extraction
  //const statsFile = path.resolve(__dirname, "./public/loadable-stats.json");
  const statsFile = path.resolve("", "dist/public/loadable-stats.json");
  const chunkExtractor = new ChunkExtractor({
    statsFile,
    entrypoints: ["main"],
  });

  // Setup styled-components SSR
  const sheet = new ServerStyleSheet();

  try {
    // Wrap App with ChunkExtractor to track loaded components
    const jsx = chunkExtractor.collectChunks(
      sheet.collectStyles(
        <StoreProvider store={store}>
          <AppContextProvider value={context}>
            <App />
          </AppContextProvider>
        </StoreProvider>,
      ),
    );

    // Render React to HTML string
    const html = renderToString(jsx);

    // Get styled-components styles
    const styleTags = sheet.getStyleTags();

    // Get script tags for the chunks that were used
    const scriptTags = chunkExtractor.getScriptTags();
    const linkTags = chunkExtractor.getLinkTags();

    // Serialize state for hydration
    const serializedStore = JSON.stringify(store);
    const serializedContext = JSON.stringify(context);

    // Build the complete HTML page
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Disney Prototype</title>
          ${styleTags}
          ${linkTags}
        </head>
        <body>
          <div id="root">${html}</div>
          
          <script>
            // Inject initial state for hydration
            // The client will use this to create the store with the same state
            window.__INITIAL_STORE__ = ${serializedStore};
            window.__INITIAL_CONTEXT__ = ${serializedContext};
          </script>
          
          ${scriptTags}
        </body>
      </html>
    `;
  } catch (error) {
    console.error("SSR Error:", error);
    throw error;
  } finally {
    sheet.seal();
  }
};
