# Smart Retail Inventory & Demand Forecasting Platform — Frontend

A production-ready React 18 + Vite frontend for managing retail inventory, demand forecasting, supplier relationships, purchase orders, analytics, and team access control.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [Project Structure](#project-structure)
7. [Available Scripts](#available-scripts)
8. [API Integration](#api-integration)
9. [Routing & Route Protection](#routing--route-protection)
10. [State Management](#state-management)
11. [Performance Optimizations](#performance-optimizations)
12. [Deployment](#deployment)
13. [Browser Support](#browser-support)

---

## Features

| Module | Description |
|---|---|
| **Authentication** | JWT login/register, protected routes, RBAC |
| **Dashboard** | Real-time KPI cards, sales & demand charts, alerts |
| **Inventory Management** | CRUD, search, filter, pagination, stock status |
| **Demand Forecasting** | AI predictions, product-wise breakdown, recommendations |
| **Analytics** | Sales reports, inventory health, trend charts |
| **Supplier Management** | Supplier directory, performance ratings, contact info |
| **Purchase Orders** | Order lifecycle, status tracking, supplier linkage |
| **Notifications** | Smart alerts, mark-read, category filters |
| **Reports & Export** | CSV/PDF export, date-range filtering, print view |
| **Settings** | Store prefs, notifications config, system settings |
| **User Management** | Role-based access, permission matrix, invite/remove users |
| **Profile** | Personal info, password change, progress tracker |

---

## Tech Stack

| Layer | Library / Tool |
|---|---|
| UI | React 18 |
| Build | Vite 5 |
| Routing | React Router v6 |
| Styling | Tailwind CSS 3 |
| HTTP | Axios (interceptors, timeout, 401/403/5xx handling) |
| Charts | Recharts 2 |
| Icons | Lucide React |
| State | React Context API (AuthContext, NotificationContext) |
| Code quality | ESLint (react, react-hooks, react-refresh plugins) |

---

## Prerequisites

- **Node.js** v18 or later — [nodejs.org](https://nodejs.org/)
- **npm** v9+ (bundled with Node.js)
- A running instance of the Smart Retail Backend API

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/faizalmohammad1501/smart-retail-inventory-demand-forecasting-frontend.git
cd smart-retail-inventory-demand-forecasting-frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL

# 4. Start the dev server
npm run dev
# Opens http://localhost:3000
```

---

## Environment Variables

Copy `.env.example` to `.env` (development) or `.env.production` (production build):

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend REST API base URL | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Application display name | `Smart Retail Platform` |
| `VITE_APP_ENV` | Environment tag | `development` |

> All Vite env vars must be prefixed with `VITE_` to be exposed to the browser bundle.

---

## Project Structure

```
src/
├── assets/                  # Static images & fonts
├── components/
│   ├── common/              # Shared: Navbar, Sidebar, Loader, ProtectedRoute,
│   │                        #         ErrorBoundary, AppInitializer
│   ├── dashboard/           # DashboardCard, SalesChart, DemandChart, …
│   ├── reports/             # ReportTable, ExportButtons
│   ├── settings/            # SettingSection, ToggleSwitch, PermissionMatrix,
│   │                        #   FeedbackBanner, ConfirmActionDialog
│   └── ui/                  # Design-system primitives: Button, Badge, Alert,
│                            #   Tabs, Modal, FormField, SkeletonLoader, …
├── constants/
│   └── uiConfig.js          # Design tokens, breakpoints, animation keys
├── context/
│   ├── AuthContext.jsx      # user, login, logout, updateUser
│   └── NotificationContext.jsx
├── hooks/
│   ├── useCustomHooks.js    # useFetch, useForm
│   ├── useUIEnhancements.js # useResponsive, useDebounce, useOutsideClick
│   └── useApiRequest.js     # Imperative one-off API call hook
├── layouts/
│   └── DashboardLayout.jsx  # Navbar + Sidebar + per-page ErrorBoundary
├── pages/
│   ├── auth/                # Login, Register
│   ├── dashboard/           # Dashboard, Inventory, Forecast, Reports,
│   │                        #   Suppliers, Orders, Notifications, Profile,
│   │                        #   Settings, UserManagement
│   └── NotFound.jsx         # 404 page
├── routes/
│   └── AppRoutes.jsx        # All routes; dashboard pages are lazy-loaded
├── services/
│   └── api.js               # Axios instance + all service groups
│                            # (auth, inventory, forecast, analytics,
│                            #  supplier, purchaseOrder, notification,
│                            #  profile, settings, user, reports, health)
├── utils/
│   ├── accessibilityUtils.js
│   └── performanceUtils.js  # formatCurrency, formatNumber, debounce, groupBy, …
├── App.jsx
├── main.jsx
└── index.css                # Tailwind base + 70+ custom utility classes
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Production build → `dist/` |
| `npm run build:staging` | Staging build (uses `.env.staging`) |
| `npm run preview` | Preview production build on port 4173 |
| `npm run lint` | ESLint (zero warnings policy) |
| `npm run lint:fix` | ESLint with auto-fix |

---

## API Integration

All HTTP communication goes through `src/services/api.js`:

- **Base URL** — read from `VITE_API_BASE_URL`  
- **Auth** — Bearer token injected from `localStorage` on every request  
- **Timeout** — 30 s global; 5 s for health checks  
- **401** — Clears token and redirects to `/login`  
- **403** — Rejects with a human-readable "Access denied" message  
- **5xx** — Rejects with "A server error occurred. Please try again later."

Available service groups: `authService`, `inventoryService`, `forecastService`,  
`analyticsService`, `supplierService`, `purchaseOrderService`,  
`notificationService`, `profileService`, `settingsService`,  
`userService`, `reportsService`, `healthService`.

### useApiRequest hook

For imperative/mutation calls (form submits, button actions):

```jsx
import useApiRequest from '../hooks/useApiRequest'

const { execute, loading, error } = useApiRequest()

const handleSave = async () => {
  await execute(
    () => inventoryService.update(id, payload),
    {
      onSuccess: () => toast('Saved!'),
      onError: (msg) => toast.error(msg),
    }
  )
}
```

---

## Routing & Route Protection

All dashboard routes are wrapped in `<ProtectedRoute>`, which:

1. Shows a loader while auth state initialises
2. Redirects unauthenticated users to `/login`
3. Accepts an optional `roles` prop for role-based access control:

```jsx
<Route
  path="users"
  element={
    <ProtectedRoute roles={['admin']}>
      <Suspense fallback={<PageLoader />}><UserManagement /></Suspense>
    </ProtectedRoute>
  }
/>
```

All dashboard page components are **lazy-loaded** via `React.lazy` + `Suspense`, producing separate JS chunks per route for faster initial load.

---

## State Management

| Store | Contents |
|---|---|
| `AuthContext` | `user`, `loading`, `login()`, `register()`, `logout()`, `updateUser()` |
| `NotificationContext` | `notifications`, `unreadCount`, `markRead()`, `addNotification()` |

---

## Performance Optimizations

- **Route-level code splitting** — each dashboard page is a separate JS chunk  
- **Manual chunk splitting** (vite.config.js) — `vendor-react`, `vendor-recharts`, `vendor-icons`, `vendor-axios`  
- **`es2020` build target** — eliminates dead transforms for modern browsers  
- **Immutable asset caching** — `Cache-Control: max-age=31536000, immutable` on `/assets/*` (vercel.json)  
- **`useApiRequest` cleanup** — prevents state updates on unmounted components  
- **`useFetch` cleanup** — `isMounted` guard cancels stale responses

---

## Deployment

### Vercel (recommended)

1. Connect your GitHub repo to [vercel.com](https://vercel.com)  
2. Set **Build Command** → `npm run build`  
3. Set **Output Directory** → `dist`  
4. Add environment variables from `.env.production` in the Vercel dashboard  
5. Vercel picks up `vercel.json` automatically (SPA rewrites + security headers)

### Other static hosts (Netlify, AWS S3, etc.)

```bash
npm run build
# Upload the dist/ folder
# Add a rewrite rule: /* → /index.html (SPA fallback)
```

---

## Browser Support

Targets the last 2 versions of Chrome, Firefox, Safari, and Edge (ES2020+).  
IE 11 is **not** supported.

---

*Built with React + Vite + Tailwind CSS — Smart Retail Platform*

