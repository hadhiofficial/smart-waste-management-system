# System Architecture & Data Flow

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     REACT APPLICATION                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          App.jsx (React Router Setup)                   │   │
│  │  - Routes: /login, /signup, /dashboard                  │   │
│  │  - AuthGuard wrapper on protected routes                │   │
│  └──────────────────────────────────────────┬──────────────┘   │
│                                              │                   │
│  ┌───────────────────────────────────────────▼─────────────┐   │
│  │         AuthProvider (AuthContext)                       │   │
│  │  - Global auth state (user, loading, error)             │   │
│  │  - Auth methods (signup, login, logout)                 │   │
│  │  - Subscribes to Supabase auth changes                  │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │                                    │
│     ┌───────────────────────┼───────────────────────┐           │
│     │                       │                       │           │
│     ▼                       ▼                       ▼           │
│  ┌─────────┐            ┌─────────┐           ┌─────────┐      │
│  │ Login   │   OAuth    │ SignUp  │  Verify   │Dashboard│      │
│  │Component│  ◄────────►│ Component           │Component│      │
│  └────┬────┘            └────┬────┘           └──┬──────┘      │
│       │                      │                    │              │
│       │   useAuth()          │    useData()       │              │
│       └──────────┬───────────┴─────────┬─────────┘              │
│                  │                     │                        │
│       ┌──────────▼─────────────────────▼────────┐              │
│       │   Custom Hooks Layer                    │              │
│       │  - useAuth(): Get auth context          │              │
│       │  - useData(): Manage table CRUD         │              │
│       └──────────┬─────────────────────┬────────┘              │
│                  │                     │                        │
│       ┌──────────▼─────────────────────▼────────┐              │
│       │   Services Layer                        │              │
│       │  - authService.js (auth operations)    │              │
│       │  - dataService.js (CRUD operations)    │              │
│       │  - supabaseClient.js (SDK setup)       │              │
│       └──────────┬─────────────────────┬────────┘              │
│                  │                     │                        │
│                  └──────────┬──────────┘                        │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │ SUPABASE CLIENT    │
                    │ (@supabase/js ver) │
                    └─────────┬──────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
         ┌────────┐      ┌────────┐      ┌─────────┐
         │ Auth   │      │Database│      │Real-time│
         │Service │      │ (REST) │      │ Updates │
         └───┬────┘      └───┬────┘      └────┬────┘
             │                │                │
             └────────────────┼────────────────┘
                              │
                    ┌─────────▼──────────────────┐
                    │   SUPABASE BACKEND         │
                    │  (PostgreSQL + Auth)       │
                    │                            │
                    │ • Authentication           │
                    │ • Row Level Security (RLS) │
                    │ • Database Tables          │
                    │ • Real-time Subscriptions  │
                    └────────────────────────────┘
```

---

## 🔄 Authentication Flow

```
User NOT Authenticated                User Authenticated

    ┌──────────────┐                    ┌──────────────┐
    │  /login      │                    │ /dashboard   │
    │  /signup     │                    └──────────────┘
    └──────┬───────┘                            │
           │                                    │
           │  Enter email/password              │  User data loaded
           │  or click Gmail/GitHub             │  from Supabase
           │                                    │
           ▼                                    ▼
    ┌──────────────────┐            ┌──────────────────┐
    │ authService.js   │            │ AuthContext      │
    │ signup() or      │  ──────►   │ isAuthenticated  │
    │ login()          │            │ = true           │
    └──────┬───────────┘            └────────┬─────────┘
           │                                 │
           │  Send to Supabase.auth          │
           │  Create user record             │  Components can:
           │  Return JWT token               │  • Access user data
           ▼                                 │  • Call protected APIs
    ┌──────────────────────┐                │  • Logout
    │ Supabase Auth        │                │
    │ • Create user        │                │
    │ • Issue JWT token    │                ▼
    │ • Store session      │         ┌────────────────┐
    └──────┬───────────────┘         │ Logout button  │
           │                         │ Clear session  │
           │  Return token + user    │ Redirect /login│
           │                         └─────┬──────────┘
           ▼                               │
    ┌──────────────────┐                   │
    │ Frontend Update  │                   │
    │ • Save token     │                   │
    │ • Set user state │                   ▼
    │ • Redirect       │            ┌──────────────┐
    └──────┬───────────┘            │ /login
           │                         └──────────────┘
           │
           ▼
    ┌──────────────────┐
    │ /dashboard       │
    │ Access Granted   │
    └──────────────────┘
```

---

## 📊 CRUD Data Flow

```
USER REQUEST → FRONTEND → SUPABASE → DATABASE → RESPONSE → UI UPDATE

