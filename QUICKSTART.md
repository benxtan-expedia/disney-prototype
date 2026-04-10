# Quick Start Guide 🚀

Get the React Skeleton App running in 3 minutes!

---

## Prerequisites

Make sure you have these installed:

- **Node.js** 16 or higher ([download](https://nodejs.org/))
- **npm** (comes with Node.js)

Check your versions:
```bash
node --version  # Should be v16.x or higher
npm --version   # Should be 7.x or higher
```

---

## Installation Steps

### 1. Clone or Navigate to the Project

```bash
cd d:\Development\react-skeleton-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (~2-3 minutes).

### 3. Build the Application

```bash
npm run build
```

This creates two bundles:
- ✅ Client bundle (for browser) → `dist/public/`
- ✅ Server bundle (for Node.js) → `dist/server.js`

**What's happening:**
- TypeScript compiles to JavaScript
- Webpack bundles all modules
- Code splitting creates separate chunks
- Build should complete in ~30-60 seconds

### 4. Start the Server

```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:3000

📝 Routes:
   GET  /           - React app with SSR
   GET  /health     - Health check
   GET  /static/*   - Static assets
```

### 5. Open Your Browser

Navigate to: **http://localhost:3000**

You should see the React Skeleton App with:
- ✅ A gradient header
- ✅ Three modules (Input, Button, Test)
- ✅ Interactive buttons
- ✅ Context information displayed

---

## Testing It Works

### Test 1: Click the Buttons

Click "Click Me - Button 1" or "Click Me - Button 2"

**Expected:** The text in the Input Module should change immediately.

**What this proves:** MobX state management is working!

### Test 2: View Page Source

Right-click → "View Page Source"

**Expected:** You should see the full HTML with content (not just `<div id="root"></div>`)

**What this proves:** Server-side rendering is working!

### Test 3: Check the Console

Open browser DevTools → Console tab

**Expected:** You should see:
```
✅ App hydrated successfully!
📦 Store state: {...}
🌍 Context: {...}
TestModule mounted
```

**What this proves:** Client hydration is working!

### Test 4: Check Network Tab

Open DevTools → Network tab → Reload page

**Expected:** You should see multiple JavaScript files:
- `main.[hash].js` - Main bundle
- `inputModule.[hash].js` - Input module chunk
- `buttonModule.[hash].js` - Button module chunk
- `testModule.[hash].js` - Test module chunk

**What this proves:** Code splitting is working!

---

## Common Issues & Solutions

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules if it exists
rm -rf node_modules

# Try again
npm install
```

### Issue: `npm run build` fails with TypeScript errors

**Solution:** Make sure you're using TypeScript 5.x:
```bash
npm install typescript@latest --save-dev
npm run build
```

### Issue: Server starts but shows "Cannot GET /"

**Solution:** Make sure the build completed successfully:
```bash
# Check if dist folder exists
dir dist  # Windows
ls dist   # Mac/Linux

# Rebuild
npm run build
npm start
```

### Issue: Port 3000 is already in use

**Solution:** Change the port:
```bash
# Windows
set PORT=3001 && npm start

# Mac/Linux
PORT=3001 npm start
```

### Issue: Styles not loading or FOUC (Flash of Unstyled Content)

**Solution:** This shouldn't happen with SSR, but if it does:
1. Check that `dist/server.js` was built
2. View page source - styles should be in `<style>` tags
3. Rebuild: `npm run build`

---

## Development Workflow

### Making Changes

When you modify code:

1. **Edit your files** (e.g., `src/modules/ButtonModule.tsx`)

2. **Rebuild:**
   ```bash
   npm run build
   ```

3. **Restart server:**
   ```bash
   npm start
   ```

4. **Refresh browser** to see changes

### Quick Rebuild + Start

```bash
npm run dev
```

This runs `build` then `start` in one command.

---

## Project Structure Overview

```
react-skeleton-app/
├── src/                    # Source code (TypeScript)
│   ├── modules/           # Feature modules (add yours here!)
│   ├── stores/            # MobX stores
│   ├── context/           # React Context providers
│   ├── server/            # SSR server code
│   ├── types/             # TypeScript types
│   ├── utils/             # Utilities
│   ├── App.tsx            # Root component
│   └── client.tsx         # Browser entry point
├── dist/                  # Build output (auto-generated)
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── webpack.client.js      # Client build config
├── webpack.server.js      # Server build config
└── README.md             # Full documentation
```

---

## Next Steps

### 1. Explore the Code

Start with these files (in order):

1. `src/App.tsx` - Main app component
2. `src/modules/ButtonModule.tsx` - Interactive module example
3. `src/stores/AppStore.ts` - MobX store
4. `src/server/render.tsx` - SSR rendering

All files have **extensive comments** explaining what's happening.

### 2. Make Your First Change

Let's add a third button!

**Edit:** `src/modules/ButtonModule.tsx`

Find the `ButtonGroup` component and add:

```typescript
<StyledButton onClick={() => store.setText('🎨 Third button clicked!')} variant="primary">
  Click Me - Button 3
</StyledButton>
```

**Rebuild and restart:**
```bash
npm run dev
```

**Refresh browser** - you should see three buttons now!

### 3. Create Your Own Module

**Create:** `src/modules/MyModule.tsx`

```typescript
import React from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background: #e8f5e9;
  border-radius: 8px;
`;

const MyModule: React.FC = observer(() => {
  return (
    <Container>
      <h3>🌟 My First Module!</h3>
      <p>This is my custom module!</p>
    </Container>
  );
});

export default MyModule;
```

**Register in mapper:** `src/utils/componentMapper.ts`

```typescript
const componentMapper: ComponentMapper = {
  // ... existing modules
  myModule: loadable(() => import('../modules/MyModule'), {
    ssr: true,
    fallback: null,
  }),
};
```

**Use in App:** `src/App.tsx`

```typescript
const MyModule = componentMapper.myModule;

// In the return statement:
<MyModule />
```

**Rebuild and see your module!**

### 4. Read the Docs

- **README.md** - Full documentation with examples
- **ARCHITECTURE.md** - Deep dive into how everything works

---

## Resources

### Learning React
- [React Official Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Learning MobX
- [MobX Official Docs](https://mobx.js.org/)
- [MobX React Lite](https://github.com/mobxjs/mobx-react-lite)

### Learning SSR
- [@loadable/component Docs](https://loadable-components.com/)
- [React SSR Guide](https://react.dev/reference/react-dom/server)

---

## Getting Help

### Check the Comments

Every file has detailed comments explaining:
- What the code does
- Why it's structured that way
- How it fits into the larger system

Example:
```typescript
/**
 * MobX App Store
 * 
 * This store manages the application state using MobX.
 * Key concepts demonstrated:
 * - makeObservable: Makes properties observable
 * - observable: Marks state that triggers re-renders
 * ...
 */
```

### Read the Documentation

1. **Quick questions?** → Check README.md
2. **Architecture questions?** → Check ARCHITECTURE.md
3. **Still stuck?** → Read the inline comments in the relevant file

---

## Success Checklist

After following this guide, you should have:

- ✅ Installed all dependencies
- ✅ Successfully built the project
- ✅ Started the server
- ✅ Seen the app running in your browser
- ✅ Clicked buttons and seen state updates
- ✅ Verified SSR is working (view page source)
- ✅ Checked the console for hydration messages
- ✅ Seen code-split chunks loading

---

## What You've Learned

By running this app, you've seen these concepts in action:

1. ✅ **TypeScript** - Type-safe React development
2. ✅ **React with Hooks** - Modern functional components
3. ✅ **MobX** - Reactive state management
4. ✅ **Server-Side Rendering** - Fast initial page loads
5. ✅ **Code Splitting** - Optimized bundle sizes
6. ✅ **Styled Components** - CSS-in-JS with SSR
7. ✅ **Hapi.js** - Simple, powerful server framework

---

**Ready to explore?** Open the codebase and start reading! Every file is documented to help you learn.

Happy coding! 🎉
