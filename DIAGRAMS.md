# React Skeleton App - Visual Architecture 🎨

This document provides visual diagrams to help understand the application architecture.

---

## 🏗️ Application Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       BROWSER (CLIENT)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React App (Hydrated)                   │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  App.tsx                                            │  │  │
│  │  │  ├─ Header (styled-component)                       │  │  │
│  │  │  ├─ InputModule (loadable, ssr: true)              │  │  │
│  │  │  ├─ ButtonModule (loadable, ssr: true)             │  │  │
│  │  │  └─ TestModule (loadable, ssr: true)               │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                           ↕                              │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │        Context & State Providers                   │  │  │
│  │  │  ┌──────────────────┐  ┌──────────────────┐       │  │  │
│  │  │  │ StoreProvider    │  │ AppContextProvider│       │  │  │
│  │  │  │ (MobX Store)     │  │ (Config/Locale)   │       │  │  │
│  │  │  └──────────────────┘  └──────────────────┘       │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Entry Point: client.tsx                                        │
│  - Reads window.__INITIAL_STORE__ and window.__INITIAL_CONTEXT__│
│  - Creates store with serialized state                          │
│  - Calls hydrateRoot() to attach event listeners                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                        HTTP Request/Response
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER (NODE.JS)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Hapi.js HTTP Server                         │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Routes                                             │  │  │
│  │  │  ├─ GET /           → SSR Handler                   │  │  │
│  │  │  ├─ GET /health     → Health Check                  │  │  │
│  │  │  └─ GET /static/*   → Static Assets                 │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               SSR Rendering Pipeline                      │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  1. Create fresh store & context                   │  │  │
│  │  │  2. ChunkExtractor wraps app                       │  │  │
│  │  │  3. ServerStyleSheet collects styles               │  │  │
│  │  │  4. renderToString() → HTML                        │  │  │
│  │  │  5. Collect script tags for chunks                 │  │  │
│  │  │  6. Serialize state to JavaScript                  │  │  │
│  │  │  7. Build complete HTML page                       │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Entry Point: server/index.ts                                   │
│  SSR Logic: server/render.tsx                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Request/Response Flow

```
┌────────────┐
│  Browser   │
└──────┬─────┘
       │ 1. HTTP GET /
       ↓
┌─────────────────────────┐
│   Hapi Server receives  │
│   request               │
└──────┬──────────────────┘
       │ 2. Call renderApp()
       ↓
┌─────────────────────────────────────────┐
│  Server-Side Rendering                  │
│  ─────────────────────────              │
│  3. Create MobX store                   │
│     const store = createAppStore()      │
│                                          │
│  4. Create context                      │
│     const context = defaultContextValue │
│                                          │
│  5. Setup ChunkExtractor                │
│     (reads loadable-stats.json)         │
│                                          │
│  6. Setup ServerStyleSheet              │
│     (for styled-components)             │
│                                          │
│  7. Wrap app with providers             │
│     <StoreProvider>                     │
│       <AppContextProvider>              │
│         <App />                         │
│                                          │
│  8. Render to string                    │
│     const html = renderToString(app)    │
│                                          │
│  9. Collect CSS & JS chunks             │
│     const styles = sheet.getStyleTags() │
│     const scripts = chunk.getScriptTags()│
│                                          │
│  10. Serialize state                    │
│      window.__INITIAL_STORE__ = {...}   │
│      window.__INITIAL_CONTEXT__ = {...} │
│                                          │
│  11. Build complete HTML                │
└──────┬──────────────────────────────────┘
       │ 12. Send HTML response
       ↓
┌─────────────────────────────────────────┐
│  HTML Response                          │
│  ──────────────                         │
│  <!DOCTYPE html>                        │
│  <html>                                 │
│    <head>                               │
│      <style>/* SSR styles */</style>    │
│    </head>                              │
│    <body>                               │
│      <div id="root">                    │
│        <!-- Rendered HTML -->           │
│      </div>                             │
│      <script>                           │
│        window.__INITIAL_STORE__ = {...} │
│        window.__INITIAL_CONTEXT__ = {...}│
│      </script>                          │
│      <script src="/static/main.js">     │
│      <script src="/static/inputModule.js">│
│      <script src="/static/buttonModule.js">│
│      <script src="/static/testModule.js">│
│    </body>                              │
│  </html>                                │
└──────┬──────────────────────────────────┘
       │ 13. Browser receives HTML
       ↓
┌─────────────────────────────────────────┐
│  Browser Processing                     │
│  ─────────────────                      │
│  14. Parse HTML                         │
│  15. Render page (with SSR content)     │
│      → User sees content immediately!   │
│                                          │
│  16. Download JavaScript chunks         │
│      - main.js                          │
│      - inputModule.js                   │
│      - buttonModule.js                  │
│      - testModule.js                    │
│                                          │
│  17. Execute client.tsx                 │
│      await loadableReady()              │
│                                          │
│  18. Read serialized state              │
│      const store = window.__INITIAL_STORE__│
│      const context = window.__INITIAL_CONTEXT__│
│                                          │
│  19. Hydrate React                      │
│      hydrateRoot(root, <App />)         │
│      (Attaches event listeners)         │
│                                          │
│  20. App is now interactive! 🎉        │
└─────────────────────────────────────────┘
```

---

## 🧩 Component Loading Flow

```
App.tsx needs modules
       ↓