1. READ (Get All Tasks)
   ┌─────────────────┐
   │ViewData clicked │
   └────────┬────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │useData('tasks')              │
   │ - Returns initial data: null │
   │ - Sets loading: true         │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │dataService.getAll('tasks')   │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │supabase.from('tasks')        │
   │  .select('*')                │
   │  .order('created_at')        │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │Supabase Server               │
   │ 1. Check RLS policy          │
   │ 2. Verify user auth.uid()    │
   │ 3. Filter by user_id         │
   │ 4. Return matching rows      │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │Frontend receives data        │
   │ - Sets tasks: [...]          │
   │ - Sets loading: false        │
   │ - No error                   │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │Display DataTable             │
   │ - Render rows                │
   │ - Show edit/delete buttons   │
   └──────────────────────────────┘

2. CREATE (Add New Task)
   ┌─────────────────┐
   │Add Task clicked │
   └────────┬────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │Form submit                   │
   │ - title: "Buy groceries"     │
   │ - description: "For weekend" │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │useData.create(newRecord)     │
   │ - Auto-adds user_id          │
   │ - Sets loading: true         │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │dataService.create('tasks')   │
   │  - Calls insert method       │
   │  - Returns full record       │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │supabase.from('tasks')        │
   │  .insert([{                  │
   │    user_id: 'auth-id',       │
   │    title: '...',             │
   │    description: '...'        │
   │  }])                         │
   │  .select()                   │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │Supabase Server               │
   │ 1. Check RLS insert policy   │
   │ 2. Verify user_id = auth.uid │
   │ 3. Insert row                │
   │ 4. Generate ID, timestamps   │
   │ 5. Return full record        │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │Frontend receives new record  │
   │ - Adds to state array        │
   │ - Sets loading: false        │
   │ - Shows success message      │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │DataTable updates             │
   │ - New row appears            │
   │ - Can edit/delete it         │
   └──────────────────────────────┘

3. UPDATE (Edit Task)
   Same pattern as CREATE,
   but uses PUT with ID instead of INSERT

4. DELETE (Remove Task)
   Same pattern as CREATE,
   but uses DELETE and removes from state array
```

---

## 🔐 Row Level Security (RLS) Flow

```
User 1 Tries to Access User 2's Data

Frontend Request:
```sql
SELECT * FROM tasks WHERE id = 'task-from-user-2'
```

↓

Supabase Server Receives Request:
1. Check token → Get User 1's ID
2. Read RLS Policy:
   "SELECT allowed WHERE user_id = auth.uid()"
3. Try to match:
   - User 1 ID: "aaa-bbb-ccc"
   - Task user_id: "xxx-yyy-zzz"
   - Match? NO ✗
4. Return: Empty result or error

↓

Frontend:
- Gets empty array
- Shows "No data found"
- Never exposes other users' data


User 1 Accesses Own Data

Frontend Request:
```sql
SELECT * FROM tasks WHERE id = 'task-from-user-1'
```

↓

Supabase Server:
1. Check token → Get User 1's ID
2. Read RLS Policy:
   "SELECT allowed WHERE user_id = auth.uid()"
3. Try to match:
   - User 1 ID: "aaa-bbb-ccc"
   - Task user_id: "aaa-bbb-ccc"
   - Match? YES ✓
4. Return: [task object]

↓

Frontend:
- Gets task data
- Displays it
```

---

## 🔗 Component Hierarchy

```
App.jsx
├── Router (React Router setup)
└── AuthProvider
    ├── Route: /login
    │   └── Login Component
    │       └── useAuth() hook
    │           └── authService calls
    │
    ├── Route: /signup
    │   └── SignUp Component
    │       └── useAuth() hook
    │           └── authService calls
    │
    └── Route: /dashboard
        └── AuthGuard (checks isAuthenticated)
            └── Dashboard Component
                ├── Header (user info, logout)
                ├── Tabs
                │   ├── Tab 1: View Data
                │   │   └── DataTable Component
                │   │       └── useData() hook
                │   │           └── dataService calls
                │   │
                │   ├── Tab 2: Add Data
                │   │   └── AddData Component
                │   │       └── useData() hook
                │   │           └── dataService.create()
                │   │
                │   └── Tab 3: Documentation
                │       └── Quick reference
                │
                └── useAuth() hook for user data

Reusable Components:
- All use either useAuth() or useData()
- Both hooks manage loading/error states
- Components are data-agnostic (pass table name as prop)
```

---

## 💾 State Management Pattern

```
Global State (AuthContext)
├── user (object or null)
├── loading (boolean)
├── error (string or null)
└── Methods:
    ├── signup(email, password)
    ├── login(email, password)
    ├── logout()
    ├── resetPassword(email)
    └── updatePassword(newPassword)

Local Component State
├── DataTable Component
│   ├── searchTerm
│   ├── searchColumn
│   ├── editingId
│   └── editValues
│
└── Form Components
    ├── formData {fields...}
    ├── loading (for submit)
    └── localError

