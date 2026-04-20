# React + Vite

# Invoice App — HNG Stage 2

A fully functional Invoice Management App built with React + Vite. Matches the Figma design.

## Features

- ✅ Create, Read, Update, Delete invoices
- ✅ Save as Draft / Send as Pending
- ✅ Mark invoices as Paid
- ✅ Filter by status (All / Draft / Pending / Paid)
- ✅ Dark / Light mode toggle (persisted)
- ✅ Full form validation with error states
- ✅ Data persisted via localStorage
- ✅ Fully responsive (320px → desktop)
- ✅ Keyboard accessible, semantic HTML, WCAG AA contrast
- ✅ Delete confirmation modal (ESC to close)
- ✅ Hover states on all interactive elements

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

## Deploy

Push to GitHub and connect to Vercel — it auto-detects Vite.

## Architecture

```
src/
├── components/
│   ├── Sidebar.jsx          # Logo + theme toggle + avatar
│   ├── InvoiceList.jsx      # List view with filter
│   ├── InvoiceDetail.jsx    # Full invoice + delete modal
│   ├── InvoiceForm.jsx      # Create/Edit drawer with validation
│   └── StatusBadge.jsx      # Paid / Pending / Draft badge
├── context/
│   └── AppContext.jsx        # Global state (theme + invoices)
├── hooks/
│   └── useLocalStorage.js   # Persistent state hook
├── utils/
│   ├── invoice.js           # Helpers: format, validate, generate ID
│   └── seedData.js          # 5 sample invoices
├── App.jsx                  # Layout + view routing
└── index.css                # Global styles + CSS variables
```

## Design Decisions

- CSS Modules for component-scoped styles — no class name conflicts
- CSS custom properties for theming — instant dark/light switch
- No router library — simple view state in App.jsx (overkill for this scope)
- LocalStorage via custom hook with JSON serialization
- Seed data loads only on first visit (localStorage check)

## Accessibility

- All form fields have `<label for="">` associations
- Delete modal traps logical focus, closes on ESC
- Status badges have aria-label
- All buttons have accessible names
- Keyboard navigable throughout
- Focus-visible rings on all interactive elements
- WCAG AA color contrast in both themes

## Known Limitations

- No drag-to-reorder items in form
- No invoice PDF export
- Single user (no auth)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