┌──────────────────────────────────────┐
│  Component Mapper (utils/componentMapper.ts) │
├──────────────────────────────────────┤
│  const componentMapper = {           │
│    inputModule: loadable(            │
│      () => import('./InputModule'),  │
│      { ssr: true }                   │
│    ),                                 │
│    buttonModule: loadable(...)       │
│    testModule: loadable(...)         │
│  }                                    │
└──────┬───────────────────────────────┘
       │
       ├─────────────────┬──────────────────┬─────────────────┐
       ↓                 ↓                  ↓                 ↓
┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ InputModule │  │ ButtonModule │  │ TestModule   │  │ (Future...)  │
│  .tsx       │  │   .tsx       │  │   .tsx       │  │              │
└─────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
       │                 │                  │                 │
       │ Webpack creates separate chunks for each module     │
       │                 │                  │                 │
       ↓                 ↓                  ↓                 ↓
┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ inputModule │  │ buttonModule │  │ testModule   │  │              │
│ .[hash].js  │  │  .[hash].js  │  │  .[hash].js  │  │              │
└─────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

ON SERVER:
- All modules render during SSR
- ChunkExtractor tracks which were used
- Generates <script> tags for those chunks

ON CLIENT:
- loadableReady() waits for chunks to load
- Then hydrates with all modules available
```

---

## 📦 MobX State Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      MobX Store                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  class AppStoreImpl {                                   │ │
│  │    @observable text = "Hello World"                     │ │
│  │                                                          │ │
│  │    @action setText(newText: string) {                   │ │
│  │      this.text = newText  ← ONLY way to modify state   │ │
│  │    }                                                     │ │
│  │  }                                                       │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────┬────────────────────────────────────────────────┘
             │ Provided via StoreContext
             ↓
    ┌────────────────────────────┐
    │   Components access via    │
    │   useStore() hook          │
    └────────┬───────────────────┘
             │
   ┌─────────┴────────────┬────────────────┬────────────────┐
   ↓                      ↓                ↓                ↓
┌─────────────────┐  ┌───────────────┐  ┌──────────────┐  ┌──────────┐
│  InputModule    │  │ ButtonModule  │  │ TestModule   │  │ (Others) │
│  (OBSERVER)     │  │  (OBSERVER)   │  │  (OBSERVER)  │  │          │
│                 │  │               │  │              │  │          │
│  Reads:         │  │  Reads & Writes: │  Reads:      │  │          │
│  store.text     │  │  store.setText() │  store.text  │  │          │
└─────────────────┘  └───────────────┘  └──────────────┘  └──────────┘
       ↑                      │                ↑
       │                      │                │
       │  When store.text changes, MobX automatically re-renders
       │  only the components that use that observable
       │                      │
       └──────────────────────┴────────────────┘
                              
USER INTERACTION:
1. User clicks button in ButtonModule
2. Calls store.setText("New text")
3. MobX detects observable change
4. MobX re-renders InputModule (uses store.text)
5. UI updates instantly! ✨
```

---

## 🎨 Styled Components SSR Flow

```
SERVER SIDE:
┌────────────────────────────────────┐
│  1. Create ServerStyleSheet        │
│     const sheet = new              │
│     ServerStyleSheet()             │
└────────┬───────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│  2. Wrap app with collectStyles    │
│     sheet.collectStyles(<App />)   │
└────────┬───────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│  3. Render app                     │
│     Components create styled-      │
│     components during render       │
│                                     │
│     const Button = styled.button`  │
│       color: blue;                 │
│     `                               │
│                                     │
│     Sheet collects these styles    │
└────────┬───────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│  4. Get collected styles           │
│     const styleTags =              │
│       sheet.getStyleTags()         │
│                                     │
│     Returns:                       │
│     <style data-styled="...">      │
│       .button-abc123 {             │
│         color: blue;               │
│       }                             │
│     </style>                       │
└────────┬───────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│  5. Inject in HTML <head>          │
│     <head>                         │
│       ${styleTags}                 │
│     </head>                        │
└────────────────────────────────────┘

CLIENT SIDE:
┌────────────────────────────────────┐
│  Browser receives HTML with        │
│  embedded styles                   │
│                                     │
│  → No flash of unstyled content!   │
│  → Styles applied immediately      │
│                                     │
│  When React hydrates:              │
│  - Styled-components takes over    │
│  - Future style updates handled    │
│    by client-side styled-components│
└────────────────────────────────────┘
```

---

## 🔧 Build Process Flow