Hook State (useData)
├── data (array)
├── loading (boolean)
├── error (string)
└── Methods:
    ├── fetchData()
    ├── refetch()
    ├── create(record)
    ├── update(id, updates)
    ├── delete(id)
    └── search(column, term)

Flow:
Component renders → Uses hook → Hook reads context/calls service → 
Supabase responds → Update hook state → Component re-renders
```

---

## 🌐 Environment Variable Flow

```
Development:
1. Create .env file (never commit)
2. npm run dev
3. Vite reads .env
4. Replace VITE_* in code at build time
5. Code: import.meta.env.VITE_SUPABASE_URL

Production (Vercel Example):
1. Deploy code (no .env committed)
2. Vercel Dashboard → Environment Variables
3. Add: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
4. Build step: npm run build
5. Vite replaces VITE_* from hosting env vars
6. Deployed code has values baked in
```

---

## 📱 Responsive Design Breakpoints

```
Desktop (> 768px)
├── Full sidebar
├── Multi-column layout
├── Full-size modals
└── All features visible

Tablet (481px - 768px)
├── Single column with sidebar
├── Adjusted fonts
├── Touch-friendly buttons
└── Some features hidden

Mobile (< 480px)
├── Stacked layout
├── Hamburger menu (you can add)
├── Small buttons
├── Optimized forms
└── Minimalist design

All breakpoints defined in CSS:
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }
```

---

## 🔄 Real-time Subscription Flow

```
Component Mounts
      │
      ▼
useData('tasks')
      │
      ▼
dataService.getAll('tasks')
      │
      ▼
supabase.from('tasks')
  .on('*', callback)
  .subscribe()
      │
      ▼
Connection Established to Supabase

User A Inserts New Task
      │
      ▼
Supabase Broadcasts to All Subscribers
      │
      ├──► User A's Browser: "New task from User A"
      │    → RLS allows (user_id matches)
      │    → Update state → Re-render
      │
      └──► User B's Browser: "New task from User A"
           → RLS denies (user_id doesn't match)
           → Ignores in callback

Result: Real-time updates, but only for your own data
```

---

## 🚀 Deployment Flow

```
Development
├── npm install
├── Create .env
├── npm run dev
└── localhost:5173

Production Build
├── npm run build
├── Creates dist/ folder
│   ├── index.html (with JS/CSS embedded)
│   ├── assets/
│   │   ├── main-HASH.js (minified)
│   │   └── style-HASH.css (minified)
│   └── ...
└── Ready to deploy

Deployment (Vercel)
├── Push to GitHub
├── Vercel auto-detects Vite project
├── Runs: npm install && npm run build
├── Sets environment variables
├── Deploys dist/ to CDN
└── Your app lives at: yourproject.vercel.app

First User Access
├── Browser requests index.html from CDN
├── Loads JavaScript + CSS bundles
├── React mounts App component
├── AuthContext loads saved session (if exists)
├── If no session → Show Login
├── If session exists → Load Dashboard
└── App is interactive
```

---

## 📝 Summary

```
┌─────────────────────────────────────────────────────────────┐
│                   COMPLETE SYSTEM                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (React + Vite)                                    │
│  │                                                           │
│  ├─ UI Components (Login, SignUp, Dashboard, Tables)       │
│  │                                                           │
│  ├─ State Management                                        │
│  │  ├─ Global: AuthContext (user, auth methods)            │
│  │  └─ Hooks: useAuth(), useData()                          │
│  │                                                           │
│  ├─ Services Layer                                          │
│  │  ├─ authService (signup, login, OAuth, etc)             │
│  │  ├─ dataService (CRUD + subscriptions)                  │
│  │  └─ supabaseClient (Supabase setup)                     │
│  │                                                           │
│  └─ Styling (CSS files + responsive mobile design)         │
│                                                              │
│  ↓↑ (Network Communication)                                │
│                                                              │
│  Backend (Supabase)                                         │
│  │                                                           │
│  ├─ Authentication                                          │
│  │  ├─ Sign up / Login (email + OAuth)                     │
│  │  ├─ Session management                                   │
│  │  └─ JWT tokens                                           │
│  │                                                           │
│  ├─ Database (PostgreSQL)                                  │
│  │  ├─ Tables (tasks, users, etc)                          │
│  │  ├─ Row Level Security (RLS)                            │
│  │  └─ Real-time Subscriptions                             │
│  │                                                           │
│  └─ File Storage (Supabase Storage)                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

This architecture ensures:
- ✅ Scalability (stateless frontend)
- ✅ Security (RLS + ANON_KEY)
- ✅ Performance (optimized queries)
- ✅ Reliability (error handling)
- ✅ Maintainability (clean separation of concerns)
