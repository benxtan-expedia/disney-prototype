# React Skeleton App - Cheat Sheet 📝

Quick reference for common tasks and commands.

---

## 🚀 Commands

```bash
# Install dependencies
npm install

# Build (client + server)
npm run build

# Build client only
npm run build:client

# Build server only
npm run build:server

# Start production server
npm start

# Build and start (dev mode)
npm run dev

# Change port
PORT=3001 npm start          # Mac/Linux
set PORT=3001 && npm start   # Windows
```

---

## 📁 File Locations Quick Reference

```
Configuration:
├── package.json              - Dependencies
├── tsconfig.json             - TypeScript config
├── .babelrc                  - Babel presets
├── webpack.client.js         - Client build
└── webpack.server.js         - Server build

Entry Points:
├── src/client.tsx            - Browser entry
├── src/server/index.ts       - Server entry
└── src/App.tsx               - React root

Add Your Code Here:
├── src/modules/              - New modules here
├── src/stores/               - New stores here
├── src/context/              - New contexts here
└── src/components/           - Reusable components here

Type Definitions:
└── src/types/                - TypeScript types

Build Output:
├── dist/server.js            - Built server
└── dist/public/              - Built client bundles
```

---

## 🧩 Adding a New Module

### 1. Create Module File

**Location:** `src/modules/YourModule.tsx`

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

### 2. Register in Mapper

**Location:** `src/utils/componentMapper.ts`

```typescript
const componentMapper: ComponentMapper = {
  // ... existing modules
  yourModule: loadable(() => import('../modules/YourModule'), {
    ssr: true,
    fallback: null,
  }),
};
```

### 3. Use in App

**Location:** `src/App.tsx`

```typescript
const YourModule = componentMapper.yourModule;

// In render:
<YourModule />
```

### 4. Rebuild

```bash
npm run build
npm start
```

---

## 🗄️ MobX Store Quick Reference

### Create Store

**Location:** `src/stores/YourStore.ts`

```typescript
import { makeObservable, observable, action } from 'mobx';

export class YourStore {
  value: string = 'initial';

  constructor() {
    makeObservable(this, {
      value: observable,
      setValue: action,
    });
  }

  setValue = (newValue: string): void => {
    this.value = newValue;
  };
}
```

### Use Store in Component

```typescript
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/StoreContext';

const MyComponent: React.FC = observer(() => {
  const store = useStore();
  
  return (
    <div>
      <p>{store.text}</p>
      <button onClick={() => store.setText('New!')}>
        Change
      </button>
    </div>
  );
});
```

---

## 🎨 Styled Components Patterns

### Basic Button

```typescript
const Button = styled.button`
  padding: 10px 20px;
  background: blue;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: darkblue;
  }
`;
```

### With Props

```typescript
interface ButtonProps {
  primary?: boolean;
}

const Button = styled.button<ButtonProps>`
  background: ${props => props.primary ? 'blue' : 'gray'};
`;

// Usage
<Button primary>Click Me</Button>
```

### Extending Styles

```typescript
const BaseButton = styled.button`
  padding: 10px;
`;

const PrimaryButton = styled(BaseButton)`
  background: blue;
  color: white;
`;
```

---

## ⚛️ React Hooks Quick Reference

### useState

```typescript
const [count, setCount] = useState(0);
const [name, setName] = useState('');

setCount(count + 1);
setName('Alice');
```

### useEffect

```typescript
// Run once on mount
useEffect(() => {
  console.log('Mounted');
  
  return () => {
    console.log('Unmounting');
  };
}, []);

// Run when dependency changes
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);
```

### useContext

```typescript
const context = useAppContext();
const locale = context.context.locale;
```

### Custom Hook (Example)

```typescript
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return width;
}

// Usage
const width = useWindowWidth();
```

---

## 📘 TypeScript Quick Reference

### Component Props

```typescript
interface MyComponentProps {
  title: string;
  count?: number;
  onAction?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, count = 0, onAction }) => {
  return <div>{title}: {count}</div>;
};
```

### State Types

```typescript
interface User {
  id: number;
  name: string;
}

const [user, setUser] = useState<User | null>(null);
const [users, setUsers] = useState<User[]>([]);
```

### Event Handlers

```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Clicked');
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

---

## 🌐 Context Quick Reference

### Access App Context

```typescript
import { useAppContext } from '../context/AppContext';