```
npm run build
    │
    ├─────────────────────┬─────────────────────┐
    ↓                     ↓                     ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│webpack.client.js  webpack.server.js    Both use     │
│              │  │              │  │  .babelrc      │
└──────┬───────┘  └───────┬──────┘  └──────────────┘
       │                  │
       ↓                  ↓
┌──────────────────┐  ┌─────────────────┐
│ CLIENT BUILD     │  │ SERVER BUILD    │
│                  │  │                 │
│ Entry:           │  │ Entry:          │
│ src/client.tsx   │  │ server/index.ts │
│                  │  │                 │
│ Target:          │  │ Target:         │
│ Browser          │  │ Node.js         │
│                  │  │                 │
│ Output:          │  │ Output:         │
│ dist/public/     │  │ dist/server.js  │
│   main.[hash].js │  │                 │
│   inputModule.js │  │ Externals:      │
│   buttonModule.js│  │ node_modules    │
│   testModule.js  │  │ (not bundled)   │
│   loadable-      │  │                 │
│   stats.json     │  │                 │
└──────────────────┘  └─────────────────┘

TYPESCRIPT COMPILATION:
.tsx/.ts files
     ↓
Babel with @babel/preset-typescript
     ↓
JavaScript (ES modules)
     ↓
Webpack bundles
     ↓
Output bundles

CODE SPLITTING:
import('./Module')
     ↓
Webpack detects dynamic import
     ↓
Creates separate chunk
     ↓
Module.[hash].js
```

---

## 📊 File Dependencies Graph

```
                           package.json
                                │
                    ┌───────────┼───────────┐
                    ↓           ↓           ↓
              tsconfig.json  .babelrc  webpack configs
                    │           │           │
                    └───────────┼───────────┘
                                ↓
                           Build Process
                                │
        ┌───────────────────────┼───────────────────────┐
        ↓                       ↓                       ↓
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Types      │      │  Context     │      │   Stores     │
│  context.ts  │──────│AppContext.tsx│      │ AppStore.ts  │
│  store.ts    │      │StoreContext  │──────│              │
│ components.ts│      └──────────────┘      └──────────────┘
└──────────────┘              │                     │
                              │                     │
                  ┌───────────┴─────────────┬───────┘
                  ↓                         ↓
          ┌──────────────┐          ┌──────────────┐
          │  Modules     │          │    Utils     │
          │ Input.tsx    │◄─────────│componentMapper
          │ Button.tsx   │          └──────────────┘
          │ Test.tsx     │                 │
          └──────────────┘                 │
                  │                        │
                  └───────────┬────────────┘
                              ↓
                        ┌──────────┐
                        │ App.tsx  │
                        └─────┬────┘
                              │
                  ┌───────────┴───────────┐
                  ↓                       ↓
          ┌──────────────┐        ┌──────────────┐
          │  client.tsx  │        │server/render │
          │ (Browser)    │        │    (SSR)     │
          └──────────────┘        └──────┬───────┘
                                         │
                                  ┌──────────────┐
                                  │server/index  │
                                  │  (Hapi)      │
                                  └──────────────┘
```

---

## 🎯 Context & Store Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    React Component Tree                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  <StoreProvider store={mobxStore}>                          │
│    Provides: MobX store                                      │
│    Hook: useStore()                                          │
│                                                              │
│    ┌─────────────────────────────────────────────────────┐ │
│    │  <AppContextProvider value={contextData}>           │ │
│    │    Provides: App configuration                      │ │
│    │    Hook: useAppContext()                            │ │
│    │                                                      │ │
│    │    ┌─────────────────────────────────────────────┐ │ │
│    │    │  <App>                                       │ │ │
│    │    │                                              │ │ │
│    │    │    ┌──────────────────┐                     │ │ │
│    │    │    │  <InputModule>   │                     │ │ │
│    │    │    │  Uses:           │                     │ │ │
│    │    │    │  - useStore()    │                     │ │ │
│    │    │    │  - useAppContext()│                     │ │ │
│    │    │    └──────────────────┘                     │ │ │
│    │    │                                              │ │ │
│    │    │    ┌──────────────────┐                     │ │ │
│    │    │    │ <ButtonModule>   │                     │ │ │
│    │    │    │  Uses:           │                     │ │ │
│    │    │    │  - useStore()    │                     │ │ │
│    │    │    └──────────────────┘                     │ │ │
│    │    │                                              │ │ │
│    │    │    ┌──────────────────┐                     │ │ │
│    │    │    │  <TestModule>    │                     │ │ │
│    │    │    │  Uses:           │                     │ │ │
│    │    │    │  - useAppContext()│                     │ │ │
│    │    │    └──────────────────┘                     │ │ │
│    │    │                                              │ │ │
│    │    └─────────────────────────────────────────────┘ │ │
│    │                                                      │ │
│    └─────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘

DATA FLOW:
1. StoreProvider makes store available to all children
2. AppContextProvider makes context available to all children
3. Components use hooks to access what they need
4. No prop drilling required! ✨
```

---

These diagrams should help visualize how all the pieces fit together. Reference them when reading the code to understand the overall architecture!
