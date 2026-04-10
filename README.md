# React Skeleton App 🚀

A **beginner-friendly**, production-ready React starter template with Server-Side Rendering (SSR), TypeScript, MobX state management, and code splitting.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [Key Concepts Explained](#-key-concepts-explained)
- [Learning Resources](#-learning-resources)

---

## ✨ Features

- ✅ **TypeScript** - Full type safety across client and server
- ✅ **Server-Side Rendering (SSR)** - Fast initial page load and SEO-friendly
- ✅ **Hapi.js Server** - Simple, powerful Node.js server framework
- ✅ **MobX State Management** - Simple, reactive state management
- ✅ **Code Splitting** - Dynamic module loading with `@loadable/component`
- ✅ **Styled Components** - CSS-in-JS with SSR support
- ✅ **React Context API** - Global application context
- ✅ **Functional Components** - Modern React patterns with hooks
- ✅ **Clean Architecture** - Well-organized folder structure

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2+ | UI library |
| **TypeScript** | 5.3+ | Type safety |
| **Hapi.js** | 21.3+ | Server framework |
| **MobX** | 6.12+ | State management |
| **@loadable/component** | 5.16+ | Code splitting with SSR |
| **styled-components** | 6.1+ | Styling |
| **Webpack** | 5.90+ | Module bundling |

---

## 📁 Project Structure

```
react-skeleton-app/
├── src/
│   ├── components/          # Reusable components (future use)
│   ├── modules/             # Feature modules
│   │   ├── InputModule.tsx  # Displays context & state
│   │   ├── ButtonModule.tsx # Interactive buttons
│   │   └── TestModule.tsx   # Lifecycle demo
│   ├── stores/              # MobX stores
│   │   └── AppStore.ts      # Main application store
│   ├── context/             # React Context providers
│   │   ├── AppContext.tsx   # App configuration context
│   │   └── StoreContext.tsx # MobX store context
│   ├── server/              # Server-side code
│   │   ├── index.ts         # Hapi server setup
│   │   └── render.tsx       # SSR rendering logic
│   ├── utils/               # Utility functions
│   │   └── componentMapper.ts # Dynamic component loader
│   ├── types/               # TypeScript type definitions
│   │   ├── context.ts       # Context types
│   │   ├── store.ts         # Store types
│   │   └── components.ts    # Component types
│   ├── App.tsx              # Root application component
│   └── client.tsx           # Client entry point (hydration)
├── dist/                    # Build output (generated)
├── webpack.client.js        # Client bundle configuration
├── webpack.server.js        # Server bundle configuration
├── tsconfig.json            # TypeScript configuration
├── .babelrc                 # Babel configuration
└── package.json             # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Build the application:**

```bash
npm run build
```

This runs two webpack builds:
- Client bundle (for browser)
- Server bundle (for Node.js)

3. **Start the server:**

```bash
npm start
```

4. **Open your browser:**

Navigate to `http://localhost:3000`

You should see the React Skeleton App running!

### Scripts

| Command | Description |
|---------|-------------|
| `npm run build:client` | Build client bundle only |
| `npm run build:server` | Build server bundle only |
| `npm run build` | Build both client and server |
| `npm start` | Start the production server |
| `npm run dev` | Build and start (development) |

---

## 🔍 How It Works

### Server-Side Rendering (SSR) Flow

```
1. User requests page
   ↓
2. Hapi server receives request
   ↓
3. Server creates fresh MobX store & context
   ↓
4. React renders to HTML string (renderToString)
   ↓
5. @loadable/server collects required code chunks
   ↓
6. styled-components collects CSS styles
   ↓
7. Server injects:
   - Rendered HTML
   - CSS styles
   - Script tags for chunks
   - Serialized state (store + context)
   ↓
8. Browser receives full HTML page
   ↓
9. Browser loads JavaScript chunks
   ↓
10. Client hydrates React app
    - Reads serialized state
    - Creates store with same state
    - Attaches event listeners
    ↓
11. App is now fully interactive! 🎉
```

### Code Splitting with @loadable/component

Instead of bundling all components into one large file, we split them:

```typescript
// ❌ Without code splitting - loads everything upfront
import InputModule from './modules/InputModule';
import ButtonModule from './modules/ButtonModule';

// ✅ With code splitting - loads on demand
const componentMapper = {
  inputModule: loadable(() => import('./modules/InputModule'), { ssr: true }),
  buttonModule: loadable(() => import('./modules/ButtonModule'), { ssr: true }),
};
```

**Benefits:**
- Smaller initial bundle size
- Faster page load
- Modules load only when needed
- Still works with SSR!

### MobX Reactive Updates

```typescript
// 1. Define observable state
class AppStore {
  @observable text = "Hello";
  
  @action setText(newText: string) {
    this.text = newText;
  }
}

// 2. Use in component with observer wrapper
const MyComponent = observer(() => {
  const store = useStore();
  
  // ✅ Component re-renders when store.text changes
  return <div>{store.text}</div>;
});

// 3. Update state (triggers re-render)
store.setText("World");
```

**How it works:**
- MobX tracks which observables each component uses
- When an observable changes, only components using it re-render
- No need to manually manage subscriptions!

---

## 📚 Key Concepts Explained

### 1. TypeScript

All files use `.ts` or `.tsx` extensions and include type annotations:

```typescript
// Typed props
interface ButtonProps {
  onClick: () => void;
  text: string;
}

// Typed component
const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};
```

**Benefits:**
- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code

### 2. React Context API

Provides global data without prop drilling:

```typescript
// 1. Create context
const AppContext = createContext<AppContextType>(defaultValue);

// 2. Provide at top level
<AppContextProvider value={contextData}>
  <App />
</AppContextProvider>

// 3. Consume in any component
const MyComponent = () => {
  const context = useAppContext();
  return <div>{context.locale}</div>;
};
```

### 3. MobX Store Pattern

```typescript
// Store definition
class AppStore {
  text: string = "Hello";
  
  setText(newText: string) {
    this.text = newText;
  }
}

// Usage in component
const MyComponent = observer(() => {
  const store = useStore();
  
  return (
    <div>
      <p>{store.text}</p>
      <button onClick={() => store.setText("Changed!")}>
        Change
      </button>
    </div>
  );
});
```

### 4. React Hooks

**useState** - Component-level state:
```typescript
const [count, setCount] = useState(0);
```

**useEffect** - Side effects and lifecycle:
```typescript
useEffect(() => {
  console.log("Component mounted");
  
  return () => {
    console.log("Component will unmount");
  };
}, []); // Empty array = run once on mount
```

**useContext** - Access context:
```typescript
const context = useContext(AppContext);
```

### 5. Styled Components

CSS-in-JS with TypeScript:

```typescript
// Define styled component
const Button = styled.button<{ primary?: boolean }>`
  padding: 12px 24px;
  background: ${props => props.primary ? 'blue' : 'gray'};
  color: white;
  
  &:hover {
    background: darkblue;
  }
`;

// Use it
<Button primary onClick={handleClick}>Click Me</Button>
```

---

## 🎓 Learning Resources

### Understanding the Modules

1. **InputModule** - Read-only display
   - Shows context data (locale, currency, device)
   - Displays MobX state
   - Demonstrates `useAppContext()` and `useStore()`

2. **ButtonModule** - Interactive controls
   - Contains clickable buttons
   - Updates MobX store on click
   - Demonstrates MobX actions

3. **TestModule** - Lifecycle demo
   - Uses `useEffect` for side effects
   - Has a timer that increments
   - Demonstrates cleanup functions

### File Deep Dives

**Must read for beginners:**

1. `src/stores/AppStore.ts` - How MobX works
2. `src/context/StoreContext.tsx` - Providing stores via Context
3. `src/modules/ButtonModule.tsx` - Interactive component example
4. `src/client.tsx` - Client hydration process
5. `src/server/render.tsx` - SSR rendering process

### Next Steps

**To extend this app:**

1. Add more modules to `src/modules/`
2. Register them in `componentMapper.ts`
3. Use them in `App.tsx`
4. Add more stores for different features
5. Create reusable components in `src/components/`

**Example: Adding a new module**

```typescript
// 1. Create src/modules/CounterModule.tsx
import React, { useState } from 'react';
import styled from 'styled-components';

const CounterModule = observer(() => {
  const [count, setCount] = useState(0);
  
  return (
    <Container>
      <h3>Count: {count}</h3>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </Container>
  );
});

export default CounterModule;

// 2. Add to componentMapper.ts
const componentMapper = {
  // ... existing modules
  counterModule: loadable(() => import('../modules/CounterModule'), { ssr: true }),
};

// 3. Use in App.tsx
const CounterModule = componentMapper.counterModule;
<CounterModule />
```

---

## 🐛 Troubleshooting

### Build fails with "Cannot find module"

Make sure you've installed all dependencies:
```bash
npm install
```

### Server crashes on start

Check that the build completed successfully:
```bash
npm run build
```

Look for errors in the build output.

### Changes not reflected

You need to rebuild after code changes:
```bash
npm run dev
```

(This rebuilds and restarts the server)

### TypeScript errors

Check `tsconfig.json` and ensure all type packages are installed:
```bash
npm install --save-dev @types/react @types/react-dom @types/hapi__hapi
```

---

## 🤝 Contributing

This is a learning template! Feel free to:

- Add more example modules
- Improve documentation
- Add more comments
- Create tutorials

---

## 📄 License

MIT License - feel free to use this for learning or as a project starter!

---

## 🙏 Acknowledgments

Built with love as a beginner-friendly React template demonstrating:
- Modern React patterns
- Server-side rendering
- State management
- TypeScript best practices
- Production-ready architecture

**Perfect for:**
- Learning React with SSR
- Starting new projects
- Understanding MobX
- Exploring code splitting
- TypeScript practice

---

## 📞 Support

If you're stuck:

1. Read the inline code comments (every file is heavily documented)
2. Check the "How It Works" section above
3. Review the example modules in `src/modules/`
4. Look at the type definitions in `src/types/`

Happy coding! 🎉
