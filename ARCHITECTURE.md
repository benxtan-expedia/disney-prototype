# Architecture Guide 🏗️

This document explains the architecture decisions and how everything fits together.

---

## 🎯 Architecture Overview

This app follows a **modular, layered architecture** designed for scalability and maintainability:

```
┌─────────────────────────────────────────┐
│            Browser (Client)              │
├─────────────────────────────────────────┤
│  React Components (with Hydration)      │
│  ├─ App.tsx                              │
│  ├─ Modules (dynamically loaded)        │
│  └─ Styled Components                   │
├─────────────────────────────────────────┤
│  State Management Layer                 │
│  ├─ MobX Stores (reactive)              │
│  └─ React Context (configuration)       │
├─────────────────────────────────────────┤
│  Client Entry (client.tsx)              │
│  └─ Hydration + State restoration       │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│            Server (Node.js)              │
├─────────────────────────────────────────┤
│  Hapi.js HTTP Server                     │
│  ├─ Route handlers                       │
│  ├─ Static file serving                 │
│  └─ Health checks                        │
├─────────────────────────────────────────┤
│  SSR Rendering Layer                     │
│  ├─ React renderToString                │
│  ├─ Chunk extraction (@loadable)        │
│  ├─ Style collection (styled-comp.)     │
│  └─ State serialization                 │
└─────────────────────────────────────────┘
```

---

## 📦 Module System

### Component Mapper Pattern

The `componentMapper` is the heart of our dynamic loading system:

```typescript
// Traditional approach (all modules in one bundle)
import InputModule from './InputModule';
import ButtonModule from './ButtonModule';
// Result: ~500KB bundle

// Our approach (code splitting)
const componentMapper = {
  inputModule: loadable(() => import('./InputModule')),
  buttonModule: loadable(() => import('./ButtonModule')),
};
// Result: ~100KB main bundle + ~50KB per module (loaded on demand)
```

**Why this matters:**

1. **Smaller initial download** - Users download only what they need
2. **Faster page load** - Less JavaScript to parse
3. **Better caching** - Unchanged modules stay cached
4. **SSR compatible** - Works seamlessly with server rendering

### Adding New Modules

**Step-by-step process:**

1. **Create the module** in `src/modules/YourModule.tsx`:

```typescript
import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const YourModule: React.FC = observer(() => {
  return (
    <Container>
      <h3>Your Module</h3>
    </Container>
  );
});

export default YourModule;
```

2. **Register in mapper** (`src/utils/componentMapper.ts`):

```typescript
const componentMapper = {
  // ... existing modules
  yourModule: loadable(() => import('../modules/YourModule'), {
    ssr: true,
    fallback: null,
  }),
};
```

3. **Use in App** (`src/App.tsx`):

```typescript
const YourModule = componentMapper.yourModule;

return (
  <AppContainer>
    {/* other modules */}
    <YourModule />
  </AppContainer>
);
```

That's it! Webpack automatically:
- Creates a new chunk for your module
- Loads it on demand
- Includes it in SSR

---

## 🔄 State Management

### MobX Architecture

We use MobX for its simplicity and reactivity:

```
┌──────────────────────────────────────┐
│         MobX Observable State         │
│  (stores/AppStore.ts)                │
│                                       │
│  class AppStore {                    │
│    @observable text = "Hello"        │
│                                       │
│    @action setText(newText) {        │
│      this.text = newText             │
│    }                                  │
│  }                                    │
└──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────┐
│      React Context Provider           │
│  (context/StoreContext.tsx)          │
│                                       │
│  <StoreProvider store={store}>       │
│    <App />                            │
│  </StoreProvider>                     │
└──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────┐
│      observer() Components            │
│  (modules/*.tsx)                      │
│                                       │
│  const MyComp = observer(() => {     │
│    const store = useStore()          │
│    return <div>{store.text}</div>    │
│  })                                   │
│                                       │
│  ✅ Auto re-renders when text changes │
└──────────────────────────────────────┘
```

**Key Principles:**

1. **Single source of truth** - Store holds all state
2. **Actions modify state** - No direct mutations
3. **Observers react** - Components update automatically
4. **Type-safe** - Full TypeScript support

### When to Use MobX vs Context

**Use MobX for:**
- Application state that changes frequently
- State that requires computations
- State shared across many components

**Use Context for:**
- Configuration that rarely changes
- Static data (locale, theme, etc.)
- Dependency injection

---

## 🌐 SSR Deep Dive

### The SSR Pipeline

```
Request arrives
    ↓
┌─────────────────────────────────────┐
│  1. Create Request-Specific Data    │
│  ────────────────────────────────    │
│  - New MobX store                   │
│  - Request context (locale, etc.)   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  2. Collect Required Chunks          │
│  ──────────────────────────────      │
│  ChunkExtractor wraps app           │
│  Tracks which modules are used      │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  3. Collect Styles                   │
│  ────────────────────                │
│  ServerStyleSheet wraps app         │
│  Extracts styled-components CSS     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  4. Render to HTML                   │
│  ──────────────────                  │
│  renderToString(app)                │
│  Returns HTML string                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  5. Build Complete HTML Page         │
│  ─────────────────────────────       │
│  - Inject rendered HTML             │
│  - Add style tags                   │
│  - Add script tags for chunks       │
│  - Serialize state to window object │
└─────────────────────────────────────┘
    ↓
Send to browser
```

