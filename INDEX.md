# Documentation Index 📚

Welcome to the React Skeleton App documentation! This index helps you find the right document for your needs.

---

## 📖 Quick Navigation

| Document | Purpose | For Who |
|----------|---------|---------|
| **[QUICKSTART.md](QUICKSTART.md)** | Get running in 3 minutes | Everyone (start here!) |
| **[README.md](README.md)** | Complete feature guide | Developers learning the stack |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Deep technical dive | Advanced learners |
| **[EXAMPLES.md](EXAMPLES.md)** | Code snippets & patterns | Reference while coding |
| **[DIAGRAMS.md](DIAGRAMS.md)** | Visual architecture | Visual learners |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Project overview | Project managers |

---

## 🎯 Find What You Need

### I want to...

#### Get Started
- **Install and run the app** → [QUICKSTART.md](QUICKSTART.md)
- **Understand what this project is** → [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- **See what technologies are used** → [README.md](README.md#-tech-stack)

#### Learn React Basics
- **Understand React hooks** → [EXAMPLES.md - React Hooks](EXAMPLES.md#react-hooks-examples)
- **Learn about components** → [README.md - Key Concepts](README.md#-key-concepts-explained)
- **Study example modules** → Look at `src/modules/*.tsx`

#### Learn Server-Side Rendering
- **How SSR works** → [README.md - How It Works](README.md#-how-it-works)
- **SSR flow diagram** → [DIAGRAMS.md - Request Flow](DIAGRAMS.md#-complete-requestresponse-flow)
- **SSR implementation** → [ARCHITECTURE.md - SSR Deep Dive](ARCHITECTURE.md#-ssr-deep-dive)

#### Learn MobX
- **MobX basics** → [README.md - MobX Pattern](README.md#3-mobx-store-pattern)
- **MobX flow diagram** → [DIAGRAMS.md - MobX State Flow](DIAGRAMS.md#-mobx-state-flow)
- **Working with stores** → [EXAMPLES.md - Working with MobX](EXAMPLES.md#working-with-mobx)

#### Learn TypeScript
- **TypeScript in this project** → [README.md - TypeScript](README.md#1-typescript)
- **TypeScript patterns** → [EXAMPLES.md - TypeScript Patterns](EXAMPLES.md#typescript-patterns)
- **Type definitions** → Look at `src/types/*.ts`

#### Learn Code Splitting
- **Code splitting explained** → [README.md - Code Splitting](README.md#code-splitting-with-loadablecomponent)
- **Component loading flow** → [DIAGRAMS.md - Component Loading](DIAGRAMS.md#-component-loading-flow)
- **Implementation** → [ARCHITECTURE.md - Module System](ARCHITECTURE.md#-module-system)

#### Extend the App
- **Add a new module** → [QUICKSTART.md - Next Steps](QUICKSTART.md#3-create-your-own-module)
- **Module templates** → [EXAMPLES.md - Creating New Modules](EXAMPLES.md#creating-new-modules)
- **Add a new store** → [EXAMPLES.md - Working with MobX](EXAMPLES.md#creating-a-new-store)

#### Understand Architecture
- **Architecture overview** → [ARCHITECTURE.md](ARCHITECTURE.md)
- **Visual diagrams** → [DIAGRAMS.md](DIAGRAMS.md)
- **Build process** → [ARCHITECTURE.md - Build Process](ARCHITECTURE.md#-build-process)

#### Troubleshoot
- **Common issues** → [QUICKSTART.md - Common Issues](QUICKSTART.md#common-issues--solutions)
- **Debugging tips** → [ARCHITECTURE.md - Debugging Tips](ARCHITECTURE.md#-debugging-tips)

---

## 📋 Document Descriptions

### QUICKSTART.md
**"I just want to run it!"**

The fastest way to get started. Covers:
- ✅ Prerequisites
- ✅ Installation steps
- ✅ Build & run commands
- ✅ Testing it works
- ✅ Common issues
- ✅ First changes tutorial

**Estimated reading time:** 5 minutes

---

### README.md
**"Teach me everything!"**

Complete project documentation. Covers:
- ✅ Tech stack details
- ✅ Project structure
- ✅ How SSR works
- ✅ Code splitting explained
- ✅ MobX reactivity
- ✅ All key concepts
- ✅ Learning resources

**Estimated reading time:** 20-30 minutes

---

### ARCHITECTURE.md
**"I want deep technical knowledge!"**

Deep dive into architecture decisions. Covers:
- ✅ Architecture patterns
- ✅ Module system design
- ✅ State management strategy
- ✅ SSR pipeline details
- ✅ Build process internals
- ✅ Request lifecycle
- ✅ Performance optimizations

**Estimated reading time:** 45-60 minutes

---

### EXAMPLES.md
**"Show me code I can copy!"**

Ready-to-use code snippets. Covers:
- ✅ Module templates
- ✅ MobX patterns
- ✅ Context usage
- ✅ Styled components
- ✅ React hooks
- ✅ TypeScript patterns
- ✅ Useful snippets

**Use as:** Reference while coding

---

### DIAGRAMS.md
**"I learn visually!"**

Visual architecture diagrams. Covers:
- ✅ Application architecture
- ✅ Request/response flow
- ✅ Component loading
- ✅ MobX state flow
- ✅ Styled components SSR
- ✅ Build process
- ✅ File dependencies
- ✅ Context hierarchy

**Use as:** Visual reference

---

### PROJECT_SUMMARY.md
**"Give me the overview!"**

High-level project summary. Covers:
- ✅ What you have
- ✅ File structure
- ✅ How to use
- ✅ What it demonstrates
- ✅ Next steps
- ✅ Quality checklist

**Estimated reading time:** 10 minutes

---

## 🎓 Learning Paths

### Beginner Path
1. Read [QUICKSTART.md](QUICKSTART.md) - Get it running
2. Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Understand what it is
3. Read sections of [README.md](README.md) - Learn key concepts
4. Study `src/modules/*.tsx` - Read the code
5. Reference [EXAMPLES.md](EXAMPLES.md) - When making changes

### Intermediate Path
1. Complete Beginner Path
2. Read [README.md](README.md) fully - Complete understanding
3. Study [DIAGRAMS.md](DIAGRAMS.md) - Visualize the architecture
4. Read [ARCHITECTURE.md](ARCHITECTURE.md) sections - Go deeper
5. Create your own modules - Practice

### Advanced Path
1. Complete Intermediate Path
2. Read [ARCHITECTURE.md](ARCHITECTURE.md) fully - Master the details
3. Study build configs (`webpack.*.js`, `tsconfig.json`) - Build knowledge
4. Extend the architecture - Add features
5. Optimize and customize - Make it yours

---

## 📁 Source Code Guide

### Entry Points
- `src/client.tsx` - Browser entry (hydration)
- `src/server/index.ts` - Server entry (Hapi)
- `src/App.tsx` - React root component

### Core Directories
- `src/modules/` - Feature modules (start here!)
- `src/stores/` - MobX stores
- `src/context/` - React Context providers
- `src/types/` - TypeScript definitions
- `src/utils/` - Utility functions
- `src/server/` - SSR logic

### Configuration Files
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `.babelrc` - Babel config
- `webpack.client.js` - Client build
- `webpack.server.js` - Server build

---

## 🔍 Search Tips

### Find by Technology

**React:**
- Components → `src/modules/*.tsx`, `src/App.tsx`
- Hooks → [EXAMPLES.md - React Hooks](EXAMPLES.md#react-hooks-examples)
- Patterns → [README.md - Key Concepts](README.md#-key-concepts-explained)

**MobX:**
- Store → `src/stores/AppStore.ts`
- Usage → `src/modules/ButtonModule.tsx`
- Guide → [ARCHITECTURE.md - MobX Architecture](ARCHITECTURE.md#-state-management)

**TypeScript:**
- Types → `src/types/*.ts`
- Patterns → [EXAMPLES.md - TypeScript Patterns](EXAMPLES.md#typescript-patterns)
- Config → `tsconfig.json`

**SSR:**
- Implementation → `src/server/render.tsx`
- Flow → [DIAGRAMS.md - Request Flow](DIAGRAMS.md#-complete-requestresponse-flow)
- Details → [ARCHITECTURE.md - SSR Deep Dive](ARCHITECTURE.md#-ssr-deep-dive)

**Styled Components:**
- Usage → `src/modules/*.tsx`
- Patterns → [EXAMPLES.md - Styled Components](EXAMPLES.md#styled-components-patterns)
- SSR → [DIAGRAMS.md - Styled Components Flow](DIAGRAMS.md#-styled-components-ssr-flow)

---

## ❓ FAQ Locations

**How do I add a new module?**
→ [QUICKSTART.md - Create Your Own Module](QUICKSTART.md#3-create-your-own-module)

**How does SSR work?**
→ [README.md - How It Works](README.md#-how-it-works)
→ [ARCHITECTURE.md - SSR Deep Dive](ARCHITECTURE.md#-ssr-deep-dive)

**What is code splitting?**
→ [README.md - Code Splitting](README.md#code-splitting-with-loadablecomponent)
→ [ARCHITECTURE.md - Module System](ARCHITECTURE.md#-module-system)

**How does MobX update the UI?**
→ [README.md - MobX Reactive Updates](README.md#mobx-reactive-updates)
→ [DIAGRAMS.md - MobX State Flow](DIAGRAMS.md#-mobx-state-flow)

**Why TypeScript?**
→ [README.md - TypeScript](README.md#1-typescript)

**How do I debug?**
→ [ARCHITECTURE.md - Debugging Tips](ARCHITECTURE.md#-debugging-tips)

**What are best practices?**
→ [ARCHITECTURE.md - Best Practices](ARCHITECTURE.md#-best-practices)
→ [EXAMPLES.md - Best Practices Checklist](EXAMPLES.md#best-practices-checklist)

---

## 📞 Still Can't Find It?

1. **Check the table of contents** in each document
2. **Search the file** (Ctrl+F / Cmd+F)
3. **Read the inline code comments** - Every file is documented
4. **Study the examples** in `src/modules/`

---

## 🎉 Happy Learning!

This documentation is designed to help you learn. Take your time, read at your own pace, and don't hesitate to experiment with the code.

**Remember:** Every file has extensive comments. When in doubt, read the code!

---

**Quick Links:**
- [Get Started](QUICKSTART.md)
- [Learn React](README.md)
- [Deep Dive](ARCHITECTURE.md)
- [Code Examples](EXAMPLES.md)
- [Visual Diagrams](DIAGRAMS.md)
- [Project Summary](PROJECT_SUMMARY.md)
