# Code Examples & Snippets 📚

Common patterns and examples for extending the React Skeleton App.

---

## Table of Contents

1. [Creating New Modules](#creating-new-modules)
2. [Working with MobX](#working-with-mobx)
3. [Using Context](#using-context)
4. [Styled Components Patterns](#styled-components-patterns)
5. [React Hooks Examples](#react-hooks-examples)
6. [TypeScript Patterns](#typescript-patterns)

---

## Creating New Modules

### Basic Module Template

```typescript
import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  margin: 20px 0;
  background: #f5f5f5;
  border-radius: 8px;
`;

const Title = styled.h3`
  color: #333;
  margin-bottom: 15px;
`;

const YourModule: React.FC = observer(() => {
  return (
    <Container>
      <Title>Your Module Title</Title>
      <p>Your content here</p>
    </Container>
  );
});

export default YourModule;
```

### Module with Props

```typescript
interface YourModuleProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

const YourModule: React.FC<YourModuleProps> = observer(({ 
  title, 
  description, 
  onAction 
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      {description && <p>{description}</p>}
      {onAction && (
        <button onClick={onAction}>Take Action</button>
      )}
    </Container>
  );
});

export default YourModule;
```

### Module with Local State

```typescript
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

const CounterModule: React.FC = observer(() => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  return (
    <Container>
      <Title>Counter: {count}</Title>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
      
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <p>Hello, {name || 'stranger'}!</p>
    </Container>
  );
});
```

### Module with Store and Context

```typescript
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/StoreContext';
import { useAppContext } from '../context/AppContext';

const FullFeaturedModule: React.FC = observer(() => {
  const store = useStore();
  const context = useAppContext();

  const handleClick = () => {
    store.setText(`Updated from ${context.context.locale}`);
  };

  return (
    <Container>
      <Title>Full Featured Module</Title>
      <p>Store text: {store.text}</p>
      <p>Locale: {context.context.locale}</p>
      <button onClick={handleClick}>Update with Locale</button>
    </Container>
  );
});
```

---

## Working with MobX

### Creating a New Store

```typescript
// src/stores/UserStore.ts
import { makeObservable, observable, action, computed } from 'mobx';

export interface User {
  id: number;
  name: string;
  email: string;
}

export class UserStore {
  users: User[] = [];
  selectedUserId: number | null = null;

  constructor() {
    makeObservable(this, {
      users: observable,
      selectedUserId: observable,
      addUser: action,
      removeUser: action,
      selectUser: action,
      selectedUser: computed,
    });
  }

  // Action: Add user
  addUser = (user: User): void => {
    this.users.push(user);
  };

  // Action: Remove user
  removeUser = (id: number): void => {
    this.users = this.users.filter(u => u.id !== id);
  };

  // Action: Select user
  selectUser = (id: number): void => {
    this.selectedUserId = id;
  };

  // Computed: Get selected user
  get selectedUser(): User | undefined {
    return this.users.find(u => u.id === this.selectedUserId);
  }
}
```

### Using the Store

```typescript
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../context/StoreContext';

const UserListModule: React.FC = observer(() => {
  const store = useStore();

  // If you added UserStore to your stores
  // const userStore = store.userStore;

  return (
    <Container>
      <button onClick={() => store.setText('New text!')}>
        Update Text
      </button>
      <p>Current: {store.text}</p>
    </Container>
  );
});
```

### Computed Values Example

```typescript
export class TodoStore {
  @observable todos: Todo[] = [];
  @observable filter: 'all' | 'active' | 'completed' = 'all';

  // Computed value - auto-updates when todos or filter changes
  @computed get filteredTodos() {
    switch (this.filter) {
      case 'active':
        return this.todos.filter(t => !t.completed);
      case 'completed':
        return this.todos.filter(t => t.completed);
      default:
        return this.todos;
    }
  }

  @computed get activeCount() {
    return this.todos.filter(t => !t.completed).length;
  }
}
```

---

## Using Context

### Creating Custom Context

```typescript
// src/context/ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### Using Custom Context

```typescript
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTheme } from '../context/ThemeContext';

const ThemedModule: React.FC = observer(() => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Container style={{ 
      background: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#000' : '#fff'
    }}>
      <h3>Current Theme: {theme}</h3>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </Container>
  );
});
```

---

## Styled Components Patterns

### Basic Styling

```typescript
import styled from 'styled-components';

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

  &:disabled {
    background: gray;
    cursor: not-allowed;
  }
`;
```

### Props-based Styling

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const Button = styled.button<ButtonProps>`
  /* Size */
  padding: ${props => {
    switch (props.size) {
      case 'small': return '6px 12px';
      case 'large': return '16px 32px';
      default: return '10px 20px';
    }
  }};

  /* Color based on variant */
  background: ${props => {
    switch (props.variant) {
      case 'primary': return '#007bff';
      case 'secondary': return '#6c757d';
      case 'danger': return '#dc3545';
      default: return '#007bff';
    }
  }};

  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

// Usage
<Button variant="primary" size="large">Click Me</Button>
```

### Extending Styles

```typescript
const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const PrimaryButton = styled(Button)`
  background: #007bff;
  color: white;
`;

const DangerButton = styled(Button)`
  background: #dc3545;
  color: white;
`;
```

### Theming

```typescript
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    danger: '#dc3545',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
};

const Button = styled.button`
  padding: ${props => props.theme.spacing.medium};
  background: ${props => props.theme.colors.primary};
  color: white;
`;

// Wrap app with ThemeProvider
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

---

## React Hooks Examples

### useState

```typescript
import React, { useState } from 'react';

const FormModule: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: string[] = [];
    if (!email) newErrors.push('Email is required');
    if (password.length < 6) newErrors.push('Password must be 6+ characters');
    
    setErrors(newErrors);
    
    if (newErrors.length === 0) {
      console.log('Form submitted!', { email, password });
    }
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
      {errors.map((error, i) => (
        <p key={i} style={{ color: 'red' }}>{error}</p>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};
```

### useEffect

```typescript
import React, { useState, useEffect } from 'react';

const DataFetchModule: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data on mount
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Cleanup function (runs on unmount)
    return () => {
      console.log('Component unmounting, cleanup here');
    };
  }, []); // Empty array = run once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>Data: {JSON.stringify(data)}</div>;
};
```

### useCallback & useMemo

```typescript
import React, { useState, useCallback, useMemo } from 'react';

const OptimizedModule: React.FC = () => {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');

  // useCallback: Memoize function (prevent recreation on every render)
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // Dependencies: recreate only if deps change

  // useMemo: Memoize computed value
  const expensiveValue = useMemo(() => {
    console.log('Computing expensive value...');
    return count * 1000;
  }, [count]); // Recompute only when count changes

  return (
    <div>
      <p>Count: {count}</p>
      <p>Expensive: {expensiveValue}</p>
      <button onClick={handleClick}>Increment</button>
      
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type here (doesn't affect expensive calc)"
      />
    </div>
  );
};
```

---

## TypeScript Patterns

### Component Props with Default Values

```typescript
interface CardProps {
  title: string;
  description?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger';
}

const Card: React.FC<CardProps> = ({ 
  title, 
  description = 'No description provided',
  onClick,
  variant = 'default'
}) => {
  return (
    <Container variant={variant} onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </Container>
  );
};
```

### Union Types

```typescript
type Status = 'idle' | 'loading' | 'success' | 'error';

interface State {
  status: Status;
  data: any | null;
  error: string | null;
}

const StatusModule: React.FC = () => {
  const [state, setState] = useState<State>({
    status: 'idle',
    data: null,
    error: null,
  });

  const renderContent = () => {
    switch (state.status) {
      case 'loading':
        return <div>Loading...</div>;
      case 'success':
        return <div>Data: {state.data}</div>;
      case 'error':
        return <div>Error: {state.error}</div>;
      default:
        return <div>Click to load</div>;
    }
  };

  return <Container>{renderContent()}</Container>;
};
```

### Generics

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

<List 
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>
```

### Type Guards

```typescript
interface Dog {
  type: 'dog';
  bark: () => void;
}

interface Cat {
  type: 'cat';
  meow: () => void;
}

type Animal = Dog | Cat;

// Type guard function
function isDog(animal: Animal): animal is Dog {
  return animal.type === 'dog';
}

const AnimalModule: React.FC<{ animal: Animal }> = ({ animal }) => {
  if (isDog(animal)) {
    // TypeScript knows animal is Dog here
    animal.bark();
    return <div>Dog</div>;
  } else {
    // TypeScript knows animal is Cat here
    animal.meow();
    return <div>Cat</div>;
  }
};
```

---

## Useful Snippets

### Loading Indicator

```typescript
const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingModule: React.FC = () => (
  <Container style={{ textAlign: 'center' }}>
    <LoadingSpinner />
    <p>Loading...</p>
  </Container>
);
```

### Error Boundary (Class Component)

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

## Best Practices Checklist

- ✅ Always type your props with TypeScript interfaces
- ✅ Wrap components with `observer()` when using MobX
- ✅ Use `useCallback` for functions passed to child components
- ✅ Use `useMemo` for expensive computations
- ✅ Always provide cleanup in `useEffect` when needed
- ✅ Avoid inline object/array creation in render (causes re-renders)
- ✅ Keep components small and focused
- ✅ Extract reusable logic into custom hooks
- ✅ Use styled-components for all styling (consistency)
- ✅ Document complex logic with comments

---

Happy coding! Use these snippets as references when building your app. 🚀