### State Serialization

**Server side:**
```typescript
// src/server/render.tsx
const store = createAppStore();
const serializedStore = JSON.stringify(store);

const html = `
  <script>
    window.__INITIAL_STORE__ = ${serializedStore};
  </script>
`;
```

**Client side:**
```typescript
// src/client.tsx
const initialStore = window.__INITIAL_STORE__;
const store = createAppStore(initialStore);

// Store now has same state as server!
hydrateRoot(root, <App />);
```

**Why this works:**
1. Server creates store, renders with it
2. Server sends both HTML and store state
3. Client creates store with same state
4. HTML matches, so hydration succeeds
5. App is interactive with correct state!

---

## 🎨 Styling Architecture

### Styled Components with SSR

**Challenge:** CSS-in-JS usually adds styles in browser, causing FOUC (flash of unstyled content)

**Our solution:**
1. Server collects all styles during render
2. Injects them as `<style>` tags in HTML
3. Client receives pre-styled HTML
4. No flash!

```typescript
// Server (render.tsx)
const sheet = new ServerStyleSheet();

const jsx = sheet.collectStyles(<App />);
const html = renderToString(jsx);
const styleTags = sheet.getStyleTags(); // <style>...</style>

// Inject in HTML head
return `
  <head>
    ${styleTags}
  </head>
  <body>${html}</body>
`;
```

### Component Styling Pattern

```typescript
// 1. Define styles outside component
const Container = styled.div`
  padding: 20px;
  background: #fff;
`;

const Title = styled.h1<{ highlighted?: boolean }>`
  color: ${props => props.highlighted ? 'red' : 'black'};
`;

// 2. Use in component
const MyComponent = () => {
  return (
    <Container>
      <Title highlighted>Hello</Title>
    </Container>
  );
};
```

**Benefits:**
- Type-safe props (TypeScript)
- Dynamic styling based on props
- Scoped CSS (no global conflicts)
- SSR support out of the box

---

## 🔧 Build Process

### Dual Webpack Builds

We need two separate builds:

**1. Client Build** (`webpack.client.js`):
- **Input:** `src/client.tsx`
- **Output:** `dist/public/*.js`
- **Target:** Browser
- **Features:**
  - Code splitting
  - Chunk hashing (caching)
  - Loadable stats file

