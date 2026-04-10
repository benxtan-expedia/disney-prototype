/**
 * Hapi Server with SSR
 *
 * This is the main server file using Hapi.js.
 *
 * Responsibilities:
 * 1. Serve static assets (JS/CSS bundles)
 * 2. Handle SSR for the React app
 * 3. Provide health check endpoint
 *
 * Hapi is chosen for:
 * - Simple configuration
 * - Good plugin ecosystem
 * - Built-in routing
 * - Easy to understand for beginners
 */

import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import path from "path";
import { renderApp } from "./render";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
global.require = require;

/**
 * Initialize the Hapi server
 */
const init = async () => {
  // Create server instance
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
    routes: {
      files: {
        relativeTo: path.join(__dirname, "public"),
      },
    },
  });

  // Register Inert plugin for static file serving
  await server.register(Inert);

  /**
   * Static assets route
   * Serves bundled JS, CSS, and other static files
   */
  server.route({
    method: "GET",
    path: "/static/{param*}",
    handler: {
      directory: {
        path: ".",
        redirectToSlash: true,
      },
    },
  });

  /**
   * Health check route
   * Useful for monitoring and load balancers
   */
  server.route({
    method: "GET",
    path: "/health",
    handler: (request, h) => {
      return { status: "ok", timestamp: new Date().toISOString() };
    },
  });

  /**
   * Main SSR route
   * Handles all other requests and renders the React app
   */
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: (request, h) => {
      try {
        // Render the React app with SSR
        const html = renderApp();

        // Return HTML response
        return h.response(html).type("text/html");
      } catch (error) {
        console.error("Server rendering error:", error);

        // Return error page
        return h
          .response(
            `
          <!DOCTYPE html>
          <html>
            <head><title>Error</title></head>
            <body>
              <h1>Server Error</h1>
              <p>Something went wrong during server-side rendering.</p>
              <pre>${error}</pre>
            </body>
          </html>
        `,
          )
          .code(500)
          .type("text/html");
      }
    },
  });

  // Start the server
  await server.start();
  console.log("");
  console.log("🚀 Server running on %s", server.info.uri);
  console.log("");
  console.log("📝 Routes:");
  console.log("   GET  /           - React app with SSR");
  console.log("   GET  /health     - Health check");
  console.log("   GET  /static/*   - Static assets");
  console.log("");
};

/**
 * Error handling
 */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

// Start the server
init();