const MyComponent = () => {
  const appContext = useAppContext();
  
  return (
    <div>
      <p>Locale: {appContext.context.locale}</p>
      <p>Currency: {appContext.context.currency}</p>
      <p>Device: {appContext.context.device.type}</p>
    </div>
  );
};
```

### Access Store

```typescript
import { useStore } from '../context/StoreContext';

const MyComponent = observer(() => {
  const store = useStore();
  
  return (
    <div>
      <p>{store.text}</p>
      <button onClick={() => store.setText('New')}>Change</button>
    </div>
  );
});
```

---

## 🔧 Common Patterns

### Form Handling

```typescript
const FormModule: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Conditional Rendering

```typescript
// If/else
{isLoggedIn ? <Dashboard /> : <Login />}

// Show/hide
{showModal && <Modal />}

// Multiple conditions
{status === 'loading' && <Spinner />}
{status === 'error' && <Error />}
{status === 'success' && <Data />}
```

### Lists

```typescript
const items = ['Apple', 'Banana', 'Cherry'];

return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
```

---

## 🐛 Debugging Tips

### Browser Console

```typescript
// Log state changes
console.log('Store:', store);
console.log('Context:', appContext);

// Check if component renders
useEffect(() => {
  console.log('Component rendered');
});
```

### React DevTools

1. Install React DevTools extension
2. Open browser DevTools
3. Go to "Components" tab
4. Inspect component props and state

### Network Tab

1. Open browser DevTools
2. Go to "Network" tab
3. Reload page
4. Check:
   - Initial HTML (should have content)
   - JavaScript chunks loading
   - Status codes (should be 200)

### Common Issues

**"window is not defined"**
- Happening on server
- Move code inside `useEffect`

**"Hydration failed"**
- Server HTML ≠ Client HTML
- Check initial state matches

**Component not re-rendering**
- Wrap with `observer()`
- Ensure using observable

---

## ⚡ Performance Tips

### Code Splitting

```typescript
// ✅ Good - separate chunk
const Module = loadable(() => import('./Module'));

// ❌ Bad - bundled together
import Module from './Module';
```

### Memoization

```typescript
// Memoize expensive calculation
const expensiveValue = useMemo(() => {
  return calculateSomething(data);
}, [data]);

// Memoize callback
const handleClick = useCallback(() => {
  doSomething();
}, []);
```

### Avoid Inline Objects

```typescript
// ❌ Bad - creates new object every render
<Component style={{ color: 'red' }} />

// ✅ Good - constant object
const style = { color: 'red' };
<Component style={style} />
```

---

## 📚 File Templates

### Module Template

```typescript
import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useStore } from '../context/StoreContext';
import { useAppContext } from '../context/AppContext';

const Container = styled.div`
  padding: 20px;
`;

const YourModule: React.FC = observer(() => {
  const store = useStore();
  const context = useAppContext();

  return (
    <Container>
      <h3>Module Title</h3>
      {/* Your content */}
    </Container>
  );
});

export default YourModule;
```

### Store Template

```typescript
import { makeObservable, observable, action, computed } from 'mobx';

export class YourStore {
  value: string = 'initial';

  constructor() {
    makeObservable(this, {
      value: observable,
      setValue: action,
      computedValue: computed,
    });
  }

  setValue = (newValue: string): void => {
    this.value = newValue;
  };

  get computedValue(): string {
    return this.value.toUpperCase();
  }
}
```

---

## 🎯 Best Practices Checklist

- ✅ Always type props with TypeScript
- ✅ Wrap components with `observer()` when using MobX
- ✅ Use `loadable()` for large modules
- ✅ Keep components small and focused
- ✅ Extract reusable logic to custom hooks
- ✅ Use styled-components for all styles
- ✅ Add comments for complex logic
- ✅ Clean up effects with return function
- ✅ Use semantic HTML elements
- ✅ Handle errors gracefully

---

## 🔗 Quick Links

- [Full Documentation](README.md)
- [Quick Start](QUICKSTART.md)
- [Architecture Guide](ARCHITECTURE.md)
- [Code Examples](EXAMPLES.md)
- [Visual Diagrams](DIAGRAMS.md)

---

**Print this page and keep it next to your keyboard!** 🖨️