**2. Server Build** (`webpack.server.js`):
- **Input:** `src/server/index.ts`
- **Output:** `dist/server.js`
- **Target:** Node.js
- **Features:**
  - Externals (don't bundle node_modules)
  - SSR-compatible build

### Build Flow

```
npm run build
    ↓
┌─────────────────────────────────────┐
│  webpack.client.js                   │
│  ───────────────────                 │
│  Entry: src/client.tsx              │
│  Output: dist/public/               │
│                                      │
│  Generates:                          │
│  ├─ main.[hash].js                  │
│  ├─ inputModule.[hash].js           │
│  ├─ buttonModule.[hash].js          │
│  ├─ testModule.[hash].js            │
│  └─ loadable-stats.json             │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  webpack.server.js                   │
│  ───────────────────                 │
│  Entry: src/server/index.ts         │
│  Output: dist/server.js              │
│                                      │
│  Generates:                          │
│  └─ server.js (single file)         │
└─────────────────────────────────────┘
    ↓
Ready to run: node dist/server.js
```

### Why `loadable-stats.json`?

This file maps component names to their chunk files:

```json
{
  "assetsByChunkName": {
    "inputModule": ["inputModule.abc123.js"],
    "buttonModule": ["buttonModule.def456.js"]
  }
}
```

The server reads this to know which `<script>` tags to inject.

---

## 🚦 Request Flow

### Complete Request Lifecycle

```
1. Browser requests "/"
   ↓
2. Hapi server catches request (server/index.ts)
   ↓
3. Calls renderApp() (server/render.tsx)
   ↓
4. Creates fresh store & context
   ↓
5. ChunkExtractor initialized with loadable-stats.json
   ↓
6. Wraps app with providers
   ↓
7. Renders React tree (modules load via componentMapper)
   ↓
8. ChunkExtractor notes: "inputModule, buttonModule, testModule used"
   ↓
9. Generates script tags for those chunks
   ↓
10. Builds HTML with:
    - Rendered markup
    - Style tags
    - Script tags
    - Serialized state
   ↓
11. Sends HTML to browser
   ↓
12. Browser parses HTML, sees script tags
   ↓
13. Downloads main.js and module chunks
   ↓
14. Runs client.tsx
   ↓
15. loadableReady() waits for all chunks
   ↓
16. Reads window.__INITIAL_STORE__
   ↓
17. Creates store with that state
   ↓
18. Calls hydrateRoot() (not render!)
   ↓
19. React attaches event listeners to existing DOM
   ↓
20. App is now interactive! 🎉
```

---

## 🧩 TypeScript Integration

### Type Safety Layers

**1. Context Types** (`types/context.ts`)
```typescript
export interface AppContextType {
  context: {
    locale: string;
    currency: string;
    // ...
  };
}
```

**2. Store Types** (`types/store.ts`)
```typescript
export interface AppStore {
  text: string;
  setText: (newText: string) => void;
}
```

**3. Component Types** (`types/components.ts`)
```typescript
export type LoadableComponent = ReturnType<typeof loadable>;
export type ComponentMapper = Record<string, LoadableComponent>;
```

### Type Flow Example

```typescript
// 1. Define type
interface ButtonProps {
  onClick: () => void;
}

// 2. Type the component
const Button: React.FC<ButtonProps> = ({ onClick }) => {
  return <button onClick={onClick}>Click</button>;
};

// 3. Usage is type-checked
<Button onClick={() => alert('hi')} /> // ✅
<Button /> // ❌ Error: missing onClick
<Button onClick="invalid" /> // ❌ Error: wrong type
```

---

## 📊 Performance Optimizations

### 1. Code Splitting
- **Benefit:** 70% smaller initial bundle
- **How:** Dynamic imports with `@loadable/component`

### 2. SSR
- **Benefit:** Faster First Contentful Paint
- **How:** HTML arrives pre-rendered

### 3. MobX Reactivity
- **Benefit:** Only affected components re-render
- **How:** Fine-grained reactivity tracking

### 4. Chunk Hashing
- **Benefit:** Efficient browser caching
- **How:** `[contenthash]` in webpack config

---

## 🎓 Learning Path

**For React beginners:**
1. Start with `src/modules/InputModule.tsx` (simplest)
2. Then `src/modules/ButtonModule.tsx` (events)
3. Then `src/modules/TestModule.tsx` (useEffect)
4. Study `src/stores/AppStore.ts` (MobX basics)
5. Read `src/context/StoreContext.tsx` (Context pattern)

**For SSR learners:**
1. Read `src/client.tsx` (hydration)
2. Read `src/server/render.tsx` (SSR)
3. Read `src/server/index.ts` (server setup)
4. Study webpack configs (bundling)

**For architecture learners:**
1. Understand the component mapper pattern
2. Study the state serialization flow
3. Trace a request end-to-end
4. Experiment with adding modules

---

## 🛠 Extending the App

### Adding Features

**New Store:**
```typescript
// 1. Create store
export class UserStore {
  @observable user = null;
  
  @action setUser(user) {
    this.user = user;
  }
}

// 2. Add to root store (optional)
export class RootStore {
  appStore = new AppStoreImpl();
  userStore = new UserStore();
}

// 3. Provide via context
<StoreProvider store={rootStore}>
  <App />
</StoreProvider>
```

**New Context:**
```typescript
// 1. Define type
export interface ThemeContextType {
  theme: 'light' | 'dark';
}

// 2. Create context
export const ThemeContext = createContext<ThemeContextType>({ theme: 'light' });

// 3. Provide
<ThemeContext.Provider value={{ theme: 'dark' }}>
  <App />
</ThemeContext.Provider>

// 4. Consume
const { theme } = useContext(ThemeContext);
```

---

## 🔍 Debugging Tips

### Client vs Server Code

**Problem:** "window is not defined" error

**Solution:** Check where code runs
```typescript
// ❌ Runs on server (no window)
const width = window.innerWidth;

// ✅ Only runs in browser
useEffect(() => {
  const width = window.innerWidth;
}, []);
```

### Hydration Mismatches

**Problem:** "Hydration failed" warning

**Cause:** Server HTML ≠ Client render

**Solution:** Ensure same initial state
```typescript
// Server creates: <div>Hello</div>
// Client MUST render: <div>Hello</div>

// ❌ Random data (different each time)
<div>{Math.random()}</div>

// ✅ Deterministic
<div>{store.text}</div>
```

### MobX Not Updating

**Problem:** Component doesn't re-render

**Solution:** Wrap with observer()
```typescript
// ❌ Won't react to changes
const MyComponent = () => {
  const store = useStore();
  return <div>{store.text}</div>;
};

// ✅ Reacts to changes
const MyComponent = observer(() => {
  const store = useStore();
  return <div>{store.text}</div>;
});
```

---

## ✅ Best Practices

1. **Always use TypeScript types** - Self-documenting code
2. **Wrap components with observer()** - Enable reactivity
3. **Use loadable for large modules** - Better performance
4. **Keep stores focused** - Single responsibility
5. **Comment complex logic** - Help future developers
6. **Test SSR and client** - Both must work

---

This architecture is designed to be **simple enough for beginners** yet **powerful enough for production**. Start small, add features as needed, and maintain the clean structure!

Happy building! 🚀
